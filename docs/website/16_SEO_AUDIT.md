# SEO & AI-Discoverability Audit

## Current implementation status (2026-11-14)

This section supersedes the historical open items below. The site remains on its existing React, Vite, Firebase Hosting, Tailwind, and Radix stack. Build-time Puppeteer prerendering gives every public route crawlable static HTML, so a framework migration is not required for the current fixed route set.

- **Canonical origin:** `https://www.qualitracker.com/`. Live verification confirmed that the non-`www` origin redirects to this host. Canonical links, `og:url`, JSON-LD, sitemap entries, and the robots sitemap directive now use the final host.
- **Social previews:** every route publishes its own title, description, canonical URL, and Open Graph URL with a shared branded `1200×630` PNG. The image includes explicit MIME type, dimensions, and alt text. X uses `summary_large_image` with matching title, description, image, and image alt text.
- **Per-page strategy:** titles, descriptions, canonical URLs, robot directives, and social fields are set through `useDocumentMeta` and baked into each route by `scripts/prerender.mjs`. Use a page-specific image only when that page has a stable visual worth sharing; otherwise retain the branded default so preview quality never depends on a missing asset.
- **Structured data:** the static shell contains an `Organization` + `WebSite` `@graph`; product surfaces add `SoftwareApplication`; the company page augments the same organization identity with verified founders. Pricing, ratings, social accounts, certifications, and launch claims are omitted unless verified.
- **Discovery files:** `robots.txt`, `sitemap.xml`, favicon, Apple touch icon, 192/512 app icons, and `site.webmanifest` are present.
- **404 behavior:** unknown client routes emit `noindex, follow` so useful navigation remains available without indexing error pages.

### Post-deploy validation

1. Confirm `/og-default.png` returns `200`, `Content-Type: image/png`, and is exactly `1200×630`.
2. Submit the final public URL to Meta's Sharing Debugger: `https://developers.facebook.com/tools/debug/`.
3. Submit it to LinkedIn Post Inspector: `https://www.linkedin.com/post-inspector/`.
4. X's historical Card Validator currently redirects to an authenticated X login and returned `403` to an unauthenticated check. After deployment, use the authenticated validator if available and verify the preview in an X post composer before publishing.
5. Test at least the homepage, product, security, and beta-interest URLs. Each must show its own route title and URL, with the shared default image until page-specific artwork exists.

## Fixed this session (real, verified)

- **Per-route `<title>`/description**: `index.html` shipped one static title/description for every route — meant only ever mattered for the old single-page site. Added `useDocumentMeta` (no new dependency), verified via `document.title` changing correctly on navigation to `/product` in a live browser check.
- **Sitemap**: `public/sitemap.xml` listed only `/`. Updated to all 8 routes with reasonable `priority`/`changefreq` values.
- **Favicon**: was a generic orange rounded-square (`#FF3C00`), unrelated to the brand. Replaced with the real QT mark on Deep Teal.
- **Duplicate font request** removed (see `15_PERFORMANCE_AUDIT.md`) — a page-weight issue, not strictly SEO, but affects load speed which factors into ranking.

## Open — architectural limit, not a quick fix

**This is a client-rendered SPA with no SSR/prerendering.** `useDocumentMeta` updates `document.title` and the meta tags *after* React mounts and runs an effect — a crawler or bot that doesn't execute JavaScript sees only `index.html`'s static (homepage-oriented) title/description/OG tags, for every single route. Modern Googlebot generally does execute JS and would likely see the per-route titles correctly; social-media unfurlers (Slack, Twitter/X, iMessage link previews) and many simpler crawlers typically do not, so a `/waitlist` link shared on social media would currently show the *homepage's* OG title/description, not a waitlist-specific one.

The real fix is prerendering or SSR (e.g. `vite-plugin-ssr`, or moving to a framework with built-in SSR) — a genuinely bigger change than anything else in this audit, correctly out of scope for a quick pass. Flagged, not silently worked around.

## Open — needs a decision, not code

**Canonical domain mismatch.** `index.html`'s `<link rel="canonical">` and `og:url` point to `https://qualitracker.org/`. The real brand system's own `readme.md` (`qualitracker-io` Claude Design project) lists the product's web address as `qualitracker.co`. These are two different domains — worth resolving which one is actually owned/live before launch, since shipping the wrong canonical URL actively hurts SEO rather than doing nothing. Not something to guess and silently pick.

## Open — not yet done, moderate effort

- **Structured data (schema.org)** — no JSON-LD anywhere (e.g. `Organization`, `SoftwareApplication`, or `FAQPage` markup). Worth adding once the Pricing/Security pages have real, stable content — premature to markup content that's still `coming-soon`.
- **robots.txt/sitemap correctness** — `robots.txt` itself is fine (`Allow: /`, points at the sitemap); no `Disallow` rules needed since nothing on the site is private.

## Not applicable yet

Blog/insights content, case studies, and any keyword-targeted landing pages don't exist and shouldn't be invented just to have SEO surface area — per `05_INFORMATION_ARCHITECTURE.md`'s own "don't create pages merely to make the website larger" principle, restated here for the SEO context specifically.
