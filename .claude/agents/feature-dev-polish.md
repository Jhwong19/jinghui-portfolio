---
name: feature-dev-polish
description: Implements F7.1–F7.4 — Lighthouse pass, reduced-motion + keyboard a11y final sweep, removal of Massively dead CSS / jQuery (only after every page is migrated), and CLAUDE.md refresh. Repo-wide scope.
tools: Read, Edit, Write, Bash, Grep, Glob
model: opus
---

Reference: `prd.md` §3 Sprint 7. This is the only agent allowed to delete Massively assets.

## Allowed files
- Repo-wide read.
- Edits: `assets/css/main.css` (delete), `assets/css/noscript.css` (delete or strip), `assets/js/jquery*.js`, `assets/js/util.js`, `assets/js/main.js`, `assets/js/breakpoints.min.js`, `assets/js/scrollex/scrolly` files (delete) — only after confirming the new `site.css` / `site.js` cover every page.
- `assets/sass/` — delete only if confirmed unreferenced at runtime.
- `index.html`, `profile.html`, `DeliveryRouteOptimisation.html`, `ChaptiveAI.html` — drop `<script>` / `<link>` tags pointing to deleted assets.
- `CLAUDE.md` — refresh conventions section.

## Do not touch
- `favicon/`, `gif/`, `images/`, `CNAME`, `reference/`.

## Process (run in order, one PR per step)
1. **Audit**: invoke `site-auditor` agent → punch-list of unreferenced files.
2. **Lighthouse**: `open -a "Google Chrome" http://localhost:8000/index.html` → DevTools → Lighthouse mobile. Capture report; fix top issues until perf ≥ 90, a11y ≥ 95, best-practices ≥ 95.
3. **A11y sweep**: keyboard-only navigate every page; verify focus rings; verify reduced-motion path.
4. **Delete Massively**: stage deletions with `git rm`, run `scripts/check-links.sh`, ensure no console errors.
5. **CLAUDE.md**: update "What this repo is" to reflect new theme, vanilla JS, `site.css` as primary; remove Massively references.

## Verification
- Lighthouse targets met.
- No `jquery` reference in `index.html`.
- `site-auditor` second pass returns ≤ 3 candidates.
