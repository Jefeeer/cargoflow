# CargoFlow Group Website Redesign

## Project Goal

Rebuild the public CargoFlow website into a premium, modern, conversion-focused logistics
site that quickly answers *who CargoFlow is, what they transport, why to trust them, where
they operate, and how to request a quote* — and drives every path toward **Get a Quote**.
It is a marketing + lead-generation site, deliberately scoped away from a fleet-management
platform.

## Existing Website Problems Addressed

- **Off-brand / irrelevant content** — the legacy site carried testimonials and copy about
  loans, USSD, e-cash, airtime, utility payments, and "Alt Solutions." All of it is gone;
  copy is rebuilt from CargoFlow's real positioning only.
- **Weak credibility & dated visuals** — replaced with a sophisticated B2B logistics visual
  language (deep navy, signal orange, technical grid detailing, crisp type).
- **Unclear service naming** — the confusing "S&M Business Shipping" is presented
  professionally as **Business Shipping Solutions**.
- **Thin lead generation** — a single, consistent primary CTA (Get a Quote) is repeated at
  every decision point, with service-specific deep links that preselect the service.
- **No real quote/contact capture** — added a validated backend that persists leads and is
  ready to send email notifications.

## New Design Direction

A premium, technology-driven logistics identity:

- **Palette** — `ink` (deep navy/charcoal foundations), `signal` (bright cargo orange for
  CTAs/accents), `steel` (cool blue-gray surfaces and technical detail).
- **Typography** — Space Grotesk (display) + Inter (body) + JetBrains Mono (technical
  labels).
- **Details** — technical grid backdrops, route/arc motifs, strong whitespace, a reusable
  primitive layer (`.btn`, `.card`, `.container-cf`, `.kicker`, `.section`) that keeps the
  whole site visually coherent.

Explicitly avoided: crypto/gaming/childish-3D/generic-template aesthetics.

## 3D Experience

A stylized **Miami logistics network** built with React Three Fiber:

- A glowing **Miami hub** marker over a technical ground grid.
- Animated **bezier route arcs** fanning out to destination markers.
- **Traveling shipment dots** along the arcs; slow camera drift + gentle mouse parallax.

It reinforces the story *"Local expertise. National reach."* — used subtly behind the hero
(pointer-events-off, never blocking the headline or CTAs) and in the Network section.

**Strategic, not decorative, and robust:**

- Lazy-loaded via `React.lazy` + `Suspense`; `three`/`r3f` isolated into their own vendor
  chunks so first paint is never blocked.
- Capped DPR, no shadows, no post-processing.
- Automatic fallback to a pure **SVG/CSS route map** when `prefers-reduced-motion` is set,
  WebGL is unavailable, or the screen is small/low-power; route and particle counts scale
  down on small viewports. All decorative 3D is `aria-hidden`.

## Landing Page

Home sections, in order: **Hero** (with 3D) → **Positioning** (values: Integrity,
Adaptability, Service, Resilience) → **Services** (`#services`) → **Aviation
specialization** → **How CargoFlow Works** (4-step process) → **Why CargoFlow** (`#why`) →
**Technology** (visibility milestones + clearly-labeled demo tracking card) → **Network**
(Miami-based, nationwide) → **About teaser** → **Quote CTA**.

## Aviation Positioning

Given prominence because it differentiates CargoFlow from generic local delivery: a
dedicated "Built for Time-Critical Aviation Logistics" section and page emphasizing
precision, urgency, communication, careful handling, and reliable scheduling — with an
aviation-specific quote CTA. No certifications are claimed (none were provided).

## Freight Forwarding

Presents the port → warehouse → carrier → destination flow, with shipment/carrier
coordination, smart routing, cost-conscious planning, timeline management, and tracking.
Dedicated page + `?service=freight` quote deep link.

## Business Shipping

Renamed to **Business Shipping Solutions** — local and interstate logistics for growing
SMBs: retail inventory, wholesale orders, multi-location distribution, business deliveries,
recurring shipments. Dedicated page + `?service=business` quote deep link.

## CTA Strategy

One primary action — **Get a Quote** — used consistently and contextually:

| Location | Label | Destination |
|----------|-------|-------------|
| Navbar | Get a Quote | `/quote` |
| Hero | Get a Free Quote | `/quote` |
| Aviation | Request Aviation Quote | `/quote?service=aviation` |
| Freight | Request Freight Quote | `/quote?service=freight` |
| Business | Request Business Shipping Quote | `/quote?service=business` |
| Final CTA | Get a Free Quote | `/quote` |

No primary CTA points to `#`. The `?service=` param preselects the matching Service Type in
the quote form (`serviceLabelFromKey`).

## Quote Flow

`/quote` — contact details (name, company, email, phone) + shipment details (service type,
cargo description, origin, destination, pickup/delivery dates, weight, pieces, special
handling), an "additional notes" field, and a required consent checkbox. React Hook Form +
Zod validation, accessible errors (label association, `aria-invalid`, `aria-describedby`,
`role="alert"`, focus-first-invalid), loading state, and a success view that shows the
returned **reference number**. No response-time is promised (none was provided).

## Contact Flow

`/contact` — name, company, email, phone, subject, message → `POST /api/contact`. Displays
CargoFlow LLC, North Miami, Florida, and a `mailto:info@cargoflowgroup.com` link, plus
success/error states.

## Backend

Lightweight Express + TypeScript API focused purely on lead capture (no auth, no fleet
management). Helmet, configurable CORS, a 100 kb JSON body limit, rate limiting on the POST
routes, centralized error handling (stack traces hidden in production), and a JSON 404
handler.

## API Architecture

- `GET /api/health` — status/timestamp/uptime.
- `POST /api/quotes` — validated; persisted; returns `CFG-Q-<year>-NNNN` reference.
- `POST /api/contact` — validated; persisted.
- Zod validation with a consistent `{ success:false, error, fields:[] }` error envelope.
- **Persistence:** Node's built-in `node:sqlite` at `server/data/cargoflow.db`
  (`quotes`, `contacts` tables). Data and the reference sequence survive restarts.
- **Email-ready:** `notificationService` logs a concise line in dev and documents exactly
  where a real SMTP/provider integration plugs in via env — no credentials needed locally.
- Layered structure (routes / controllers / services / validation / middleware / db) — no
  god file.

## Responsive Design

Mobile-first Tailwind; card grids stack at `sm`/`lg`; `.container-cf` manages gutters at
375 / 768 / 1024 / 1440+. 3D canvas scales and reduces work on small screens; the SVG
fallback covers the rest.

## Accessibility

Semantic HTML with one `h1` per page and logical heading order; keyboard-navigable with a
real focus trap in the mobile menu (Tab/Shift-Tab cycle, Escape to close, focus returns to
the toggle); visible focus rings; labeled controls and accessible validation; sufficient
contrast on the dark palette; `prefers-reduced-motion` respected globally; decorative 3D is
`aria-hidden` and the site is fully understandable without it.

## Performance

- 3D isolated + lazy-loaded; `three` (≈683 kB) and `r3f` (≈274 kB) split into their own
  chunks that don't block first paint; app chunk ≈321 kB (all well-compressed with gzip).
- Capped DPR, no shadows/post-processing, fonts loaded with `preconnect` + `display=swap`.

## Testing

QA authored `tests/test-plan.md` (12 areas, concrete cases grounded in the real contract)
and executed an integrated pass with both servers live — results in `tests/report.md`.
Backend endpoints, validation, persistence (including restart), content accuracy, CTA
wiring, and form logic are exercised programmatically; live-GPU 3D, pixel-level responsive,
and contrast/axe checks are noted where they require a manual browser.

## Known Limitations

- **3D runtime, visual responsive, and contrast/axe** need a real browser/GPU for full
  confidence — verified here via source/config review and marked accordingly.
- **Reference sequence** is single-process safe (seeded from the DB max per year); a
  multi-instance deployment would need a transactional counter.
- **Anti-spam** is the rate limiter only (no captcha/honeypot).
- No automated unit/e2e test suite (not requested); verification is manual + scripted.
- Demo tracking data and the network map are illustrative, not a live tracking system.

## Production Recommendations

- Wire `notificationService` to a real provider (SendGrid/SES/SMTP) via env.
- Front the API with HTTPS; set `NODE_ENV=production` and a locked-down `CORS_ORIGIN`.
- Add a captcha/honeypot to the public forms if spam appears.
- Consider server-side rendering or prerendering the marketing pages for SEO/first paint,
  and add a real OG raster image + sitemap/robots.
- Move persistence to a managed database if lead volume or multi-instance scaling is needed.

## How to Run

See the [README](../README.md). In short: `cd server && npm run dev` (port 3000), then
`cd client && npm run dev` (port 5173) → open <http://localhost:5173>.
