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

- **Premium B2B logistics identity** — deep-navy foundations, orange "signal" accents,
  Space Grotesk / Inter typography, technical grid detailing.
- **Interactive 3D Miami logistics network** (Three.js / React Three Fiber) behind the
  hero and in the network section — glowing Miami hub, animated route arcs, traveling
  shipment dots, subtle camera drift + mouse parallax.
- **Graceful 3D degradation** — lazy-loaded canvas; automatic SVG/CSS fallback for
  `prefers-reduced-motion`, missing WebGL, or small/low-power screens. The site is fully
  usable with no 3D at all.
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
| Frontend  | React 18, Vite 5, TypeScript, Tailwind CSS 3, React Router 6, Three.js + @react-three/fiber + @react-three/drei, Framer Motion, React Hook Form + Zod, Axios |
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
├── client/                     # React + Vite frontend (port 5173)
│   ├── index.html              # SEO meta, Open Graph, JSON-LD, fonts
│   ├── tailwind.config.js      # design tokens (ink / signal / steel, fonts)
│   ├── vite.config.ts          # @ alias, /api dev proxy, 3D code-splitting
│   ├── public/                 # favicon.svg, og-cover.svg
│   └── src/
│       ├── index.css           # design-system primitives (.btn/.card/.container-cf …)
│       ├── lib/                # types.ts (API contract), api.ts (client), content.ts (copy)
│       ├── components/
│       │   ├── 3d/             # MiamiNetworkScene + SVG fallback (isolated)
│       │   ├── home/           # Hero, Services, Aviation, Process, WhyCargoFlow, Technology, Network …
│       │   ├── forms/          # QuoteForm, ContactForm
│       │   └── shared/         # Navbar, Footer, SectionHeader, Reveal …
│       ├── pages/              # Home, Quote, Contact, Aviation, Freight, BusinessShipping, About, Privacy, Terms, 404
│       ├── layouts/            # MarketingLayout
│       └── hooks/              # useDocumentMeta, useReducedMotion, useMediaQuery …
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
- In dev, the frontend calls relative `/api/*`, which Vite proxies to the backend on
  `:3000` — so start the backend too for form submissions to succeed.

### Frontend production build

```bash
cd client
npm run build      # tsc -b && vite build  ->  dist/
npm run preview    # serve the built app
```

For a production build pointing at a hosted API, set `VITE_API_URL` in `client/.env`
(e.g. `https://api.cargoflowgroup.com`).

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
| `VITE_API_URL` | *(empty)* | Empty in dev (use Vite proxy); set to the API base URL for prod builds |

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

- Respects `prefers-reduced-motion` globally (scroll, parallax, camera, decorative motion).
- Semantic headings, labeled controls, visible focus rings, accessible form validation.
- 3D is code-split and lazy-loaded; `three`/`r3f` are isolated vendor chunks so they never
  block first paint. Canvas DPR is capped and shadows/post-processing are off.
