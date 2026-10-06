# CargoFlow — Marketing & Lead-Generation Website

A premium, conversion-focused website for **CargoFlow LLC** (North Miami, Florida) — a
logistics partner specializing in **aviation parts transportation**, **freight
forwarding**, and **small-to-medium business shipping**, from Miami to destinations
across the United States.

This is a marketing + lead-gen site. The primary conversion action everywhere is
**Get a Quote**. It is intentionally *not* a fleet-management SaaS platform.

> Local only. This project is **not** connected to GitHub, Vercel, or any remote —
> nothing is committed or deployed.

---

## Highlights

- **"Airside" identity** — a visual language borrowed from airfield signage (black-on-yellow
  direction signs, yellow-on-black location signs) and air-cargo paperwork. Warm paper,
  ink black, signal yellow; Archivo (variable width axis) for display and IBM Plex Mono for
  data labels.
- **Signature visuals, all hand-built SVG/CSS (no WebGL):** a split-flap departures board
  in the hero, a taxiway-style sign array as service navigation, an engineering drawing of
  a turbofan with interactive callouts, a specimen shipment record for the tracking demo,
  and a dot-matrix US map with routes radiating from the Miami hub.
- **Fast first paint** — every page is statically prerendered; the hero's entrance motion
  is pure CSS so the headline paints before hydration.
- **Complete conversion path** — service-specific CTAs deep-link to
  `/quote?service=aviation|freight|business` and preselect the matching service type.
- **Accessible quote & contact forms** — React Hook Form + Zod, field-level errors,
  focus management, loading/success/error states.
- **Lightweight Express API** — quote/contact capture with validation, SQLite
  persistence, reference numbers, and an email-ready notification abstraction.
- **Accessibility & SEO baked in** — semantic HTML, keyboard nav, visible focus,
  reduced-motion support, per-route titles/meta, Open Graph, JSON-LD.

---

## Tech stack

| Layer     | Tech |
|-----------|------|
| Frontend  | Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4, Motion, React Hook Form + Zod, Axios |
| Backend   | Node.js 24, Express 4, TypeScript, **node:sqlite** (built-in), Zod, Helmet, CORS, express-rate-limit |

### Why `node:sqlite` instead of better-sqlite3?

`better-sqlite3` is a native addon and needs Visual Studio C++ build tools, which aren't
available on the target machine (its install fails at `node-gyp`). Node 24 ships a
built-in SQLite (`node:sqlite`) that needs **zero native compilation**. It is gated
behind `--experimental-sqlite`, which is already wired into the server's npm scripts via
`cross-env`, so you don't pass any flags manually.

---

## Project structure

```
cargoflow/
├── client/                     # Next.js frontend (port 5173)
│   ├── next.config.ts          # /api/* rewrite to the Express server
│   ├── public/                 # favicon.svg, og-cover.svg
│   └── src/
│       ├── app/                # App Router: layout (fonts, metadata, JSON-LD), globals.css
│       │                       # (design tokens + primitives), one folder per route, not-found
│       ├── lib/                # types.ts (API contract), api.ts (client), content.ts (copy),
│       │                       # usMap.ts (dot-map projection + routes)
│       └── components/
│           ├── site/           # SiteHeader, SiteFooter, PageHero, ServiceDetail, ClosingCTA …
│           ├── home/           # Hero, SignArray, ServicesIndex, AviationFeature, ProcessRoute …
│           ├── visuals/        # DepartureBoard, EngineBlueprint, SpecimenWaybill, NetworkMap
│           ├── forms/          # QuoteForm, ContactForm, Field (waybill-style inputs)
│           └── ui/             # Arrow, Logo, Reveal, SectionLabel
│
├── server/                     # Express + TypeScript backend (port 3000)
│   ├── .env.example
│   └── src/
│       ├── index.ts / app.ts / config.ts / types.ts
│       ├── db/                 # node:sqlite bootstrap + table creation
│       ├── validation/         # zod schemas
│       ├── services/           # referenceService, notificationService (email-ready)
│       ├── controllers/        # quote, contact
│       ├── routes/             # quotes, contact, health
│       └── middleware/         # errorHandler, notFound
│   └── data/                   # cargoflow.db (created at runtime; git-ignored)
│
├── docs/
│   ├── api.md                  # API reference
│   └── build-summary.md        # design + build rationale
├── tests/
│   ├── test-plan.md
│   └── report.md               # QA results
└── README.md
```

---

## Prerequisites

- **Node.js ≥ 22** (developed and verified on **Node 24**). `node:sqlite` requires Node 22+.
- npm 10+.

---

## Getting started

Dependencies are already installed. From a clean clone you'd run `npm install` in each of
`client/` and `server/` first.

### 1. Start the backend (port 3000)

```bash
cd server
npm run dev
```

- Health check: <http://localhost:3000/api/health>
- Creates `server/data/cargoflow.db` on first run.
- Production style: `npm run build && npm start`.

### 2. Start the frontend (port 5173)

```bash
cd client
npm run dev
```

- App: <http://localhost:5173>
- Quote: <http://localhost:5173/quote>  ·  Contact: <http://localhost:5173/contact>
- The API (`/api/quotes`, `/api/contact`, `/api/health`) is built into the Next.js app as
  route handlers in `client/src/app/api/`. No separate server is needed.
- Leads are stored in Supabase Postgres (`POSTGRES_URL`). Without it, local dev falls back
  to an in-memory store so the forms still work; production requires it.
- The legacy Express server in `server/` is no longer used by the site.

### Frontend production build

```bash
cd client
npm run build      # next build -> .next/ (all routes prerendered as static)
npm start          # serve the built app on :5173
```

### Database (Supabase)

```bash
cd client
vercel env pull .env.local --yes   # pulls POSTGRES_URL* from the Supabase integration
node scripts/migrate.mjs           # applies supabase/migrations/*.sql (idempotent)
```

### Deploying

Hosted on Vercel (project `cargoflowgroup`, root directory `client`). Pushing to `main`
deploys production; `vercel deploy` from the repo root makes a preview.

---

## Environment variables

**server/.env** (see `server/.env.example`)

| Var | Default | Purpose |
|-----|---------|---------|
| `PORT` | `3000` | API port |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed browser origin |
| `NODE_ENV` | `development` | Hides stack traces when `production` |
| `NOTIFY_EMAIL` / `SMTP_*` | *(unset)* | Optional — real email notifications (no creds needed for local demo) |

**client/.env**

| Var | Default | Purpose |
|-----|---------|---------|
| `POSTGRES_URL` | *(set by the Supabase integration)* | Pooled Postgres connection used by the API routes |
| `POSTGRES_URL_NON_POOLING` | *(set by the Supabase integration)* | Direct connection, used by `scripts/migrate.mjs` |
| `NEXT_PUBLIC_API_URL` | *(empty)* | Optional — call the API at another base URL instead of same-origin `/api` |

---

## API (summary)

Full reference in [`docs/api.md`](docs/api.md).

| Method | Path | Purpose |
|--------|------|---------|
| `GET`  | `/api/health` | Liveness — `{ status, timestamp, uptime }` |
| `POST` | `/api/quotes` | Create a quote request → `{ success, referenceNumber, message }` |
| `POST` | `/api/contact` | Create a contact inquiry → `{ success, message }` |

Validation failures return `400 { success:false, error, fields:[{field,message}] }`.
Reference numbers look like `CFG-Q-2026-0001` and persist/increment across restarts.

---

## Content integrity

Copy lives in one place — `client/src/lib/content.ts` — and reflects only CargoFlow's
real positioning. The site deliberately contains **no** fabricated testimonials,
certifications, partnerships, customer logos, shipment volumes, or guarantees, and none
of the unrelated content from the legacy site (loans, USSD, e-cash, airtime, utility
payments, "Alt Solutions"). The tracking widget and network map are clearly labeled as
illustrative demo/conceptual visuals, not live operational data.

---

## Accessibility & performance notes

- Respects `prefers-reduced-motion` globally: CSS animations collapse, Motion transforms
  jump to their end state (`MotionConfig reducedMotion="user"`), the split-flap board and
  map pulses render static.
- Semantic headings, labeled controls, skip link, visible focus rings, accessible form
  validation (first invalid field is focused; errors are announced).
- No WebGL or 3D libraries; visuals are SVG/CSS. Scroll reveals have a `<noscript>`
  fallback so content is visible without JavaScript.
