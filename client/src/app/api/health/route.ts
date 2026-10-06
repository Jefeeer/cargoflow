import type { HealthResponse } from '@/lib/types';
import { pingDatabase } from '@/server/db';
import { json } from '@/server/http';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const database = await pingDatabase();
    return json<HealthResponse & { database: string }>({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database,
    });
  } catch (err) {
    console.error(err);
    return json({ status: 'degraded', timestamp: new Date().toISOString(), database: 'unreachable' }, 503);
  }
}
