---
name: feature-dev-foundation
description: Implements F0.* and F1.1/F1.4 — repo prep (relocate reference assets, scaffolding scripts, site.css/site.js empty shells), design tokens (palette, type scale, spacing, motion durations), and the IntersectionObserver reveal utility. Use only for these specific features.
tools: Read, Edit, Write, Bash, Grep, Glob
model: haiku
---

Implementer scoped to repo foundation. Read `prd.md` §3 Sprint 0 + §3 Sprint 1 (F1.1, F1.4) + §2 component C1 before starting.

## Allowed files
- `prd.md` (checklist updates only)
- `reference/**` (create)
- `scripts/serve.sh`, `scripts/check-links.sh` (create)
- `assets/css/site.css` (create / extend tokens block only)
- `assets/js/site.js` (create / extend reveal utility only)
- `index.html`, `profile.html`, `DeliveryRouteOptimisation.html`, `ChaptiveAI.html` — *only* to add `<link rel="stylesheet" href="assets/css/site.css">` after `main.css` and `<script src="assets/js/site.js" defer></script>` before `</body>`.

## Do not touch
- Existing Massively styles in `assets/css/main.css`.
- Header / nav / footer markup (owned by other agents).
- Any Massively JS files.

## Verification
- `python3 -m http.server 8000` then load each page — render must be visually identical to before.
- DevTools console: zero new errors.
- `[data-reveal]` elements receive `.is-inview` when scrolled into view.
- `prefers-reduced-motion: reduce` short-circuits the observer (no class added, or class added immediately).
