import 'server-only';
import type { ZodError } from 'zod';
import type { ApiErrorResponse } from '@/lib/types';

export function json<T>(body: T, status = 200) {
  return Response.json(body, { status });
}

export function validationError(error: ZodError) {
  return json<ApiErrorResponse>(
    {
      success: false,
      error: 'Validation failed.',
      fields: error.issues.map((issue) => ({
        field: issue.path.join('.') || 'body',
        message: issue.message,
      })),
    },
    400,
  );
}

export function serverError(err: unknown) {
  console.error(err);
  return json<ApiErrorResponse>({ success: false, error: 'Internal server error.' }, 500);
}

const MAX_BODY_BYTES = 100 * 1024;

/** Parses a JSON body with the same limits/messages as the old Express server. */
export async function readJson(req: Request): Promise<{ ok: true; data: unknown } | { ok: false; res: Response }> {
  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) {
    return { ok: false, res: json<ApiErrorResponse>({ success: false, error: 'Request body too large.' }, 413) };
  }
  try {
    return { ok: true, data: JSON.parse(text) };
  } catch {
    return { ok: false, res: json<ApiErrorResponse>({ success: false, error: 'Malformed JSON body.' }, 400) };
  }
}

// Best-effort rate limit: 20 submissions per IP per 15 minutes, per function instance.
// Serverless instances don't share memory, so this blunts bursts rather than enforcing a
// hard global cap; move it to Redis/Postgres if abuse becomes real.
const WINDOW_MS = 15 * 60 * 1000;
const LIMIT = 20;
const hits = new Map<string, number[]>();

export function rateLimited(req: Request): Response | null {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    return json<ApiErrorResponse>({ success: false, error: 'Too many requests. Please try again later.' }, 429);
  }
  recent.push(now);
  hits.set(ip, recent);
  return null;
}
