# CargoFlow API

Lightweight lead-capture API for the CargoFlow marketing site. No authentication;
not a fleet-management system. Base URL in local dev: `http://localhost:3000`.

All responses are JSON. Validation errors and malformed request bodies return
`400`, never `500`.

## Error shape

Any validation failure returns:

```json
{
  "success": false,
  "error": "Validation failed.",
  "fields": [
    { "field": "email", "message": "Required" }
  ]
}
```

`fields` is omitted for non-validation errors (e.g. 404, malformed JSON, 500).

---

## GET /api/health

Unlimited rate (no rate limiter applied). Returns service liveness.

**Success response — 200**

```json
{
  "status": "ok",
  "timestamp": "2026-08-29T04:10:21.318Z",
  "uptime": 7.0116935
}
```

---

## POST /api/quotes

Rate limited to 20 requests / 15 minutes per IP.

### Request fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `fullName` | string | yes | max 120 chars |
| `companyName` | string | no | max 200 chars |
| `email` | string | yes | must be a valid email, max 200 chars |
| `phone` | string | yes | max 40 chars |
| `serviceType` | string | yes | must be exactly one of: `Aviation Parts Transportation`, `Freight Forwarding`, `Business Shipping`, `Other` |
| `cargoDescription` | string | yes | max 4000 chars |
| `origin` | string | yes | max 200 chars |
| `destination` | string | yes | max 200 chars |
| `pickupDate` | string | no | free-form date string |
| `requestedDeliveryDate` | string | no | free-form date string |
| `approximateWeight` | string | no | |
| `pieces` | string | no | |
| `specialHandlingRequirements` | string | no | max 4000 chars |
| `additionalNotes` | string | no | max 4000 chars |
| `consentToContact` | boolean | yes | must be exactly `true` |

All string fields are trimmed. Required fields must be non-empty after trimming.

### Success response — 201

```json
{
  "success": true,
  "referenceNumber": "CFG-Q-2026-0001",
  "message": "Quote request received."
}
```

`referenceNumber` follows `CFG-Q-<year>-<0001-padded sequence>`, sequential per
calendar year and persisted (derived from the max existing reference number
for the year in SQLite, so it survives restarts and never resets mid-year).

### Error response — 400

```json
{
  "success": false,
  "error": "Validation failed.",
  "fields": [
    { "field": "email", "message": "Required" },
    { "field": "consentToContact", "message": "You must consent to be contacted." }
  ]
}
```

---

## POST /api/contact

Rate limited to 20 requests / 15 minutes per IP.

### Request fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | max 120 chars |
| `company` | string | no | max 200 chars |
| `email` | string | yes | must be a valid email, max 200 chars |
| `phone` | string | no | max 200 chars |
| `subject` | string | yes | max 200 chars |
| `message` | string | yes | max 4000 chars |

### Success response — 201

```json
{
  "success": true,
  "message": "Message received."
}
```

### Error response — 400

```json
{
  "success": false,
  "error": "Validation failed.",
  "fields": [
    { "field": "message", "message": "This field is required." }
  ]
}
```

---

## Persistence

SQLite via Node's built-in `node:sqlite` (`DatabaseSync`), file at
`server/data/cargoflow.db`. Created automatically on first run, including the
`data/` directory. Tables: `quotes`, `contacts`. Data survives server restarts.

## Email notifications

`src/services/notificationService.ts` exposes `sendQuoteNotification` and
`sendContactNotification`. By default (local demo, no credentials needed) they
log one concise line to the console. To wire up real delivery in production,
set these env vars and fill in the SMTP/provider call inside
`notificationService.ts` where marked:

- `NOTIFY_EMAIL` — destination inbox for lead notifications
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — or swap in a provider
  SDK (e.g. Resend, SendGrid) instead of raw SMTP

## Configuration

See `server/.env.example`. Key vars: `PORT` (default 3000), `NODE_ENV`,
`CORS_ORIGIN` (default `http://localhost:5173`).
