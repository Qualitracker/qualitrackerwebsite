# Website Implementation Plan

Synthesized from `10_WEBSITE_AUDIT.md`, `12_SKILL_GAP_ANALYSIS.md`, `13_MOTION_SYSTEM.md`, `14`–`16` (accessibility/performance/SEO). P0 items marked **shipped** were completed and verified during this audit pass, not deferred.

## P0 — Critical (done or blocking)

| Item | Status |
|---|---|
| Fix the two failing-contrast text labels (gold-on-light, 9px, ~3.66:1) | **Shipped** — verified computation, fixed in `ask-qualitracker-demo.tsx` |
| Replace off-brand favicon with the real QT mark | **Shipped** |
| Update sitemap to cover all 8 routes | **Shipped** |
| Per-route `<title>`/description (`useDocumentMeta`) | **Shipped**, verified in-browser |
| Remove duplicate Inter font request | **Shipped** |
| Convert homepage scroll reveals from mount-time CSS to real `whileInView` (Framer Motion) | **Shipped**, verified sections reveal correctly on scroll |
| Fix render-blocking font loading (~800ms, found by Lighthouse) | **Shipped** — preload-then-activate pattern in `index.html`; verified via before/after Lighthouse runs. |
| Fix `maximum-scale=1` blocking pinch-zoom (found by Lighthouse) | **Shipped** |
| Resolve canonical domain and preferred host | **Resolved — `https://www.qualitracker.com/`.** The live non-`www` host redirects there; metadata now uses the final host. See Wave 14. |
| Run the actual `db push` migration for the new lead kinds/columns | **Open — needs a real `DATABASE_URL`**, not run without knowing the target DB |

## P1 — Important

| Item | Status |
|---|---|
| Route-based code splitting (`React.lazy` per page) | **Shipped** — verified: non-home routes now ship without Framer Motion/RAG-diagram/widget code; `/waitlist` no longer pulls in the homepage's chunk. Build output confirms per-route chunks. |
| Add ESLint | **Shipped** — flat config (`eslint.config.js`) scoped to hand-written website source (excludes generated code/build scripts on purpose). `pnpm run lint` clean except one pre-existing warning in unmodified shadcn scaffold code. |
| Add a minimal test setup | **Shipped** — Vitest + Testing Library. 9 page smoke tests (render without throwing, nav present) + 2 behavioural tests on the waitlist form (success and failure paths, the same failure path verified manually earlier). All 11 pass. |
| Vary the repeated card-grid pattern | **Shipped** — the "Reality" section's 4 identical cards became a numbered, staggered sequence (top-rule accent, no card chrome) — visually distinct from the capability-list rows and the pricing-card-shaped `qt-card` used elsewhere. |
| Verify remaining blocked content | **Open — needs you**, not code. Team roster resolved; pricing removed; NPHL Tanzania naming, the R²=0.81 citation, and cost/time-savings figures remain correctly unused. |
| Real Lighthouse/axe pass | **Shipped** — real run against the production build. Caught and fixed 2 real contrast bugs (opacity-dimming in the RAG pipeline and quality graph) plus a pinch-zoom-blocking viewport meta and an ~800ms render-blocking font-loading bug. Final: 100/100 accessibility, 100/100 best practices, 100/100 SEO, 92-97/100 performance depending on route. See `10_WEBSITE_AUDIT.md`'s second rescore, `14_ACCESSIBILITY_AUDIT.md`, `15_PERFORMANCE_AUDIT.md`. |

## P2 — Enhancement

| Item | Status |
|---|---|
| Staggered reveals on card grids | **Shipped** — the Reality sequence uses Framer Motion `staggerChildren` (0.1s), reduced-motion-aware. |
| Wire `.qt-thinking` onto a real state | **Shipped** — the Ask QualiTracker demo now has a genuine ~450ms "Checking your lab's records…" thinking beat with the pulsing ring when switching questions, instead of an instant swap. |
| Non-colour indicator on the accreditation widget | **Shipped** — a small warning icon now appears next to any category under 70%, alongside the existing gold/teal colour coding. |
| Prune unused shadcn/ui primitives | **Shipped** — removed ~47 unused files from `components/ui/` and the unused `use-mobile` hook; kept only `toast`/`toaster`/`tooltip` (the only ones actually reachable from `App.tsx`). **Real, measured result: CSS bundle dropped from 97 KB to 32 KB raw (17 KB → 7.3 KB gzip)** — Tailwind was generating utility classes for all the dead components' markup. |
| Structured data (schema.org) | **Shipped.** See Wave 12. |
| Bundle-visualizer pass for the ~72KB unused-JS Lighthouse found | **Open** — real, measured (~400ms est. LCP impact on home), but the exact culprit needs `rollup-plugin-visualizer` to pinpoint rather than guessed at. |
| Static-chain → connected graph for `/product`'s technical visualization | **Shipped** — `QualityIntelligenceGraph` (10 nodes, 11 edges, hover-to-highlight) replaced the old linear `quality-knowledge-graph.tsx` chain, using only entities already established elsewhere on the site (no new fabricated concepts). |

## P3 — Experimental / deferred pending real input

- The "Under the Hood" architecture explorer (deferred since `04_CREATIVE_DIRECTIONS.md` — needs real architecture input from engineering, not something to invent).
- Full `/docs` content (MCP reference, API reference, Security, Compliance) and the four `/solutions` segment pages — deliberately scaffolded, not written, per `08_PIVOT_ADDENDUM.md`.
- ~~SSR/prerendering for true per-route SEO metadata~~ — **Shipped, see Wave 12.** Turned out not to need the framework migration this item originally implied; build-time headless-browser prerendering fit this site's small, fixed route set.

## Wave 2 — real-repo-grounded homepage expansion (this pass)

Triggered by inspecting two real repos (`thestartupgroup7/qmswebsite`, `thestartupgroup7/qualitrackerchatbot` — both private) directly, plus the Figma brand file (confirmed to contain only the cover/logo page, no dashboard designs).

| Item | Status |
|---|---|
| Hero typography pushed toward the brand kit's upper range | **Shipped** — `clamp(2.4rem,5.2vw,3.75rem)` → `clamp(3rem,7vw,6rem)` |
| Quality Command Center (real dashboard shape: lab/dept/role/user stats) | **Shipped** — grounded in the actual `templates/dashboard.html` |
| Quality Intelligence Graph promoted to the homepage, with its own section | **Shipped** — same component now shared between Home and `/product#quality-intelligence` |
| Document lifecycle timeline (real `STATUS_CHOICES`: Draft → Pending Collaboration → Under Review → Under Approval → Approved/Rejected) | **Shipped** |
| CAPA/non-conformance lifecycle timeline (real, two-independent-reviewer states, not the brief's simplified example) | **Shipped** |
| Security page rewritten with real, verified content (per-tenant vector isolation, Presidio PII redaction with Tanzanian recognizers, self-hosted Ollama inference, confidence-gated retrieval) | **Shipped** |
| QualiBOT demo corrected: dropped an unverifiable "High confidence" label (the real system gates retrieval by score internally but doesn't expose a labeled confidence tier in what I could verify) | **Shipped** |
| Homepage grew from 7 to 11 distinct sections, each with its own visual grammar (editorial hero, numbered sequence, dashboard canvas, connected graph, two-tone cards, two lifecycle timelines, chat demo, scroll pipeline, vision-distinction cards, CTA) | **Shipped**, verified via `get_page_text` (correct order, no console errors) and a fresh Lighthouse run |
| Lighthouse re-run after the expansion | **Shipped** — 100/100/100 accessibility/best-practices/SEO held; performance 87/100 (down from 92, real and honest trade-off — see `15_PERFORMANCE_AUDIT.md`) |
| A real, contrast-failing bug caught before shipping (gold text/gold-fill-with-white-text in the new lifecycle timeline) | **Caught and fixed pre-ship**, not left for the next Lighthouse run to find |
| GitHub repo links on the site | **Blocked — both repos are private.** Linking to a private repo publicly shows visitors a 404, which is worse than no link. Needs your decision (make one/both public, or don't link). |

## Wave 3 — performance fix + technical UI language foundation

Triggered by (a) "why is performance 87?" and (b) a full "TECHNICAL UI LANGUAGE" brief modeled on Graphify's typography/terminal-block/traceability language, adapted to QualiTracker's own brand and real product concepts — not copied.

| Item | Status |
|---|---|
| Bundle-visualizer pass on the ~72KB unused-JS finding | **Shipped** — pinpointed `<Toaster/>`/`<TooltipProvider/>` (wired in `App.tsx` but never called anywhere — confirmed by grep) as ~35-45KB gzip of dead Radix/floating-ui code in the vendor chunk. |
| Remove dead Toaster/TooltipProvider wiring + 4 orphaned shadcn files | **Shipped** — vendor chunk 104.6KB → 70.2KB gzip. Lighthouse performance **87 → 96**, LCP 3.7s → 2.5s. Accessibility/Best Practices/SEO held at 100/100/100. All 11 tests still pass. |
| Fixed a real bug: `.qt-eyebrow`'s mono font declaration was silently overridden by a duplicate `font-family: 'Inter'` line right below it — eyebrows were rendering in Inter, not Roboto Mono, this whole time | **Shipped** |
| Technical typography layer (`.qt-technical-eyebrow/-label/-value/-timestamp/-id`, status-dot variants, restrained arrow-nudge utility) added to `index.css` | **Shipped** — uses Roboto Mono, already the brand kit's designated technical typeface; no new font introduced. |
| `TechnicalBlock` component family (`src/components/site/technical-block.tsx`): `TechnicalRecordBlock` (label/value metadata), `TraceBlock` (directional entity path), `NarrativeBlock` (query/response prose), `StatusIndicator` | **Shipped** |
| QualiBOT demo restyled with a real `QUALIBOT / RESPONSE` technical record block | **Shipped** — shows `RETRIEVAL: ABOVE/BELOW THRESHOLD` and `STATUS`/`HUMAN REVIEW`, never an invented confidence percentage (the real system only exposes a threshold gate, not a labeled score) — verified in-browser for both demo states. |
| Traceability path on `/product`, bidirectionally wired to `QualityIntelligenceGraph` (hover either one, the other highlights) | **Shipped** — reuses the graph's own 9 real entities at the same abstraction level (no invented instance IDs like "SOP-014"); verified via dispatched `mouseover`/`mouseout` events in both directions, plus a mobile-width layout check (grid collapses to one column, no horizontal overflow). |
| Repo-history check for a real "Recently Shipped"/changelog | **Checked — thin.** `qmswebsite`: 2 real annotated tags (`v1.0-pilot` 2026-07-09, `v1.1-pilot` 2026-07-11), both ops/security housekeeping, not features. `qualitrackerchatbot`: 0 tags/releases, 8 real dated commits (Aug 20 + Aug 25, 2026) framed as engineering phases, not customer-facing announcements. **Deferred** — building a polished changelog widget from this would mean editorializing internal ops work as "shipped features," which needs your call, not a guess. |
| Typography-scale push, buttons/tabs redesign, IDE-style product explorer, dark technical surfaces, `/changelog` page, design-token formalization beyond CSS utilities | **Not started this wave** — the brief is ~30 sub-requirements; this wave covers the reusable foundation + two real applications of it, not the full scope. |

## Wave 4 — hero typography push, button/tab micro-interactions

Triggered by "fill the gaps" after an honest creativity comparison against the old pre-rebuild site named two concrete gaps: hero type scale, and buttons/tabs.

| Item | Status |
|---|---|
| Homepage hero restructured to a full-width headline row (was sharing a 2-col grid with the widget, capping its size) and pushed to `clamp(3.5rem,9vw,8rem)` (was `clamp(3rem,7vw,6rem)`) | **Shipped** — verified in-browser, genuinely commands the viewport now. |
| Secondary-page H1s (`/product`, `/company`, `/solutions`, `/security`) bumped to `clamp(2.25rem,5vw,3.75rem)` (was `clamp(2rem,4.2vw,3rem)`) | **Shipped** |
| `Button` component: new `arrow` prop (`"arrow"` / `"external"`) — a 3px translate-only nudge on hover/focus, the one motion the brand allows | **Shipped** — applied to 3 genuinely exploratory/navigational links only ("Explore the full system", "Read the docs", "Back to home"); left off primary conversion CTAs (waitlist/talk-to-team) on purpose. Verified via a real `computer.hover` (synthetic JS mouseover doesn't trigger CSS `:hover` — confirmed the distinction while testing). |
| `SegmentedControl` component — an engineered-control tab switcher (mono uppercase labels, filled active segment, hairline track) | **Shipped**, applied to the QualiBOT demo's "Try the other state" toggle (previously ad-hoc pill buttons) — a real 2-state switch, not new fabricated tab panels. |
| Lighthouse re-run after the hero/typography changes | **Shipped** — performance 96 → 90 (LCP 2.5s → 3.4s; FCP unchanged at 2.1s, CLS 0, TBT 0ms) — a real, disclosed trade-off: the much larger hero heading takes longer to reach its final painted state. Accessibility/Best Practices/SEO held at 100/100/100. |
| Atmospheric/textured background (noise, gradient rings) to match the old site's decorative richness | **Deliberately not done** — the real brand kit specifies flat colour fields and hairline borders only; this gap stays closed on purpose, not by oversight. |

## Wave 5 — IDE-style explorer frame, evidence/trace enrichment, real bugs caught

Triggered by "finish what is left" against the technical-UI-language brief's remaining open items.

| Item | Status |
|---|---|
| `ExplorerFrame` component (dark technical-surface chrome bar: title + live status, body, optional footer) | **Shipped** — matches the brief's §19 IDE-inspector mockup structure closely, wrapping the *existing* real Quality Intelligence Graph + Traceability Path (no new fabricated content) on `/product`. |
| QualiBOT response block enriched with a `TRACE` field (`AUDIT → FINDING → CAPA`) | **Shipped** — reuses the same real entity vocabulary already established in the graph, not new concepts. |
| Real Lighthouse-caught bug: `TraceBlock`'s relation labels (`↓ REQUIRES` etc.) reintroduced the exact opacity-dimmed-text contrast anti-pattern already banned earlier this project | **Caught and fixed** — dropped the `opacity: 0.7`, full-contrast text now (3.03:1 → passes). |
| Real Lighthouse-caught bug: `StatusIndicator`'s label color (body-grey) fails contrast on the new dark-navy `ExplorerFrame` header | **Caught and fixed** — added a `light` variant (mint-light text, light-teal dot instead of deep-teal, which would've been nearly invisible on navy — gold was deliberately not used, reserved for hero/CTA only). |
| Real bug (non-score-affecting, `label-content-name-mismatch`, weight 0/hidden group — still a genuine screen-reader defect): the graph's "Risk" node had a redundant `aria-label="Risk (planned)"` not matching its own visible "Risk" + "PLANNED" text nodes | **Caught and fixed** — removed the redundant aria-label entirely across all graph nodes, letting the accessible name derive from visible content (guarantees no future mismatch). |
| Lighthouse re-verification | **Shipped** — `/product`: 98/100/100/100. `/`: 95/100/100/100. |
| `/changelog` + "Recently Shipped" | **Still blocked on your call** — the repo-history check (Wave 3) found real but ops-flavored history, not customer-facing features; building the UI now would mean editorializing that framing, which needs your decision, not a guess. |
| GitHub repo links | **Still blocked** — both `qmswebsite` and `qualitrackerchatbot` remain private; needs your decision (make one/both public, or don't link). |
| Design-token formalization as a separate system beyond CSS utilities (brief §28) | **Not done separately** — judged as already satisfied in substance by the existing `qt-*` CSS custom-property/utility convention and PascalCase component naming; a parallel token-naming layer on top would be process for its own sake, not a real gap. |

## Wave 6 — Quality Intelligence Graph, made genuinely top-tier

Triggered by "the qualitracker interactive model about quality intelligence should be creative (top-tier)" — the graph itself (not just its new ExplorerFrame chrome) was still a flat diagram: straight lines, plain dots, no sense of direction.

| Item | Status |
|---|---|
| Curved (quadratic-bezier) edges with real arrowhead markers, replacing straight `<line>`s | **Shipped** — makes the graph's already-real direction (Standard *requires* Document, never the reverse) visible for the first time; previously every edge looked symmetric even though the relationship never was. |
| Icon-badge nodes (lucide icons matching each real concept: shield/standard, file/document, workflow/process, etc.) replacing plain filled dots | **Shipped** — verified the icon nesting inside the parent SVG canvas actually renders correctly (was the one real technical risk in this change). |
| Active-node halo ring + an animated flow-pulse traveling along that node's real outgoing edges | **Shipped** — respects `useReducedMotion()` (same hook already used elsewhere on the site); verified the pulse genuinely animates (`cx` sampled twice, confirmed moving) and is fully gated off, not just visually paused, when motion is reduced. |
| Verification | Typecheck/lint/11 tests pass. Visually confirmed in-browser (hover halo + directional highlight + updated detail text). Mobile width: no horizontal overflow. Lighthouse: `/product` 95/100/100/100, `/` 94/100/100/100 — a small, real, disclosed cost (the graph chunk grew from added icons) for a substantially more polished visualization. |

## Wave 12 — canonical domain, structured data, real prerendering

Closes three items that had sat open since the very first audit: the canonical-domain decision, structured data, and SSR/prerendering.

| Item | Status |
|---|---|
| Canonical domain — historical resolution | **Superseded by Wave 14.** The current verified production host is `https://www.qualitracker.com/`; all canonical surfaces now use that final host. |
| Per-route canonical URL + og:url, not just title/description | **Shipped** — `useDocumentMeta` previously only updated title/description client-side, leaving every route's canonical/og:url pointing at the homepage until now. Extended to take a `path` and update both, plus twitter:title/description (previously untouched). |
| Organization JSON-LD (site-wide) | **Shipped** — static in `index.html`, real facts only (name, url, logo, description already established elsewhere on the site; no `sameAs`/`foundingDate` since neither is verified). |
| SoftwareApplication JSON-LD on `/` and `/product` | **Shipped** — no `offers`/price (none exists, pricing was deliberately removed sitewide) and no `aggregateRating` (no reviews exist) — omitted rather than invented. |
| Organization(+founder) JSON-LD on `/company` | **Shipped** — built directly from the page's own real `TEAM` array so it can't drift from the roster actually shown. |
| Build-time prerendering (`scripts/prerender.mjs`, puppeteer) | **Shipped** — a real headless-browser render pass per route, not a Node `renderToString` SSR migration (which would need every framer-motion/IntersectionObserver-dependent component guarded against a DOM-less environment — a much bigger, riskier change than this site's small fixed route set warrants). Wired into `pnpm run build` so it runs on every build going forward, not a one-off. |
| Real bug caught and fixed during this: prerendering "/" first baked its page-specific JSON-LD into the shared `dist/public/index.html` fallback shell, and every route processed afterward inherited that stale script tag on top of its own | **Caught and fixed** — reordered so "/" is always processed last; re-verified per-route schemas are exactly right with no leakage (`/security` has only the site-wide schema, `/company` has exactly its own two, etc.). |
| Verification | Confirmed correctness with a real static-directory-serving test server (Python's `http.server`, which — unlike `vite preview` — actually resolves `/security` to `security/index.html` the way a real static host does); `vite preview`'s blanket SPA-fallback was found to no longer correctly represent non-root routes now that real per-route files exist, a real limitation of that tool for this kind of testing going forward, not of the prerendered output itself. |
| Performance re-check | The static test server's Lighthouse numbers (76–85) were a measurement artifact, not a regression — confirmed via response headers that it serves zero compression (raw ~221KB JS, not the ~70KB gzip a real host would send). Re-tested the one route directly comparable to every prior session number (`/` via `vite preview`, the tool used throughout): 93/100/100/100, holding the established noise band. |
| Typecheck/lint/11 tests | Pass. |

## Wave 13 — fixed `pnpm run serve` to actually represent the prerendered build

Closes the exact limitation Wave 12's verification note flagged: `vite preview`'s blanket SPA fallback no longer correctly represented non-root routes now that real per-route prerendered files exist, and that tool is what this project's own workflow (and any developer sanity-checking the build) actually reaches for.

| Item | Status |
|---|---|
| Root cause | `vite preview` (`pnpm run serve`) defaults to `appType: 'spa'`, whose built-in fallback middleware serves the root `dist/public/index.html` for **any** request path that isn't an exact file match — including `/security`, `/product`, etc. — even though `dist/public/security/index.html` etc. now exist on disk. `curl http://localhost:4173/security` was silently returning the homepage's title/content. |
| First thing tried, and why it wasn't sufficient alone | Setting `appType: 'mpa'` (Vite's flag for disabling that SPA-wide fallback) conditionally on `isPreview`. This alone breaks two things: (1) Vite's own `appType: 'mpa'` html-fallback logic only resolves a directory's `index.html` for URLs that already end in `/` — a trailing-slash-less `/security` (the format used everywhere on this site) isn't matched, so it 404s instead of serving the file. (2) `scripts/prerender.mjs` calls Vite's `preview()` JS API directly to bootstrap the very same routes before their per-route files exist yet (routes are rendered and written one at a time) — `isPreview` is `true` for that internal call too, so gating on `isPreview` alone would make `appType: 'mpa'` break prerendering itself (its own SPA-fallback bootstrap would 404 on every route but whichever was written first). |
| What actually fixed it | Two changes together, both scoped to a new `VITE_STATIC_PREVIEW=true` env var set only by the `serve` npm script (never by `vite dev`, never by `scripts/prerender.mjs`'s internal `preview()` call): (1) `appType: 'mpa'` applied only when `isPreview && process.env.VITE_STATIC_PREVIEW === 'true'`. (2) A small `configurePreviewServer` plugin (`staticPrerenderedRoutes` in `vite.config.ts`) registered only under that same condition, which does real directory+index resolution for extensionless, non-trailing-slash paths — rewriting `/security` to `/security/index.html` before Vite's own middleware runs, whenever that file exists on disk (with a path-traversal guard on the decoded URL). `vite.config.ts` was converted from a plain object export to `defineConfig(async ({ isPreview }) => ({...}))` to read `isPreview`. |
| Verification — full build | `pnpm run build` (vite build + prerender.mjs) succeeds unchanged; prerender step still writes all 8 routes correctly since its own internal preview server never sets `VITE_STATIC_PREVIEW` and keeps the default `appType: 'spa'` bootstrap fallback. |
| Verification — `pnpm run serve` (`PORT=4173`, `VITE_STATIC_PREVIEW=true`) | `curl http://localhost:4173/` → `<title>QualiTracker — Quality that works for every lab</title>`. `curl http://localhost:4173/security` (no trailing slash, no `-L` needed — 200 directly) → `<title>Security — QualiTracker</title>` and body contains "never leaves its own boundary". `curl http://localhost:4173/security/` (trailing slash) → same 200 and title. `curl http://localhost:4173/product` → `<title>Product — QualiTracker</title>`. `curl http://localhost:4173/company` → `<title>Company — QualiTracker</title>`. `curl http://localhost:4173/this-route-does-not-exist` → real `404` (previously would have been a silent `200` of the homepage) — matches how a real static host without a catch-all rewrite behaves. |
| Verification — `pnpm run dev` unaffected | `isPreview` is `false` for `vite dev`, so `appType` stays the default `'spa'` and the new plugin never registers. Confirmed live: `curl http://localhost:5177/security` during dev returns `200` with the SPA shell's default title (client-side hydration still required, as expected — no prerendered file exists yet in dev), and an unknown path also returns `200` with the SPA shell (wouter renders `NotFound` client-side), exactly as before this change. |
| Typecheck/lint/11 tests | Pass (`pnpm run typecheck`, root `pnpm run lint`, `pnpm run test -- --run`). `vite.config.ts` itself sits outside `tsconfig.json`'s `include` (`src/**/*` only), so it isn't part of the typecheck's own signature, but was written with explicit `Plugin`/`Connect.NextHandleFunction` types regardless. |
| Cleanup | Preview and dev servers stopped after verification; no background processes left running. |

## Wave 14 — complete social metadata, icon set, and keyboard navigation

Triggered by the enterprise website framework and peer-stack review supplied in November 2026.

| Item | Status |
|---|---|
| Open Graph and X large-image previews | **Shipped locally** — added a branded 1200×630 PNG and the complete image URL, secure URL, MIME type, dimensions, alt text, site name, locale, and X card fields. |
| Preferred canonical host | **Shipped locally** — live verification showed `qualitracker.com` redirects to `www.qualitracker.com`; canonical, Open Graph, JSON-LD, sitemap, and robots now use the final `www` host. |
| App and browser icons | **Shipped locally** — added 32×32 favicon, 180×180 Apple touch icon, 192×192 and 512×512 manifest icons, theme colour, and `site.webmanifest`. |
| Structured data | **Shipped locally** — site-wide `Organization` and `WebSite` graph plus expanded `SoftwareApplication` identity, image, language, and publisher references. No ratings, pricing, or social profiles were invented. |
| Accessibility | **Shipped locally** — keyboard skip link, stable main landmark target, and explicit mobile-menu control relationship. Unknown routes now emit `noindex, follow`. |
| Verification | 49 automated checks pass, workspace typecheck passes, full production build prerenders all nine routes, local browser console is clean, and generated metadata is present in the static route HTML. Social platform cache validators remain post-deploy checks. |

## Wave 15 — deeper, accessible product interactions

Triggered by the request to improve the site's interactive illustrations before replacing placeholder product screens with real application UI.

| Item | Status |
|---|---|
| Quality Intelligence Graph | **Shipped locally** — nodes can now be previewed or locked by mouse, touch, Enter/Space, and arrow-key navigation. The selected node exposes its description plus incoming and outgoing relationships in a live detail panel. |
| Module map | **Shipped locally** — selecting a module now updates a four-stage maturity path using the module's existing status; no dates or capabilities were invented. |
| QualiBOT answer pipeline | **Shipped locally** — every stage is directly selectable, Previous/Next controls and a live step count were added, and the same interaction remains available with reduced motion enabled. |
| Evidence-bound copy | **Corrected** — the final answer state now reports the verified retrieval-threshold result and required human review instead of an unsupported confidence label. |
| Accessibility | **Verified locally** — touch-sized controls, `aria-pressed`, polite live regions, keyboard focus movement, and reduced-motion behavior are covered by automated tests and rendered checks. |
| Verification | 51 automated checks pass; workspace typecheck and full production build pass; desktop and iPhone touch flows render without horizontal overflow or browser console errors. |

## What this plan deliberately does not include

No GSAP, no WebGL/3D, no new animation library, no CMS, no design-token pipeline change — see `12_SKILL_GAP_ANALYSIS.md` for why each was considered and set aside.
