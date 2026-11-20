# Accessibility Audit

Target: WCAG 2.2 AA. This is a real inspection of the current code (contrast ratios computed, not estimated), not a generic checklist — paired with what genuinely wasn't checked, stated plainly.

## Checked and passing

- **Focus states**: `.qt-focus` (2px solid `--qt-deep-teal`, 2px offset) applied to every interactive element built this session — buttons, links, form fields, docs sidebar items. Verified present in `index.css` and referenced consistently across components.
- **Bypass navigation**: every page now begins with a keyboard-visible “Skip to main content” link targeting the stable `#main-content` landmark. The label is localized in English and Kiswahili.
- **Reduced motion**: the global CSS media query in `index.css` zeroes animation/transition duration; the new Framer Motion reveals (`components/site/reveal.tsx`) separately call `useReducedMotion()` and skip the animation entirely rather than relying on the CSS override alone — belt and suspenders, correctly.
- **Form errors**: both lead forms use `role="alert"` on the error message, so a screen reader announces it without the user needing to find it visually. Verified by triggering the real failure path (submitting with no backend running).
- **Semantic heading order**: spot-checked every page — each has exactly one `<h1>` per rendered state (Docs' `IntroductionContent`/`ComingSoon` each render their own `<h1>` but never both at once, since only one is mounted at a time), section titles are `<h2>` via `SectionHeader`, card titles are `<h3>`. No skipped levels found.
- **Labels**: form fields use the `<label><span>Label text</span><input/></label>` pattern — implicit label association, valid HTML, no orphaned inputs.
- **Contrast — real bug found and fixed**: `.qt-eyebrow-light` (gold-on-dark-navy, used for eyebrows on dark sections) computes to **5.26:1** — passes AA. `--qt-gold-text` (#9D833B) used as 9px label text on a light background computed to **~3.66:1** — fails the 4.5:1 AA threshold for small text. Fixed this session (two occurrences in `ask-qualitracker-demo.tsx`, moved to `--qt-body-grey`); the gold was kept only on the accompanying icon, since non-text/graphical elements only need 3:1 (which it clears).

## Automated audit — now run (Lighthouse, against the production build, not the dev server)

Real Lighthouse run against `vite preview` (the dev server gives false readings — see `15_PERFORMANCE_AUDIT.md`). First pass: **90/100**, two real failures Lighthouse caught that manual review had missed:

1. **`RagPipelineScroll`'s dimmed (pre-activation) step description text** — `color: var(--qt-body-grey)` at `opacity: 0.45` computed to **~1.94:1** (needs 4.5:1). The opacity trick to show "not yet reached" steps quietly wrecked contrast for real users, not just Lighthouse's snapshot — for anyone whose `onViewportEnter` never fires, that text stays permanently too-light. Fixed: description text is always full-opacity now; only the circle/label carry the active/inactive cue.
2. **The same pattern in `QualityIntelligenceGraph`'s dimmed nodes** — opacity was applied to the whole `<g>` (circle *and* label together), so hovering one node dropped every other node's *label text* below 4.5:1 too, not just its decorative circle. Fixed: dimming now applies to the circle only; labels stay full-opacity/full-contrast always.
3. **`meta name="viewport"` had `maximum-scale=1`**, blocking pinch-zoom — a real barrier for low-vision users. Removed the cap entirely.

Re-run after fixes: **100/100**, zero failing audits. This is the concrete lesson from finding these two: an opacity-based "dim the inactive state" pattern is a genuine, easy-to-miss contrast trap — anywhere else this pattern gets reused, check the dimmed state's contrast explicitly, not just the active one.
- **Docs sidebar keyboard navigation** — the site-wide skip link bypasses the global navigation. The Docs sidebar is inside the main landmark, ahead of the article. A shortcut to the article and arrow-key navigation within the sidebar remain future enhancements.
- **Touch target size** — not measured against the 24×24px (WCAG 2.2) / 44×44px (best practice) minimums on mobile; the compact `size="sm"` nav button and docs sidebar rows are the most likely to be under-sized and haven't been checked with a ruler.
- **Colour-only status signal** — `StatusBadge` pairs a coloured dot with text label (good practice, not colour-only), but the accreditation-readiness bar's colour-coding (teal vs. gold based on the 70% threshold) has no non-colour indicator (e.g., an icon) alongside it. Minor, but a real gap for colour-blind users trying to distinguish "on track" from "needs attention" bars quickly.

## Not applicable / no finding

Alt text: no photography or illustrative imagery exists on the site (by brand design, see `02_BRAND_SOURCE_OF_TRUTH.md`), so there's currently nothing to audit here — the QT symbol SVG is decorative/branded and has `role="img" aria-label="QualiTracker"` set.
