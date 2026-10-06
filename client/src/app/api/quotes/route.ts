import type { QuoteResponse } from '@/lib/types';
import { quoteSchema } from '@/server/schemas';
import { insertQuote } from '@/server/db';
import { json, rateLimited, readJson, serverError, validationError } from '@/server/http';

export async function POST(req: Request) {
  const limited = rateLimited(req);
  if (limited) return limited;

  const body = await readJson(req);
  if (!body.ok) return body.res;

  const parsed = quoteSchema.safeParse(body.data);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const referenceNumber = await insertQuote(parsed.data);
    // Notification hook (email-ready): wire a provider such as Resend here.
    console.log(`[notify] quote ${referenceNumber} from ${parsed.data.email} (${parsed.data.serviceType})`);
    return json<QuoteResponse>({ success: true, referenceNumber, message: 'Quote request received.' }, 201);
  } catch (err) {
    return serverError(err);
  }
}
