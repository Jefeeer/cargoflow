// Applies supabase/migrations/*.sql in order. Usage: node scripts/migrate.mjs
// Reads POSTGRES_URL_NON_POOLING (preferred for DDL) or POSTGRES_URL from .env.local.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import postgres from 'postgres';

if (existsSync('.env.local')) process.loadEnvFile('.env.local');
const url = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
if (!url) {
  console.error('No POSTGRES_URL_NON_POOLING / POSTGRES_URL. Run `vercel env pull .env.local` first.');
  process.exit(1);
}

const sql = postgres(url, { prepare: false, max: 1 });
const dir = 'supabase/migrations';
for (const file of readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()) {
  await sql.unsafe(readFileSync(`${dir}/${file}`, 'utf8'));
  console.log(`applied ${file}`);
}
await sql.end();
