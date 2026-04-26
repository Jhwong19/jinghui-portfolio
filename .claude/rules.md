# Project rules

Rules specific to this static portfolio repo. Read alongside `CLAUDE.md` and `prd.md`.

## Design rules (monopo-inspired redesign)

These define the *look and feel* the redesign must converge on. Reference: `reference/new-website.html` + `reference/screens/image_0[1-9].png` + `reference/screens/image_10.png`.

1. **Theme**: dark default — bg `#000`, fg `#fff`, muted `#8a8a8a`. No light-mode variant for now.
2. **Accent gradient**: green → amber → orange (`linear-gradient(90deg, #6fbf73, #f5b942, #e87a3f)`). Used for: hover states on pills, the contact email link (via `background-clip: text`), and decorative line draws.
3. **Type scale** (CSS `clamp()`): hero `clamp(48px, 9vw, 140px)`, section H2 `clamp(40px, 6vw, 88px)`, body `16px` mobile / `18px` desktop, eyebrow `12px` uppercase tracked.
4. **Fonts**: Roobert (primary) + Raleway italic (accent). Fallback: Inter + Manrope. Self-hosted via `@font-face`. Document the chosen fallback in the `assets/css/site.css` header comment.
5. **Eyebrow convention**: small caps with leading `↳ ` glyph and slash-prefixed label, e.g. `↳ /BUILD`. Used for section labels in manifesto and project meta.
6. **Buttons**: only two button styles allowed —
   - `.btn-pill` — outlined pill, gradient outline on hover.
   - `.btn-to-top` — circular, `↑` glyph.
   Massively `.button.large` and `.button.icon.solid.solo` are retired.
7. **Spacing rhythm**: vertical section padding `clamp(64px, 10vh, 160px)`. Inline gutters `clamp(20px, 5vw, 80px)`. Don't introduce new spacing values — extend the tokens in `site.css`.
8. **Motion**:
   - Hero orb: pure CSS radial gradient + `filter: blur(80px)` + slow translate/scale keyframes.
   - Reveal: `[data-reveal]` gets `.is-inview` via `IntersectionObserver`, fade + 16px translate, ≤ 600 ms.
   - Manifesto line: SVG `stroke-dashoffset` animation on enter.
   - Badge: SVG `<textPath>` + CSS `animation: rotate 20s linear infinite`.
   - **Every animation** must short-circuit under `@media (prefers-reduced-motion: reduce)`.
9. **Imagery**: full-bleed for hero media on project cards and project pages; never crop GIFs.
10. **Iconography**: text-glyph arrows only — `↗` for external, `↓` for scroll cue, `↑` for back-to-top, `↳` for eyebrow. No FontAwesome, no SVG icon sets.
11. **Cursor**: default OS cursor. Custom-cursor (monopo `.dot-cursor`) is out of scope.
12. **Language**: English only. Don't import the monopo language switcher.

## Technical defaults

These are non-negotiable runtime constraints.

1. **Hosting**: GitHub Pages from the repo root with `CNAME`. Any change that breaks this requires explicit user approval and a `CLAUDE.md` update.
2. **No build step**: no Jekyll, Vite, Astro, 11ty, webpack, esbuild, SCSS-watch, npm scripts, or package manager. Plain HTML/CSS/JS only.
3. **No framework**: vanilla JS only. No React, Vue, Svelte, jQuery (Massively's jQuery is being retired in Sprint 7 and must not be reintroduced).
4. **CSS layering**: `assets/css/site.css` is the source of truth. `assets/css/main.css` (Massively) is quarantined — load it first so `site.css` overrides it. `assets/sass/` is read-only — do not compile.
5. **JS layering**: `assets/js/site.js` is the source of truth. Massively JS files (`jquery*.js`, `browser.min.js`, `breakpoints.min.js`, `util.js`, `main.js`) are quarantined and removed in Sprint 7.
6. **Browser support**: evergreen Chrome, Safari, Firefox, Edge. No IE. Use modern CSS (clamp, `:has`, custom properties, `aspect-ratio`) freely.
7. **External resources**: self-host fonts and SVGs. No CDN-loaded JS. No analytics, trackers, cookie banners, third-party widgets.
8. **Asset paths**: relative paths only (`assets/...`, `gif/...`). Never absolute (`/assets/...`) — breaks GitHub Pages preview branches.
9. **HTML pages**: must be standalone (no template engine). Header/footer/nav are duplicated across `index.html`, `profile.html`, `DeliveryRouteOptimisation.html`, `ChaptiveAI.html`. The `feature-dev-chrome` and `feature-dev-contact-footer` agents own those blocks and must update all 4 in the same commit.
10. **Accessibility floor**: every interactive element keyboard-reachable; visible focus ring; ARIA on toggles (`aria-expanded`, `aria-controls`, `aria-hidden`); contrast ≥ 4.5:1 for body text.
11. **Performance floor** (Lighthouse mobile, `index.html`): perf ≥ 90, a11y ≥ 95, best-practices ≥ 95. No image > 500 KB on home page.
12. **Permissions surface**: keep `.claude/settings.local.json` minimal — only the commands actually used in this loop.

## Workflow rules

How redesign work is planned, executed, reviewed, and shipped.

1. **Single source of truth**: `prd.md` at repo root. Sprint progress, feature checklists, and component IDs (C1–C18) live there. Update it as features land — don't keep parallel state.
2. **Orchestration**: the `redesign-orchestrator` agent decides what to do next. Other agents do not pick their own work.
3. **One feature → one branch → one PR**: never bundle features across sprints. Each PR closes one F-numbered feature.
4. **Branch naming** (enforced by the `git-flow` skill): `feature/sprint-<N>-<slug>`, `hotfix/<slug>`, `chore/<slug>`, `release/sprint-<N>`. `<slug>` ≤ 30 chars, kebab-case.
5. **Branching policy**: never commit directly to `main`. Never force-push `main`. Never `--no-verify` or bypass signing.
6. **Component scope**: each `feature-dev-*` agent edits only files in its allow-list (`prd.md` §6.3). Header/nav are owned exclusively by `feature-dev-chrome`; footer/contact by `feature-dev-contact-footer`.
7. **Massively quarantine**: do not delete `assets/css/main.css`, `assets/sass/`, or Massively JS until Sprint 7 (`feature-dev-polish`). New work is additive.
8. **Cross-page parity**: changes to `<header>`, overlay nav, or `<footer>` apply to all 4 HTML pages in the same commit. `scripts/check-links.sh` must pass before merge.
9. **Reference assets**: `NEW_WEBSITE.HTML` and `image_0*.png` live under `reference/` only. They must never appear in the served root (GitHub Pages would otherwise serve them).
10. **Visual-review gate**: every PR includes a `visual-reviewer` punch-list verdict. No merge on `RESULT: NEEDS_WORK` blockers.
11. **PR body** (templated by `git-flow`) links (a) the PRD section, (b) the matching `image_0X.png`, (c) the visual-reviewer report.
12. **Local preview**: `bash scripts/serve.sh` (`python3 -m http.server 8000`). Hard-refresh between edits.
13. **Pre-push checks**: `bash scripts/check-links.sh` clean; no `console.log` in `site.js`; only files in the agent's allow-list touched (`git diff --name-only main...HEAD`).
14. **Atomic commits**: small, scoped, with the standard trailer (`Co-Authored-By: Claude Opus 4.7 ...`). Don't amend published commits — make a new one.
15. **Cleanup**: identify → propose → confirm → delete. Never bulk-delete without showing the plan first. Use `git rm` for tracked deletions; don't auto-commit.

## Always

- External links use `target="_blank" rel="noopener"`.
- `mailto:` links use a real email, never `href="#"`.
- Don't rename existing GIFs (`gif/chaptly_*` mismatch with `ChaptiveAI.html` is intentional — known and accepted).
- Don't delete `favicon/`, `gif/`, `images/`, `CNAME`.
