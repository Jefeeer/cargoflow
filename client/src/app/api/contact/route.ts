import type { ContactResponse } from '@/lib/types';
import { contactSchema } from '@/server/schemas';
import { insertContact } from '@/server/db';
import { json, rateLimited, readJson, serverError, validationError } from '@/server/http';

export async function POST(req: Request) {
  const limited = rateLimited(req);
  if (limited) return limited;

  const body = await readJson(req);
  if (!body.ok) return body.res;

  const parsed = contactSchema.safeParse(body.data);
  if (!parsed.success) return validationError(parsed.error);

  try {
    await insertContact(parsed.data);
    // Notification hook (email-ready): wire a provider such as Resend here.
    console.log(`[notify] contact message from ${parsed.data.email} subject="${parsed.data.subject}"`);
    return json<ContactResponse>({ success: true, message: 'Message received.' }, 201);
  } catch (err) {
    return serverError(err);
  }
}
