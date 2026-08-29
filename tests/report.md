# CargoFlow Redesign - QA Test Report

Status: EXECUTED. Full integrated test pass run against the live stack.
Test method legend: [API] = curl against live backend :3000; [PROXY] = curl via Vite proxy :5173; [DB] = direct node:sqlite query of server/data/cargoflow.db; [CODE] = source-level verification (headless env cannot render WebGL/visual layout); [NOT TESTED] = requires a real browser/GPU/manual interaction.

## Summary

Result totals across the plan's checkable cases:
- PASS: 72 (BUG-01 fixed by team lead + re-verified: oversized body now returns 413)
- FAIL: 0
- PARTIAL / verified-via-code-review (no live browser): 21
- NOT TESTED (requires real browser/GPU/manual): 14

Backend API, persistence, content accuracy, CTA wiring, form validation/a11y, routing, and the programmatic slice of the end-to-end flow all pass. One minor backend bug found (payload-too-large -> 500). No app code was modified by QA. Everything requiring true WebGL rendering, pixel-level responsive layout, real keyboard-focus painting, FPS/memory, and axe/contrast was verified at the source/config level or left NOT TESTED and flagged honestly - not marked as blind PASS.

## Environment

- Date/time of run: 2026-08-29 (~04:18 UTC per health timestamp).
- Backend: Express + TS + node:sqlite at http://localhost:3000. Health OK, uptime confirmed.
- Frontend: React+Vite+TS dev server at http://localhost:5173 with working Vite proxy /api/* -> :3000 (verified: quote POST via :5173 returned CFG-Q-2026-0006).
- DB: server/data/cargoflow.db (SQLite). Queried directly with node --experimental-sqlite (DatabaseSync).
- Client build reported clean by team lead (tsc -b && vite build); three.js isolated in its own chunk (vite.config manualChunks: three, r3f). 3D lazy-loaded via React.lazy.
- Headless test environment: cannot render WebGL or do visual/responsive/contrast/FPS testing - those items verified via code review or marked NOT TESTED.
- Note: quotes rate-limit window (20/15min) was intentionally exhausted by API-13 near the end; it resets ~15 min after. Contact limiter is separate and not exhausted.

## Content Accuracy

Method: [CODE] grep of entire client/src + read of content.ts, rendered via components.

Required content PRESENT (PASS):
- CA-01 "CargoFlow LLC" - PASS (COMPANY.legalName rendered in Footer site-wide + Contact page + copyright).
- CA-02 "North Miami, Florida" - PASS (content.ts COMPANY.location, ABOUT facts, WHY item; rendered in Footer/Contact/About).
- CA-03 "info@cargoflowgroup.com" - PASS (Footer mailto site-wide + Contact page mailto).
- CA-04 "Aviation Parts Transportation" - PASS (SERVICES, home services, /aviation).
- CA-05 "Freight Forwarding" - PASS (SERVICES, /freight).
- CA-06 "Business Shipping" - PASS (SERVICES "Business Shipping Solutions", nav/footer "Business Shipping", /business-shipping).
- CA-07 Miami/national positioning - PASS (HERO.kicker "Miami-based logistics . National reach", subhead, NETWORK, WHY National Reach).
- CA-08 About HQ/reach facts - PASS (ABOUT.facts Headquarters=North Miami FL, Reach=Nationwide).
- CA-19 titles/meta - PASS (index title "CargoFlow | Aviation Parts, Freight Forwarding & Business Shipping - Miami"; per-page SEO via useDocumentMeta; no placeholder text).

Prohibited content ABSENT (PASS):
- CA-09..CA-17 - PASS. Grep (case-insensitive) of client/src for: Alt Solutions, loan(s), USSD, e-cash/ecash, airtime, utility payment/bill, Ghana, testimonial, ISO 9001, certified, "as seen in", "trusted by", "our partners" - the ONLY hit is a code comment in content.ts explicitly stating the file contains NO testimonials/certifications/partnerships/stats/logos. Not rendered content. No match anywhere else.
- CA-18 invented stats/guarantees - PASS. Grep for guarantee/99./100%/24-7/since 19xx/large-number+/on-time/fleet/million/billion returned only CSS values and an SVG gradient stop (false positives), no marketing stat claims. TRACKING_DEMO and NETWORK are explicitly labeled "Illustrative visualization ... not live shipment data" (Network.tsx renders the disclaimer text visibly).

## Navigation

Method: [CODE] + [PROXY] route serving.
- NAV-01 logo -> / - PASS (Navbar + Footer Link to="/").
- NAV-02 nav items - PASS (NAV_ITEMS maps to correct routes/hashes: Services /#services, Aviation /aviation, Freight Forwarding /freight, Business Shipping /business-shipping, About /about, Why CargoFlow /#why, Contact /contact).
- NAV-03 "Get a Quote" CTA -> /quote - PASS (separate Link, desktop + mobile).
- NAV-04/05 mobile menu - PASS [CODE]: hamburger toggles, aria-expanded/aria-controls, focus trap + Escape-to-close, closes on route change (useEffect on location). Visual tap test NOT TESTED (needs browser) but logic verified.
- NAV-06/07 deep links - PASS [PROXY]: /aviation, /quote?service=aviation, /does-not-exist all return 200 (SPA index served; client router renders correct page/404).
- NAV-08 refresh-on-route - PASS [PROXY] (SPA fallback serves index for any path; router resolves).
- NAV-09 404 page - PASS [CODE]: App.tsx has path="*" -> NotFoundPage.
- NAV-10 back/forward - NOT TESTED (needs browser) - router setup is standard react-router, expected fine.
- NAV-11 footer links - PASS [CODE]: Footer maps FOOTER.columns + legal (/privacy, /terms) + Request a Quote (/quote).

## 3D Website

Method: [CODE] - headless env cannot render WebGL. All logic/code paths verified in MiamiNetworkScene.tsx, NetworkSceneCanvas.tsx, useWebGLSupport.ts.
- 3D-01 hero init - VERIFIED VIA CODE (Canvas mounts; runtime render NOT TESTED, needs GPU).
- 3D-02 Miami hub - PASS [CODE]: MiamiHub at MIAMI=[1.6,0,1.1], pulsing sphere + ring.
- 3D-03 route animation - PASS [CODE]: 5 RouteArc bezier arcs + animated ShipmentDot along curves via useFrame.
- 3D-04 mouse interaction - PASS [CODE]: CameraRig applies pointer parallax (lerped).
- 3D-05 scroll behavior - VERIFIED VIA CODE: canvas is absolute behind content; no scroll handler conflict. Runtime jank NOT TESTED.
- 3D-06 resize - VERIFIED VIA CODE: R3F Canvas auto-resizes to container (aspect box). Runtime NOT TESTED.
- 3D-07 mobile fallback - PASS [CODE]: lowPower (<=767px) reduces routes 5->3, powerPreference low-power, dpr cap [1,1.75]; small screen still 3D but reduced. (Static SVG only on reduced-motion / no-WebGL.)
- 3D-08 reduced-motion - PASS [CODE]: NetworkSceneCanvas returns static NetworkMapSVG when prefersReducedMotion; scene also freezes camera + hides dots if 3D path taken.
- 3D-09 WebGL unavailable - PASS [CODE]: useWebGLSupport probes getContext; false -> NetworkMapSVG fallback; null (unknown) also renders SVG. Graceful, no crash path.
- 3D-10 canvas not blocking buttons - PASS [CODE]: Hero wraps canvas in pointer-events-none absolute layer behind copy; NetworkSceneCanvas wrapper aria-hidden. CTAs are separate, clickable.
- 3D-11 FPS/memory on route change - NOT TESTED (needs browser/profiler). Lazy chunk unmounts on navigation; no obvious leak in code.
- 3D-12 secondary visualizations - PASS [CODE]: Network section reuses same component with illustrative label.

## Service Pages

Method: [CODE] + [PROXY].
- /aviation, /freight, /business-shipping - PASS: each uses ServiceDetail with correct SERVICES entry; hero + "What's Included" highlights + CTA. Routes serve 200.
- Per-page CTA -> correct /quote?service=<key> - PASS (service.cta.to from content.ts).

## CTA Flow

Method: [CODE] audit of every CTA destination + [CODE] preselect logic + [PROXY] preselect route.
- CTA-01 Hero "Get a Free Quote" -> /quote - PASS (HERO.primaryCta.to).
- CTA-02 Nav "Get a Quote" -> /quote - PASS.
- CTA-03 Aviation service card -> /quote?service=aviation - PASS (Services maps service.cta.to).
- CTA-04 Aviation page CTA "Get an Aviation Shipping Quote" -> /quote?service=aviation - PASS (Aviation.tsx AVIATION.cta.to; also ServiceDetail).
- CTA-05 Freight -> /quote?service=freight - PASS.
- CTA-06 Business -> /quote?service=business - PASS.
- CTA-07 Final CTA primary "Get a Free Quote" -> /quote - PASS (QuoteCTA QUOTE_CTA.primaryCta).
- CTA-08 Final CTA secondary "Contact CargoFlow" -> /contact - PASS.
- CTA-09 Footer "Request a Quote" -> /quote - PASS.
- CTA-10/11/12 ?service= preselect - PASS [CODE]: QuoteForm uses serviceLabelFromKey(searchParams.get('service')) for both defaultValues.serviceType and select defaultValue. aviation->"Aviation Parts Transportation", freight->"Freight Forwarding", business->"Business Shipping Solutions". Route serves 200. (Rendered selected-option state NOT visually re-tested in browser but wiring is correct.)
- CTA-13 invalid ?service=bogus - PASS [CODE]: serviceLabelFromKey returns undefined -> falls back to '' (Select a service). No crash/undefined.
- CTA-14 no href="#" - PASS [CODE]: grep for to="#"/href="#" -> No matches found.

## Quote Form

Method: [CODE] schema+a11y+states + [API]/[PROXY] submissions + [DB] persistence.
- QF-01 happy path -> loading + reference - PASS: submitQuote called; success card shows QUOTE_SUCCESS + referenceNumber; isSubmitting disables button ("Submitting..."). Live: CFG-Q-2026-0004 [API], CFG-Q-2026-0006 [PROXY].
- QF-02 all optional fields - PASS [PROXY]: 0006 saved company/pickupDate/weight/pieces.
- QF-03 response shape - PASS: {success:true, referenceNumber, message:"Quote request received."}.
- QF-04 DB persistence - PASS [DB]: rows present with matching data, consent_to_contact=1.
- QF-05 sequence increment - PASS [DB]: 0001->0006 sequential.
- QF-06 survives restart - PASS: team lead confirmed 0001/0002 persisted across restart; DB is file-backed and referenceService reseeds from getMaxSequenceForYear.
- QF-07 all blank - PASS [CODE]: client zod blocks submit, focuses first invalid; [API] server returns 400 with fields[] for each required field.
- QF-08 missing fullName - PASS [API] 400 (server msg "Required" when field absent; client msg "Full name is required.").
- QF-09 invalid email - PASS [API]: "Must be a valid email address." (client: "Enter a valid email address.").
- QF-10 missing email - PASS [CODE] client "Email is required." / [API] server required.
- QF-11 missing phone - PASS [API] 400.
- QF-12 phone too long - PASS [CODE]: server schema max(40) "Phone number is too long." (client has no max - server enforces).
- QF-13 missing/invalid serviceType - PASS [API]: enum error "Must be one of: ...".
- QF-14 missing cargoDescription - PASS [API] 400.
- QF-15 missing origin - PASS [API] 400.
- QF-16 missing destination - PASS [API] 400.
- QF-17 consent unchecked - PASS [API]: "You must consent to be contacted." (client: literal(true) "You must agree to be contacted...").
- QF-18 bad dates - PASS [CODE]: pickup/delivery use native <input type="date"> (browser-constrained); schema treats as optional string. No crash.
- QF-19 non-numeric weight/pieces - INFORMATIONAL: free-text by design (schema optional string); no numeric enforcement. Not a bug.
- QF-20 oversized text - PASS: server caps most fields at max 200/4000; a >100kb total body now returns 413 (BUG-01 fixed).
- QF-21 errors clear on correction - PASS [CODE]: react-hook-form clears field error on revalidation.
- QF-22 loading state - PASS [CODE]: isSubmitting -> disabled + "Submitting...". Live latency small.
- QF-23/24 backend-down error state - PASS [CODE]: api.ts toApiError returns "Unable to reach the CargoFlow server..." on no-response; caught, shown via serverError role="alert". No unhandled rejection. (Live backend-down NOT re-tested to avoid taking the stack down; code path verified.)
- QF-25 double-submit - PASS [CODE]: button disabled while isSubmitting.

## Contact Form

Method: [CODE] + [API]/[PROXY] + [DB].
- CF-01 valid -> success - PASS [API]: 201 {success:true,message:"Message received."}; UI shows CONTACT_SUCCESS card. DB row saved (Jane/Hello).
- CF-02 optional company/phone - PASS [CODE] optional in schema.
- CF-03 DB persistence - PASS [DB]: contacts table has 3 rows incl. test submission.
- CF-04 invalid email - PASS [API] "Must be a valid email address."
- CF-05 missing name - PASS [CODE] client "Name is required." / [API] required.
- CF-06 missing message - PASS [API] 400.
- CF-07 missing subject - PASS [CODE]/[API].
- CF-08 backend-down - PASS [CODE] same api.ts graceful path.
- CF-09 info@cargoflowgroup.com shown - PASS [CODE]: Contact page card renders COMPANY.email.
- CF-10 mailto present - PASS [CODE]: href={mailto:COMPANY.email} on Contact + Footer.

## Backend API

Method: [API] curl against :3000. Exact status + envelope asserted.
- API-01 GET /api/health - PASS: 200 {status:"ok",timestamp:ISO,uptime:number}.
- API-02 valid quote - PASS: 201, referenceNumber CFG-Q-2026-0004, message "Quote request received."
- API-03 missing fullName - PASS: 400 {success:false,error:"Validation failed.",fields:[{field:"fullName",message:"Required"}]}. (Note: absent field yields Zod default "Required" not the custom "This field is required." - cosmetic, see Remaining Issues.)
- API-04 bad email - PASS: 400 fields email "Must be a valid email address."
- API-05 consent false - PASS: 400 fields consentToContact "You must consent to be contacted."
- API-06 bad serviceType - PASS: 400 fields serviceType "Must be one of: Aviation Parts Transportation, Freight Forwarding, Business Shipping, Other".
- API-07 oversized >100kb body - PASS (BUG-01 fixed): returns HTTP 413 {success:false,error:"Request body too large."}. Re-verified live with a 120,191-byte body after the errorHandler fix.
- API-08 malformed JSON - PASS: 400 {success:false,error:"Malformed JSON body."}
- API-09 valid contact - PASS: 201 {success:true,message:"Message received."}
- API-10 contact missing message - PASS: 400 fields message.
- API-11 contact bad email - PASS: 400 fields email.
- API-12 unknown route / wrong method - PASS: 404 {success:false,error:"Not found."} (GET /api/nonexistent and GET /api/quotes both).
- API-13 rate limit - PASS: 429 "Too many requests, please try again later." after 20/15min window crossed (fired at cumulative req #12 due to prior test traffic). RateLimit-Limit:20, w=900 headers present.
- API-14 CORS - PASS: Access-Control-Allow-Origin scoped to http://localhost:5173; a foreign Origin still receives only the allowed origin (browser would block). Not wildcard.
- API-15 helmet headers - PASS: CSP, X-Content-Type-Options nosniff, X-Frame-Options SAMEORIGIN, HSTS, Referrer-Policy, COOP/CORP all present.

## Responsive Testing

Method: [CODE] Tailwind breakpoint review only - headless env cannot render at 375/768/1024/1440. Marked accordingly.
- RES-01..RES-11 - VERIFIED VIA CODE (partial): components use responsive Tailwind classes (grid-cols-1 -> sm:grid-cols-2 / lg:grid-cols-3, sm:/lg: paddings, flex-col -> sm:flex-row, container-cf, aspect boxes for 3D, mobile nav <lg hidden with hamburger). No obvious overflow risk in markup. Actual pixel rendering / no-overflow / touch-target / overlap at each breakpoint NOT TESTED (needs real browser). Recommend a manual pass at 375/768/1024/1440.

## Accessibility

Method: [CODE] markup review - axe/contrast/live-SR NOT runnable headless.
- A11Y-01/02 keyboard nav - VERIFIED VIA CODE: semantic links/buttons; mobile menu has focus trap + Escape. Live tab-order NOT TESTED.
- A11Y-03 visible focus - VERIFIED VIA CODE: focus:border-signal-400 on fields, focus:ring on checkbox. Full focus-ring audit NOT TESTED.
- A11Y-04 labels - PASS [CODE]: every input has <label htmlFor> matching id; required marked with * and (server-authoritative) validation.
- A11Y-05 accessible validation - PASS [CODE]: aria-invalid + aria-describedby wired to error <p id role="alert">; not color-only (has text).
- A11Y-06 error announced - PASS [CODE]: role="alert" on each field error and on serverError banner; focus moves to first invalid field.
- A11Y-07 heading order - VERIFIED VIA CODE: pages have single h1 (page hero), h2/h3 sections. Looks well-ordered. Full outline NOT auto-scanned.
- A11Y-08 contrast - NOT TESTED (needs axe/contrast tool + rendering). Dark theme with steel/signal palette - manual check recommended.
- A11Y-09 reduced-motion - PASS [CODE]: Reveal, Hero, Network, MiamiNetworkScene all honor useReducedMotion (framer-motion) / prefers-reduced-motion.
- A11Y-10 canvas a11y - PASS [CODE]: 3D wrapper aria-hidden="true" (decorative), page usable without it; SVG fallback also aria-hidden.
- A11Y-11 axe scan - NOT TESTED (needs browser).
- A11Y-12 200% zoom - NOT TESTED (needs browser).

## Performance Observations

Method: [CODE]/config.
- PERF-01 first load - NOT TESTED (needs browser timing). Hero copy is not blocked by 3D (canvas is separate/behind, SVG fallback instant).
- PERF-02 3D code-split/lazy - PASS [CODE]: vite manualChunks isolates three + r3f; MiamiNetworkScene is React.lazy - loads as separate chunk, not blocking first paint. Team lead confirmed three chunk ~683kB isolated.
- PERF-03 scroll jank - NOT TESTED (needs browser).
- PERF-04 route responsiveness - VERIFIED VIA CODE: routes are direct (not lazy pages), transitions immediate.
- PERF-05 bundle size - INFORMATIONAL: three ~683kB in its own chunk (expected for 3D); acceptable given lazy-load.

## Full Customer Flow (End-to-End)

Method: programmatic slice via [PROXY]+[DB]; visual/mobile steps [CODE]/NOT TESTED.
- E2E-01..04 home/hero/services/aviation - PASS [PROXY] routes serve; [CODE] components correct.
- E2E-05 "Get an Aviation Quote" -> /quote?service=aviation - PASS [CODE] (AVIATION.cta.to).
- E2E-06 aviation preselect - PASS [CODE] (serviceLabelFromKey). Visual selected-state NOT re-rendered in browser.
- E2E-07..11 fill customer/company/origin/destination/shipment/consent - PASS [PROXY]: full payload accepted.
- E2E-12 submit -> success - PASS [PROXY]: 201.
- E2E-13 reference shown - PASS: CFG-Q-2026-0006 returned.
- E2E-14 backend saved it - PASS [DB]: row 0006 has all submitted fields (company Acme Aero, pickup 2026-09-15, 450 lbs, 3 pieces, Miami->Seattle).
- E2E-15/16 back home / contact - PASS [PROXY] routes.
- E2E-17 contact submit -> success - PASS [API] earlier (201).
- E2E-18 mobile pass - NOT TESTED (needs browser); responsive markup present.
- E2E-19 reduced-motion + refresh routes - PASS [CODE] reduced-motion honored; [PROXY] hard refresh serves each route.

## Error Handling

Method: [CODE] + [API].
- ERR-01/02 backend down form error - PASS [CODE]: api.ts returns user-readable "Unable to reach the CargoFlow server..."; shown via role="alert"; form stays fillable. (Not re-run live to keep stack up.)
- ERR-03 network failure mid-request - PASS [CODE]: axios error caught in toApiError; timeout (15s) -> "The request timed out."; no unhandled rejection.
- ERR-04 validation surfaced accessibly - PASS [CODE]/[API]: server fields[] mapped back onto form fields via setError; role="alert".
- ERR-05 500 no stack leak to client - PASS [CODE]: errorHandler returns generic "Internal server error." in production (isProduction branch); dev shows message. BUG-01's 500 returns only "request entity too large", no stack.
- ERR-06 offline submit feedback - PASS [CODE]: immediate no-response branch, not indefinite spinner.
- ERR-07 404 while backend down - PASS [CODE]: 404 is client-side (App.tsx path="*"), independent of backend.

## Bugs Found

BUG-01 (Minor, Backend) - Oversized request body returned HTTP 500 instead of 413/400. FIXED.
- Location: server/src/middleware/errorHandler.ts.
- Repro: POST with a JSON body > 100kb (express.json limit in app.ts).
- Was: 500 {success:false,error:"request entity too large"}.
- Cause: errorHandler only special-cased SyntaxError (400 malformed JSON); body-parser's PayloadTooLargeError (err.type==='entity.too.large', err.status/statusCode===413) fell through to the generic 500 branch.
- Impact: Low. Request was correctly rejected, not stored, no crash - only the status code was wrong.
- FIX (applied by team lead): errorHandler now honors any caller-facing 4xx err.status/err.statusCode from middleware before defaulting to 500, with tailored messages for malformed JSON (400) and oversized bodies (413). Server typecheck clean; re-verified live: a 120,191-byte body now returns 413 {success:false,error:"Request body too large."}, malformed JSON still 400, unknown route still 404.

## Bugs Fixed

1. BUG-01 - oversized body now returns 413 (was 500). Fixed in server/src/middleware/errorHandler.ts by the team lead during integration and re-verified live. QA itself modified no client/** or server/** source.

## Remaining Issues
1. COSMETIC (not a bug): when a required field is entirely ABSENT from the request body, the server returns Zod's default "Required" rather than the custom "This field is required." message (the custom min(1) message only fires when the key is present but empty). The frontend never sends absent required keys (react-hook-form always sends the field), so users never see "Required" - only direct API callers do. Optional polish for the backend owner (use invalid_type_error on the schema fields).
2. NOT TESTED items requiring a real browser/GPU - recommend a manual pass before launch:
   - Live 3D runtime (init, hub visible, animation, mouse parallax, resize, mobile perf, FPS/memory on repeated route change).
   - Responsive layout at 375/768/1024/1440 (overflow/overlap/touch-targets).
   - Real keyboard focus-ring rendering + tab order; axe automated scan; color-contrast (WCAG AA) on the dark theme; 200% zoom.
   - Browser back/forward behavior.
   These were verified at the source/config level where possible (reduced-motion, WebGL fallback, small-screen reduction, lazy-load, Tailwind breakpoints, a11y attributes) and are believed correct, but need eyes-on confirmation.
3. Note for whoever re-runs API tests: the quotes rate-limit window (20/15min) was exhausted by API-13 during this pass; it self-resets ~15 min after. The contact endpoint has a separate limiter and is unaffected.

## Final Result

PASS (pending a manual browser/GPU pass) - no open code defects. BUG-01 fixed and re-verified.

Everything programmatically and source-verifiable is correct: the backend API is solid (correct status codes, consistent {success:false,error,fields} envelope, helmet, scoped CORS, rate limiting, persistence with correctly incrementing CFG-Q-2026-#### references that survive restart), content is accurate with zero prohibited/fabricated content, every CTA points to its correct destination with working ?service= preselect and no "#" placeholders, both forms have full accessible validation + loading/success/error states and are wired to the real API, all 10 routes + 404 resolve, and the graceful-degradation code paths for 3D (reduced-motion / no-WebGL / small-screen) are correctly implemented.

The one minor backend bug found (BUG-01: oversized body -> 500 instead of 413) was fixed by the team lead during integration and re-verified live (now 413). No open code defects remain.

The remaining gap is purely environmental: this headless run cannot render WebGL or do pixel/contrast/FPS testing. Those items are flagged NOT TESTED (needs manual browser), not passed blind. Recommend one manual browser pass across the breakpoints and a live 3D + axe/contrast check before go-live.
