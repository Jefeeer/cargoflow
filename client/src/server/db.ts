import 'server-only';
import postgres from 'postgres';
import type { ContactInput, QuoteInput } from './schemas';

// Lead storage in Supabase Postgres. The Supabase Vercel integration injects POSTGRES_URL
// (the pooled connection). Schema lives in supabase/migrations/.
//
// Without a connection string in development, an in-memory store is used so the forms
// still work locally; production refuses to start without one.

type Sql = ReturnType<typeof postgres>;

let client: Sql | null = null;

function connectionString(): string | undefined {
  return process.env.POSTGRES_URL?.trim() || process.env.DATABASE_URL?.trim() || undefined;
}

/** Lazily created so `next build` never needs database credentials. */
function getSql(): Sql | null {
  const url = connectionString();
  if (!url) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('POSTGRES_URL is not set — connect the Supabase integration to this project.');
    }
    return null;
  }
  // prepare: false — Supabase's pooler runs in transaction mode, which can't hold prepared statements.
  client ??= postgres(url, { prepare: false, max: 3, idle_timeout: 20 });
  return client;
}

// ---------- Dev fallback ----------
const memory = { counters: new Map<number, number>(), quotes: [] as unknown[], contacts: [] as unknown[] };
let warned = false;
function warnMemory() {
  if (warned) return;
  warned = true;
  console.warn('[db] POSTGRES_URL not set — using in-memory storage (development only, not persisted).');
}

function formatReference(year: number, seq: number) {
  return `CFG-Q-${year}-${String(seq).padStart(4, '0')}`;
}

/** Inserts a quote and returns its reference number, e.g. CFG-Q-2026-0001. */
export async function insertQuote(q: QuoteInput): Promise<string> {
  const year = new Date().getFullYear();
  const sql = getSql();

  if (!sql) {
    warnMemory();
    const seq = (memory.counters.get(year) ?? 0) + 1;
    memory.counters.set(year, seq);
    const referenceNumber = formatReference(year, seq);
    memory.quotes.push({ ...q, referenceNumber });
    return referenceNumber;
  }

  return sql.begin(async (tx) => {
    // Atomic per-year counter: safe across concurrent serverless instances.
    const [{ seq }] = await tx<{ seq: number }[]>`
      insert into quote_counters (year, seq) values (${year}, 1)
      on conflict (year) do update set seq = quote_counters.seq + 1
      returning seq
    `;
    const referenceNumber = formatReference(year, seq);
    await tx`
      insert into quotes (
        reference_number, full_name, company_name, email, phone, service_type,
        cargo_description, origin, destination, pickup_date, requested_delivery_date,
        approximate_weight, pieces, special_handling_requirements, additional_notes,
        consent_to_contact
      ) values (
        ${referenceNumber}, ${q.fullName}, ${q.companyName ?? null}, ${q.email}, ${q.phone}, ${q.serviceType},
        ${q.cargoDescription}, ${q.origin}, ${q.destination}, ${q.pickupDate ?? null}, ${q.requestedDeliveryDate ?? null},
        ${q.approximateWeight ?? null}, ${q.pieces ?? null}, ${q.specialHandlingRequirements ?? null}, ${q.additionalNotes ?? null},
        ${q.consentToContact}
      )
    `;
    return referenceNumber;
  });
}

export async function insertContact(c: ContactInput): Promise<void> {
  const sql = getSql();
  if (!sql) {
    warnMemory();
    memory.contacts.push(c);
    return;
  }
  await sql`
    insert into contacts (name, company, email, phone, subject, message)
    values (${c.name}, ${c.company ?? null}, ${c.email}, ${c.phone ?? null}, ${c.subject}, ${c.message})
  `;
}

export async function pingDatabase(): Promise<'ok' | 'memory'> {
  const sql = getSql();
  if (!sql) return 'memory';
  await sql`select 1`;
  return 'ok';
}
