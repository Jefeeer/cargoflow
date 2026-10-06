-- CargoFlow lead capture: quote requests, contact messages, per-year reference counter.
-- Idempotent: safe to run more than once.

create table if not exists quotes (
  id bigint generated always as identity primary key,
  reference_number text not null unique,
  full_name text not null,
  company_name text,
  email text not null,
  phone text not null,
  service_type text not null,
  cargo_description text not null,
  origin text not null,
  destination text not null,
  pickup_date text,
  requested_delivery_date text,
  approximate_weight text,
  pieces text,
  special_handling_requirements text,
  additional_notes text,
  consent_to_contact boolean not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists contacts (
  id bigint generated always as identity primary key,
  name text not null,
  company text,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- Reference numbers (CFG-Q-<year>-<seq>) come from an atomic upsert on this table.
create table if not exists quote_counters (
  year integer primary key,
  seq integer not null
);

-- Lock the tables away from Supabase's public Data API (anon/authenticated keys).
-- RLS on + no policies = no access for those roles. The site's server connects as the
-- database owner, which bypasses RLS.
alter table quotes enable row level security;
alter table contacts enable row level security;
alter table quote_counters enable row level security;
