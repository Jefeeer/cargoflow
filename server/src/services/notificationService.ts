import { config } from '../config.js';
import type { ContactRequest, QuoteRequest } from '../types.js';

// Email-ready abstraction. In dev (or whenever SMTP_* / NOTIFY_EMAIL are
// unset) this just logs a single safe line — no real credentials needed for
// a local demo.
//
// To wire up real email delivery in production:
//   1. Set NOTIFY_EMAIL to the destination inbox.
//   2. Set SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS (or swap in a
//      provider SDK, e.g. Resend/SendGrid) in the two send* functions below.
//   3. Replace the console.log calls with the actual send call.

function canSendEmail(): boolean {
  return Boolean(config.notifyEmail && config.smtp.host);
}

export function sendQuoteNotification(referenceNumber: string, quote: QuoteRequest): void {
  if (canSendEmail()) {
    // ponytail: plug real SMTP/provider client here using config.smtp + config.notifyEmail.
  }
  console.log(
    `[notify] quote ${referenceNumber} from ${quote.email} (${quote.serviceType}) -> ${
      config.notifyEmail ?? 'console only'
    }`,
  );
}

export function sendContactNotification(contact: ContactRequest): void {
  if (canSendEmail()) {
    // ponytail: plug real SMTP/provider client here using config.smtp + config.notifyEmail.
  }
  console.log(
    `[notify] contact message from ${contact.email} subject="${contact.subject}" -> ${
      config.notifyEmail ?? 'console only'
    }`,
  );
}
