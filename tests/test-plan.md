# CargoFlow Redesign — Test Plan

Author: QA
Status: DRAFT — authored while Frontend/Backend build is in progress. NOT YET EXECUTED.
Scope owned by QA: `tests/**` only. No source under `client/**` or `server/**` was modified to produce this plan.

## How to use this document

- Each test case has a stable ID, steps, expected result, and a `Result` column to fill in during execution: `PASS` / `FAIL` / `NOT TESTED`.
- Default state for every case right now is `NOT TESTED`.
- When a case fails, record the bug in `tests/report.md` (Bugs Found) with the Test ID as a cross-reference.
- Environment assumptions: Frontend dev server at `http://localhost:5173` (Vite), Backend at `http://localhost:3000` (Express), SQLite file at `server/data/cargoflow.db`.

## Reference facts (from shared contract — for grounding expected results)

Source: `client/src/lib/types.ts`, `client/src/lib/content.ts`, `server/src/validation/schemas.ts`, `server/src/db/index.ts`, `server/src/app.ts`.

- Company: **CargoFlow LLC**, North Miami, Florida, email **info@cargoflowgroup.com**.
- Services (key -> label -> route -> quote preselect):
  - `aviation` -> "Aviation Parts Transportation" -> `/aviation` -> `/quote?service=aviation`
  - `freight` -> "Freight Forwarding" -> `/freight` -> `/quote?service=freight`
  - `business` -> "Business Shipping Solutions" (nav/footer label: "Business Shipping") -> `/business-shipping` -> `/quote?service=business`
  - `other` -> "Other" (no dedicated page/CTA)
- Hero primary CTA: "Get a Free Quote" -> `/quote`. Hero secondary CTA: "Explore Our Services" -> `/#services`.
- Nav items: Services (`/#services`), Aviation (`/aviation`), Freight Forwarding (`/freight`), Business Shipping (`/business-shipping`), About (`/about`), Why CargoFlow (`/#why`), Contact (`/contact`). Nav "Get a Quote" CTA -> `/quote` (button not in NAV_ITEMS list — verify it's rendered separately).
- Final/bottom-of-page CTA (QUOTE_CTA): primary "Get a Free Quote" -> `/quote`, secondary "Contact CargoFlow" -> `/contact`.
- Aviation page CTA: "Get an Aviation Shipping Quote" -> `/quote?service=aviation`. Per-service card CTAs: "Request Aviation Quote" / "Request Freight Quote" / "Request Business Shipping Quote".
- Footer: legal links `/privacy`, `/terms`; service links to the three service routes; "Request a Quote" -> `/quote`.
- Quote request fields (`QuoteRequest` in `types.ts`): `fullName*`, `companyName`, `email*`, `phone*`, `serviceType*`, `cargoDescription*`, `origin*`, `destination*`, `pickupDate`, `requestedDeliveryDate`, `approximateWeight`, `pieces`, `specialHandlingRequirements`, `additionalNotes`, `consentToContact*` (must be boolean `true`). `*` = required per `quoteSchema`.
- Quote success message (`QUOTE_SUCCESS` in content.ts): "Thank you. Your quote request has been received. The CargoFlow team will be able to review your shipment information." Response includes `referenceNumber` formatted `CFG-Q-<year>-<4-digit-seq>` (e.g. `CFG-Q-2026-0001`) — sequence persists across restarts (backed by DB max-lookup).
- Contact fields (`ContactRequest`): `name*`, `company`, `email*`, `phone`, `subject*`, `message*`. Success message (`CONTACT_SUCCESS`): "Thank you. Your message has been received."
- Error envelope (400, validation failures): `{ success: false, error: "Validation failed.", fields: [{ field, message }, ...] }`. Non-validation server errors: `{ success: false, error: <message> }`, status 500. Malformed JSON body: 400, `error: "Malformed JSON body."`. Body size cap: `100kb` (express.json limit) — oversized body should be rejected (413 or 400 depending on how Express/body-parser surfaces the limit error; verify actual status during execution).
- Rate limiting: both `/api/quotes` and `/api/contact` are limited to 20 requests / 15 minutes per IP (express-rate-limit, standard headers on). Verify 429 behavior is at least not broken (do not exhaust this in normal test passes — reserve a dedicated case).
- `GET /api/health` -> 200, `{ status: "ok", timestamp: <ISO>, uptime: <number> }`.
- Unknown routes -> handled by `notFound` middleware (verify exact shape/status during execution).
- CORS: server restricts to `config.corsOrigin` — confirm this is set to allow `http://localhost:5173` in dev.
- No content in `content.ts` includes: Alt Solutions, loans, USSD, e-cash, airtime, utility payments, Ghana references, testimonials, certifications/badges, partner/customer logos, or invented stats/guarantees. `TRACKING_DEMO` and `NETWORK` visualizations are explicitly labeled as illustrative/demo, not live data — must double check they render with that disclaimer visible, not just in code comments.

---

## 1. Content Accuracy

### 1.A — Required content present

| ID | Steps | Expected Result | Result |
|----|-------|------------------|--------|
| CA-01 | Load `/`. Search page text for "CargoFlow LLC" (footer or about mention). | "CargoFlow LLC" appears verbatim somewhere on the home page or is reachable within 1 click (e.g. footer/about). | NOT TESTED |
| CA-02 | Load `/` and `/about`. Search for "North Miami" and "Florida". | Location "North Miami, Florida" (or "North Miami, FL") appears on home and/or about page. | NOT TESTED |
| CA-03 | Load `/`, `/contact`, footer on every page. Search for "info@cargoflowgroup.com". | Email address appears in footer site-wide and on the Contact page. | NOT TESTED |
| CA-04 | Load `/`, `/aviation`. Search for "Aviation Parts Transportation". | Exact phrase present on home services section and Aviation page title/eyebrow. | NOT TESTED |
| CA-05 | Load `/`, `/freight`. Search for "Freight Forwarding". | Exact phrase present on home services section and Freight page title. | NOT TESTED |
| CA-06 | Load `/`, `/business-shipping`. Search for "Business Shipping". | Phrase ("Business Shipping" / "Business Shipping Solutions") present on home and Business Shipping page. | NOT TESTED |
| CA-07 | Load `/`. Read hero kicker/subhead. | Miami-based / national-reach positioning is stated (e.g. "Miami-based logistics · National reach", "Miami to destinations across the United States"). | NOT TESTED |
| CA-08 | Load `/about`. Read headquarters/reach facts. | States HQ = North Miami, Florida; Reach = Nationwide/United States. | NOT TESTED |

### 1.B — Prohibited content absent (must NOT appear anywhere in the rendered site)

| ID | Steps | Expected Result | Result |
|----|-------|------------------|--------|
| CA-09 | Full-text scan (view-source / rendered DOM) of every route: `/`, `/quote`, `/contact`, `/aviation`, `/freight`, `/business-shipping`, `/about`, `/privacy`, `/terms`. Search (case-insensitive) for "Alt Solutions". | No match. | NOT TESTED |
| CA-10 | Same scan. Search for "loan", "loans". | No match. | NOT TESTED |
| CA-11 | Same scan. Search for "USSD". | No match. | NOT TESTED |
| CA-12 | Same scan. Search for "e-cash", "ecash". | No match. | NOT TESTED |
| CA-13 | Same scan. Search for "airtime". | No match. | NOT TESTED |
| CA-14 | Same scan. Search for "utility payment", "utility bill". | No match. | NOT TESTED |
| CA-15 | Same scan. Search for "Ghana", or any non-US country as an operating base, or any named testimonial person/quote block. | No match; no testimonials section at all per approved content. | NOT TESTED |
| CA-16 | Same scan. Search for certification badges/seals (e.g. "ISO", "certified", images named like `badge-*`, `cert-*`). | No fabricated certification claims or badge graphics present. | NOT TESTED |
| CA-17 | Same scan. Look for "trusted by", "our partners", "as seen in", or logo strips of outside companies. | No fake partnership or customer-logo sections present. | NOT TESTED |
| CA-18 | Same scan. Look for invented numeric claims: e.g. "10,000+ shipments", "99.9% on-time", "since 19xx", specific fleet/vehicle counts, guaranteed delivery-time promises. | No such invented stats/volumes/guarantees appear. `TRACKING_DEMO`/`NETWORK` visuals must carry an explicit "illustrative/demo — not live data" label if rendered. | NOT TESTED |
| CA-19 | Check `<title>` and meta description (SEO component) on each route. | Titles/descriptions reflect real CargoFlow copy, no leftover template/placeholder text (e.g. "Lorem ipsum", "Company Name", "Alt Solutions"). | NOT TESTED |

---

## 2. Navigation & Routing

| ID | Steps | Expected Result | Result |
|----|-------|------------------|--------|
| NAV-01 | From `/`, click logo. | Navigates to `/` (or no-ops if already home). | NOT TESTED |
| NAV-02 | Click each top nav item: Services, Aviation, Freight Forwarding, Business Shipping, About, Why CargoFlow, Contact. | Services -> `/#services` scrolls to section on home (navigates home first if elsewhere); Aviation -> `/aviation`; Freight Forwarding -> `/freight`; Business Shipping -> `/business-shipping`; About -> `/about`; Why CargoFlow -> `/#why`; Contact -> `/contact`. | NOT TESTED |
| NAV-03 | Click nav "Get a Quote" CTA button (distinct from NAV_ITEMS). | Navigates to `/quote` with no service preselected. | NOT TESTED |
| NAV-04 | Resize to mobile width (375px). Open hamburger/mobile menu. | Menu opens, all nav items + quote CTA visible and tappable; icon/state toggles to "close". | NOT TESTED |
| NAV-05 | On mobile menu open, click a nav link. | Menu closes and navigates correctly (no leftover overlay trapping focus/scroll). | NOT TESTED |
| NAV-06 | Directly load deep link `/aviation` (typed URL, not client nav). | Page renders correctly on hard load (no blank page / broken chunk). | NOT TESTED |
| NAV-07 | Repeat NAV-06 for `/freight`, `/business-shipping`, `/quote`, `/quote?service=aviation`, `/contact`, `/about`, `/privacy`, `/terms`. | Each route renders correctly on hard/direct load. | NOT TESTED |
| NAV-08 | On any route, press browser refresh (F5). | Same route reloads without redirecting to `/` or erroring (SPA routing / server fallback configured). | NOT TESTED |
| NAV-09 | Navigate to a non-existent path, e.g. `/does-not-exist`. | Custom 404 page renders (not a blank screen or dev server error), with a way back to home. | NOT TESTED |
| NAV-10 | Use browser Back/Forward after several client-side navigations. | History behaves correctly; scroll position/page state reasonable. | NOT TESTED |
| NAV-11 | Click footer links: service links, About, Why CargoFlow, Contact, Request a Quote, Privacy Policy, Terms. | Each navigates to its documented destination. | NOT TESTED |

---

## 3. 3D Experience (Three.js / R3F)

| ID | Steps | Expected Result | Result |
|----|-------|------------------|--------|
| 3D-01 | Load `/` on desktop with WebGL available. Open devtools console. | 3D hero canvas initializes with no console errors/warnings about context loss or shader compile failures. | NOT TESTED |
| 3D-02 | Observe hero 3D scene for the "Miami hub" element. | A Miami-based hub/marker is visible and identifiable in the scene. | NOT TESTED |
| 3D-03 | Observe scene over 5-10s. | Route/path animation plays (e.g. lines/particles moving from Miami hub outward), not a static frozen frame. | NOT TESTED |
| 3D-04 | Move mouse across the 3D canvas area. | Scene responds to mouse (parallax/rotation/hover highlight), and response stays smooth (no stutter). | NOT TESTED |
| 3D-05 | Scroll the page past the hero. | 3D canvas behaves correctly when scrolled out of view — pauses/unmounts or continues cheaply, no layout jump, no scroll-jank caused by the canvas. | NOT TESTED |
| 3D-06 | Resize browser window (including from wide to narrow and back) while hero is visible. | Canvas resizes to fill container without distortion, stretching, or leftover stale-sized buffer. | NOT TESTED |
| 3D-07 | Load `/` on a simulated mobile device / narrow viewport (devtools device mode, 375px). | Either a lighter 3D experience or a static fallback image/gradient renders — no crash, no oversized canvas breaking layout, acceptable load time. | NOT TESTED |
| 3D-08 | Enable OS/browser "reduce motion" setting, then load `/`. | 3D animation respects reduced-motion preference (static or significantly reduced motion), per `prefers-reduced-motion`. | NOT TESTED |
| 3D-09 | Simulate WebGL unavailable (disable via browser flag or devtools GPU override) and load `/`. | Graceful fallback UI shown (no crash, no blank hero, ideally a message or static visual) instead of a broken canvas or unhandled exception. | NOT TESTED |
| 3D-10 | With 3D scene visible, attempt to click buttons/links that visually overlap or sit near the canvas (e.g. hero CTA). | Canvas does not intercept clicks meant for UI controls (correct pointer-events / z-index layering). | NOT TESTED |
| 3D-11 | Navigate rapidly between `/` and other routes multiple times (5+ times) while watching devtools Performance/Memory tab. | No obvious memory leak (steadily growing heap) or FPS collapse after repeated mount/unmount of the 3D scene. | NOT TESTED |
| 3D-12 | Check `/aviation`, `/freight`, `/business-shipping`, `/about` for any secondary 3D/visualization elements (e.g. NETWORK map). | Any additional visualizations load correctly, are labeled illustrative where applicable, and don't degrade page performance. | NOT TESTED |

---

## 4. CTA Flow

| ID | CTA | Expected Destination | Steps | Result |
|----|-----|----------------------|-------|--------|
| CTA-01 | Hero "Get a Free Quote" (home) | `/quote` (no service param) | Click from `/`. Confirm URL and that Service Type field is unset/default. | NOT TESTED |
| CTA-02 | Nav "Get a Quote" button | `/quote` | Click from any page. Confirm URL, no service preselect. | NOT TESTED |
| CTA-03 | Aviation service card CTA ("Request Aviation Quote", home services section) | `/quote?service=aviation` | Click from home `/#services`. Confirm URL query param. | NOT TESTED |
| CTA-04 | Aviation page CTA ("Get an Aviation Shipping Quote", on `/aviation`) | `/quote?service=aviation` | Click from `/aviation`. Confirm URL query param. | NOT TESTED |
| CTA-05 | Freight service card / page CTA ("Request Freight Quote") | `/quote?service=freight` | Click from home and from `/freight`. Confirm URL query param both times. | NOT TESTED |
| CTA-06 | Business Shipping service card / page CTA ("Request Business Shipping Quote") | `/quote?service=business` | Click from home and from `/business-shipping`. Confirm URL query param both times. | NOT TESTED |
| CTA-07 | Bottom-of-page / final CTA section, primary ("Get a Free Quote") | `/quote` | Scroll to bottom CTA (QUOTE_CTA) on home (or wherever it renders). Click primary. Confirm URL. | NOT TESTED |
| CTA-08 | Bottom-of-page / final CTA section, secondary ("Contact CargoFlow") | `/contact` | Click secondary CTA. Confirm URL. | NOT TESTED |
| CTA-09 | Footer "Request a Quote" | `/quote` | Click from footer on any page. Confirm URL. | NOT TESTED |
| CTA-10 | Service preselect correctness — aviation | On `/quote?service=aviation`, Service Type field/dropdown shows "Aviation Parts Transportation" selected. | NOT TESTED |
| CTA-11 | Service preselect correctness — freight | On `/quote?service=freight`, Service Type shows "Freight Forwarding" selected. | NOT TESTED |
| CTA-12 | Service preselect correctness — business | On `/quote?service=business`, Service Type shows "Business Shipping Solutions" (or configured label) selected. | NOT TESTED |
| CTA-13 | Invalid/unknown `?service=` value, e.g. `/quote?service=bogus` | Form loads without crashing; falls back to no-selection/default rather than showing "undefined". | NOT TESTED |
| CTA-14 | Global CTA href audit | Inspect every clickable CTA site-wide (view source / devtools) for `href="#"` or `href="javascript:void(0)"` used as a placeholder. | No CTA points to a bare `#` or a no-op placeholder link. | NOT TESTED |

---

## 5. Quote Form (`/quote`)

### 5.A — Happy path

| ID | Steps | Expected Result | Result |
|----|-------|------------------|--------|
| QF-01 | Fill all required fields with valid data (fullName, email, phone, serviceType, cargoDescription, origin, destination) + check consent. Submit. | Loading state shown during submit (disabled button/spinner), then success state shown with a reference number formatted `CFG-Q-<year>-XXXX`. | NOT TESTED |
| QF-02 | Repeat QF-01 including all optional fields (companyName, pickupDate, requestedDeliveryDate, approximateWeight, pieces, specialHandlingRequirements, additionalNotes). | Submits successfully; optional fields accepted without validation errors. | NOT TESTED |
| QF-03 | After QF-01 success, inspect network response body. | Response is `{ success: true, referenceNumber, message }` matching `QuoteResponse`; message matches `QUOTE_SUCCESS` copy (or server's "Quote request received." — confirm which the UI displays). | NOT TESTED |
| QF-04 | After QF-01, query `server/data/cargoflow.db` `quotes` table (or restart server and re-query) for the new row. | Row exists with matching reference_number and submitted field values; consent_to_contact = 1. | NOT TESTED |
| QF-05 | Submit a second valid quote immediately after QF-01. | New reference number increments sequence (e.g. `...-0002`) within the same year. | NOT TESTED |
| QF-06 | Restart backend server, then submit another valid quote. | Sequence continues from DB max (does not reset to 0001) — validates in-memory counter reseeds correctly from persisted data. | NOT TESTED |

### 5.B — Validation

| ID | Field / Rule | Steps | Expected Result | Result |
|----|--------------|-------|------------------|--------|
| QF-07 | All fields blank | Submit with nothing filled. | Client-side validation blocks submit (or server returns 400) with field-level messages for every required field (fullName, email, phone, serviceType, cargoDescription, origin, destination, consentToContact). | NOT TESTED |
| QF-08 | Missing fullName only | Fill all other required fields, leave fullName blank. | Error specific to fullName: "This field is required." | NOT TESTED |
| QF-09 | Invalid email format | Enter `not-an-email` in email field, fill rest validly. | Error: "Must be a valid email address." | NOT TESTED |
| QF-10 | Missing email | Leave email blank. | Error: "Email is required." | NOT TESTED |
| QF-11 | Missing phone | Leave phone blank. | Error: "This field is required." | NOT TESTED |
| QF-12 | Phone too long (>40 chars) | Enter 41+ character phone string. | Error: "Phone number is too long." | NOT TESTED |
| QF-13 | Missing/invalid serviceType | Attempt submit without selecting a service (if UI allows) or tamper to invalid value. | Error indicating serviceType must be one of the allowed values. | NOT TESTED |
| QF-14 | Missing cargoDescription | Leave cargo description blank. | Error: "This field is required." | NOT TESTED |
| QF-15 | Missing origin | Leave origin blank. | Error: "This field is required." | NOT TESTED |
| QF-16 | Missing destination | Leave destination blank. | Error: "This field is required." | NOT TESTED |
| QF-17 | Consent checkbox unchecked | Fill all fields validly, leave consent unchecked, submit. | Error: "You must consent to be contacted."; submit is blocked or server returns 400. | NOT TESTED |
| QF-18 | Bad/malformed date in pickupDate or requestedDeliveryDate | Enter clearly invalid date text (if field is freetext) or an out-of-range date (if a date picker). | Form either constrains input (native date picker) or surfaces a sensible validation message; no crash. Note: schema treats these as optional freetext strings — confirm actual UI constraint during execution. | NOT TESTED |
| QF-19 | Non-numeric value in approximateWeight/pieces | Enter letters where a number might be expected. | Confirm whether UI enforces numeric input; schema allows free string — document actual behavior (informational, not necessarily a bug). | NOT TESTED |
| QF-20 | Oversized text in cargoDescription/notes (>4000 chars) | Paste >4000 characters into cargoDescription. | Client truncates/warns, or server returns 400 for exceeding max length. | NOT TESTED |
| QF-21 | Field-level errors clear on correction | Trigger QF-08, then fill fullName correctly. | Error message for that field disappears without needing full resubmit (or at least clears on next submit attempt). | NOT TESTED |

### 5.C — States & backend integration

| ID | Steps | Expected Result | Result |
|----|-------|------------------|--------|
| QF-22 | Throttle network (devtools "Slow 3G") and submit valid form. | Visible loading state persists until response; submit button disabled to prevent double-submit. | NOT TESTED |
| QF-23 | Stop backend server, then submit valid form from already-loaded frontend. | Error state shown to user (e.g. "Something went wrong, please try again") — not a silent failure or raw stack trace. | NOT TESTED |
| QF-24 | With backend down, verify no unhandled promise rejection/console crash. | Console shows a handled network error at most (fetch/axios catch), no red unhandled-exception spam breaking the page. | NOT TESTED |
| QF-25 | Submit valid form twice quickly (double-click submit). | No duplicate quote rows created; button disables after first click. | NOT TESTED |

---

## 6. Contact Form (`/contact`)

| ID | Steps | Expected Result | Result |
|----|-------|------------------|--------|
| CF-01 | Fill name, email, subject, message (all required) validly, submit. | Loading state, then success message matching `CONTACT_SUCCESS` ("Thank you. Your message has been received."). | NOT TESTED |
| CF-02 | Include optional company and phone. | Submits successfully with optional fields included. | NOT TESTED |
| CF-03 | Verify backend persistence: check `contacts` table after CF-01. | Row present with matching data. | NOT TESTED |
| CF-04 | Invalid email format. | Error: "Must be a valid email address." | NOT TESTED |
| CF-05 | Missing name. | Error: "This field is required." on name field. | NOT TESTED |
| CF-06 | Missing message. | Error: "This field is required." on message field. | NOT TESTED |
| CF-07 | Missing subject. | Error: "This field is required." on subject field. | NOT TESTED |
| CF-08 | Backend down, submit valid form. | Error state surfaced to user; no crash. | NOT TESTED |
| CF-09 | Confirm info@cargoflowgroup.com displayed on Contact page. | Email visible as text and/or `mailto:` link. | NOT TESTED |
| CF-10 | Click the mailto link (if present). | Triggers `mailto:info@cargoflowgroup.com` (verify `href`, don't need to complete OS mail client flow). | NOT TESTED |

---

## 7. Backend API (direct, e.g. via curl/Postman — bypassing UI)

| ID | Request | Expected Result | Result |
|----|---------|------------------|--------|
| API-01 | `GET /api/health` | 200, body `{ status: "ok", timestamp: <ISO8601>, uptime: <number> }`. | NOT TESTED |
| API-02 | `POST /api/quotes` with fully valid body (all required fields, `consentToContact: true`). | 201, body `{ success: true, referenceNumber: "CFG-Q-<year>-####", message: "Quote request received." }`. | NOT TESTED |
| API-03 | `POST /api/quotes` missing `fullName`. | 400, `{ success: false, error: "Validation failed.", fields: [{ field: "fullName", message: "This field is required." }, ...] }`. | NOT TESTED |
| API-04 | `POST /api/quotes` with `email: "not-valid"`. | 400, fields includes `{ field: "email", message: "Must be a valid email address." }`. | NOT TESTED |
| API-05 | `POST /api/quotes` with `consentToContact: false`. | 400, fields includes `{ field: "consentToContact", message: "You must consent to be contacted." }`. | NOT TESTED |
| API-06 | `POST /api/quotes` with `serviceType: "not-a-real-service"`. | 400, fields includes serviceType enum error. | NOT TESTED |
| API-07 | `POST /api/quotes` with body >100kb (e.g. huge `additionalNotes` string well past field max, or padding to exceed the JSON body-parser limit). | Request rejected before reaching validation (body-parser limit) — confirm actual status code (413 vs 400) and that server does not crash. | NOT TESTED |
| API-08 | `POST /api/quotes` with malformed JSON (broken syntax). | 400, `{ success: false, error: "Malformed JSON body." }` per `errorHandler`. | NOT TESTED |
| API-09 | `POST /api/contact` with fully valid body. | 201, `{ success: true, message: "Message received." }`. | NOT TESTED |
| API-10 | `POST /api/contact` missing `message`. | 400, fields includes message required error. | NOT TESTED |
| API-11 | `POST /api/contact` with invalid email. | 400, fields includes email format error. | NOT TESTED |
| API-12 | `GET /api/quotes` (wrong method) or unknown route e.g. `GET /api/nonexistent`. | Handled by `notFound` middleware — confirm status (expect 404) and that it returns a JSON-ish error rather than an HTML stack trace. | NOT TESTED |
| API-13 | Repeated `POST /api/quotes` beyond 20 requests within 15 minutes from same IP. | 429 rate-limit response once threshold crossed; standard rate-limit headers present. (Run this case last/isolated so it doesn't block other API tests during the same window.) | NOT TESTED |
| API-14 | Cross-origin request from `http://localhost:5173` (i.e. normal frontend usage) vs. an arbitrary origin. | Frontend origin allowed via CORS; confirm `config.corsOrigin` is not wildcard-open in a way that's a concern, and not blocking the actual frontend. | NOT TESTED |
| API-15 | Response headers check (helmet). | Security headers present (e.g. `X-Content-Type-Options`, `X-Frame-Options` or CSP per helmet defaults) on API responses. | NOT TESTED |

---

## 8. Responsive Design

Breakpoints to test: **375px** (mobile), **768px** (tablet), **1024px** (small desktop/landscape tablet), **1440px+** (desktop).

| ID | Area | Steps | Expected Result | Result |
|----|------|-------|------------------|--------|
| RES-01 | Hero | Load `/` at each breakpoint. | No horizontal scroll/overflow; headline/subhead readable; 3D canvas or fallback scales correctly; primary CTA reachable without obstruction. | NOT TESTED |
| RES-02 | Nav | Load `/` at each breakpoint. | Desktop shows full nav; mobile/tablet (per design breakpoint) collapses to hamburger; no overlapping nav items; logo not clipped. | NOT TESTED |
| RES-03 | Services section | Scroll to `/#services` at each breakpoint. | Service cards reflow (grid -> stacked) without overlap or clipped text/icons. | NOT TESTED |
| RES-04 | 3D scene | Observe hero 3D at each breakpoint. | Canvas resizes/adapts (or shows mobile fallback per 3D-07) without breaking layout or causing overflow. | NOT TESTED |
| RES-05 | Aviation page | Load `/aviation` at each breakpoint. | Requirements grid, CTA, and any imagery reflow correctly; no overlap; text readable. | NOT TESTED |
| RES-06 | Process section | Scroll to process/how-it-works section at each breakpoint. | 4-step process reflows (e.g. horizontal -> vertical) without numbering/overlap issues. | NOT TESTED |
| RES-07 | Quote form | Load `/quote` at each breakpoint. | All fields stack sensibly, labels not truncated, checkboxes/buttons tappable (min ~44px touch target on mobile), no overflow. | NOT TESTED |
| RES-08 | Contact form | Load `/contact` at each breakpoint. | Same criteria as RES-07. | NOT TESTED |
| RES-09 | Footer | Load any page, scroll to footer, at each breakpoint. | Columns stack on mobile, links remain tappable, legal row readable, no overlap with content above. | NOT TESTED |
| RES-10 | Freight & Business Shipping pages | Load `/freight`, `/business-shipping` at each breakpoint. | Same layout-integrity criteria as RES-05. | NOT TESTED |
| RES-11 | Landscape mobile / unusual widths | Test 375px in landscape (~667-812 wide, short height) and one in-between width (e.g. 600px). | No layout breakage at non-standard sizes; no fixed-height sections clipping content. | NOT TESTED |

---

## 9. Accessibility

| ID | Steps | Expected Result | Result |
|----|-------|------------------|--------|
| A11Y-01 | Tab through entire homepage using only keyboard (no mouse). | Logical tab order following visual/DOM order; all interactive elements (nav links, CTAs, mobile menu toggle) reachable. | NOT TESTED |
| A11Y-02 | Tab through Quote form and Contact form fields. | All inputs, checkbox, and submit button reachable in a sensible order; nothing skipped or trapped. | NOT TESTED |
| A11Y-03 | Observe focus indicator while tabbing (desktop, default browser). | Visible focus ring/outline on every focused interactive element (not `outline: none` with no replacement). | NOT TESTED |
| A11Y-04 | Inspect form field markup (devtools) for Quote and Contact forms. | Every input has an associated `<label>` (via `for`/`id` or `aria-label`); required fields indicated programmatically (e.g. `aria-required` or `required`). | NOT TESTED |
| A11Y-05 | Trigger a validation error (e.g. QF-09) and inspect markup. | Error message is programmatically associated with the field (`aria-describedby`) and/or field marked `aria-invalid="true"`; error text is not conveyed by color alone. | NOT TESTED |
| A11Y-06 | Trigger a validation error with a screen reader active (NVDA/VoiceOver) or simulate via devtools accessibility tree. | Error is announced or at least discoverable via accessibility tree (e.g. `role="alert"` or live region), not silent. | NOT TESTED |
| A11Y-07 | Inspect heading structure on `/`, `/aviation`, `/quote`, `/contact`, `/about` (devtools or headings outline extension). | Single `<h1>` per page, logical nesting (no skipped levels like h1 -> h4). | NOT TESTED |
| A11Y-08 | Run a contrast check (devtools or axe) on body text, CTA buttons, nav links, footer text, against their backgrounds. | Meets WCAG AA (4.5:1 normal text, 3:1 large text/UI components) — flag any failures with exact colors. | NOT TESTED |
| A11Y-09 | Enable OS "reduce motion" and revisit `/`, `/quote` (loading spinners), any animated transitions. | Non-essential motion reduced/removed per `prefers-reduced-motion`, consistent with 3D-08. | NOT TESTED |
| A11Y-10 | Inspect the 3D hero canvas element for accessible fallback. | Canvas has an `aria-hidden="true"` (if purely decorative) or a meaningful `aria-label`/text alternative if it conveys information; page is usable with the canvas hidden from AT. | NOT TESTED |
| A11Y-11 | Run axe DevTools (or equivalent) automated scan on each route. | No critical/serious violations; document any moderate/minor findings. | NOT TESTED |
| A11Y-12 | Zoom browser to 200%. | Layout remains usable, no clipped/overlapping text, no loss of functionality. | NOT TESTED |

---

## 10. Performance Observations

(Observational/qualitative — not strict pass/fail gates unless something is clearly broken.)

| ID | Steps | Expected Result | Result |
|----|-------|------------------|--------|
| PERF-01 | Cold load `/` with devtools Network tab (cache disabled), note Time to Interactive / Largest Contentful Paint. | Reasonable first-load time (document actual figures; flag if hero content is blocked for multiple seconds by 3D asset loading). | NOT TESTED |
| PERF-02 | Check whether the Three.js/R3F bundle is code-split (Network tab, separate chunk) vs. bundled into the main entry. | 3D library lazy-loads as its own chunk rather than blocking initial page paint (verify via chunk names/sizes). | NOT TESTED |
| PERF-03 | Observe scroll performance on `/` (devtools Performance recording) especially around hero -> services transition. | No obvious jank/dropped frames during scroll. | NOT TESTED |
| PERF-04 | Navigate between routes several times, observing perceived responsiveness. | Route transitions feel immediate; no multi-second blank gaps. | NOT TESTED |
| PERF-05 | Note total JS bundle size (Network tab, production build if available) and image asset weights. | Flag anything unusually large (e.g. unoptimized images, duplicated vendor chunks) — informational for report. | NOT TESTED |

---

## 11. Full Customer Flow (End-to-End Scenario)

Single continuous walkthrough. Record pass/fail per step; a failure at any step should still allow continuing where feasible, noting which sub-steps were blocked.

| Step | Action | Expected Result | Result |
|------|--------|------------------|--------|
| E2E-01 | Load home page `/`. | Home page loads with hero, 3D scene, nav. | NOT TESTED |
| E2E-02 | Observe hero section. | Headline, subhead, primary/secondary CTA visible and correct per content.ts. | NOT TESTED |
| E2E-03 | Scroll to / view Services section. | Three service cards (Aviation, Freight, Business) visible with correct titles/CTAs. | NOT TESTED |
| E2E-04 | Click through to Aviation page (`/aviation`, via services card link or nav). | Aviation page loads with correct headline, requirements, CTA. | NOT TESTED |
| E2E-05 | Click "Get an Aviation Quote" CTA (AVIATION.cta, "Get an Aviation Shipping Quote"). | Navigates to `/quote?service=aviation`. | NOT TESTED |
| E2E-06 | Confirm Service Type preselected to Aviation on the quote form. | "Aviation Parts Transportation" shown as selected in Service Type field. | NOT TESTED |
| E2E-07 | Fill customer info: full name, email, phone. | Fields accept input normally. | NOT TESTED |
| E2E-08 | Fill company name (optional). | Accepted. | NOT TESTED |
| E2E-09 | Fill origin and destination. | Accepted. | NOT TESTED |
| E2E-10 | Fill shipment details: cargo description, plus optional pickup/delivery dates, weight, pieces, special handling. | Accepted. | NOT TESTED |
| E2E-11 | Check consent checkbox. | Checkbox toggles checked. | NOT TESTED |
| E2E-12 | Submit form. | Loading state shown briefly, then success state. | NOT TESTED |
| E2E-13 | Verify success state shows a reference number. | Reference number visible, format `CFG-Q-<year>-####`. | NOT TESTED |
| E2E-14 | Verify backend actually saved it (query `quotes` table or re-check via any admin/debug means available). | Row exists matching submitted data and returned reference number. | NOT TESTED |
| E2E-15 | Navigate back to home (`/` via logo or nav). | Home page loads correctly. | NOT TESTED |
| E2E-16 | Navigate to Contact page (`/contact`). | Contact page loads with form and info@cargoflowgroup.com visible. | NOT TESTED |
| E2E-17 | Fill and submit contact form with valid data. | Success message shown (`CONTACT_SUCCESS`). | NOT TESTED |
| E2E-18 | Switch to mobile viewport (375px) and repeat a quick pass of home + quote page. | Layout and functionality hold up on mobile (ties to RES-01/RES-07). | NOT TESTED |
| E2E-19 | Enable reduced-motion, then refresh each major route (`/`, `/quote`, `/contact`, `/aviation`) directly via URL bar. | Each route loads correctly on hard refresh with reduced motion respected, no console errors. | NOT TESTED |

---

## 12. Error Handling

| ID | Steps | Expected Result | Result |
|----|-------|------------------|--------|
| ERR-01 | Stop the backend entirely. Load frontend `/quote`, submit a valid form. | User-facing error message shown (not a blank screen, not a raw JS error dialog); form remains fillable for retry. | NOT TESTED |
| ERR-02 | Same as ERR-01 but for `/contact`. | Same graceful degradation. | NOT TESTED |
| ERR-03 | Simulate network failure mid-request (devtools "offline" toggled right after submit, or throttle to failure). | Fetch/axios error caught and surfaced as a user-readable message; no unhandled promise rejection crashing the app. | NOT TESTED |
| ERR-04 | With backend running, force a validation error (e.g. QF-09) and confirm the message is exposed via accessible means (ties to A11Y-05/06). | Validation errors are both visually and programmatically accessible, matching server `fields[]` messages where surfaced. | NOT TESTED |
| ERR-05 | Hit a backend 500 (e.g. by temporarily corrupting DB path permissions, if feasible in a non-destructive way, or by any other safe means of forcing `next(err)`). | Client shows generic error state; server does not leak stack traces to the client in production mode (`isProduction` branch in `errorHandler`). | NOT TESTED |
| ERR-06 | Submit quote/contact form with dev tools Network tab set to "Offline" before clicking submit. | Immediate, clear network-error feedback rather than an indefinite spinner. | NOT TESTED |
| ERR-07 | Navigate to a broken/nonexistent deep link while backend is down (e.g. `/does-not-exist`). | 404 page still renders client-side (doesn't depend on backend), confirming frontend routing failure isolation from backend. | NOT TESTED |

---

## Execution Notes / Open Questions (to confirm once build is complete)

- Confirm actual mobile-menu breakpoint (design may differ from the 768px assumption) — verify against implemented CSS breakpoints, not just this plan's arbitrary 375/768/1024/1440 grid.
- Confirm whether the "Get a Quote" nav CTA is a separate element from `NAV_ITEMS` (content.ts shows it separately) or added directly in the Nav component.
- Confirm exact `notFound` middleware response shape/status (not shown in reviewed source at plan-authoring time — server route file wasn't inspected beyond `health`/`quotes`/`contact`).
- Confirm `config.corsOrigin` value for dev to ensure NAV/API tests aren't blocked by CORS.
- Confirm production build behavior for `isProduction` error-message branch (dev vs prod error detail exposure) — test in whichever mode is actually running during execution.
- Body-size-limit test (API-07) status code depends on Express/body-parser version behavior — record actual result rather than assuming 413.
