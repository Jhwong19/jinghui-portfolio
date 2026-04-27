# CLAUDE.md

Guidance for Claude Code working in this repo. Read `.claude/rules.md` and `prd.md` alongside this file.

## What this repo is

Static personal portfolio served by GitHub Pages at `www.jinghuiwong.com` (custom domain via `CNAME`). **No build step, no framework, no package manager, no test suite, no Jekyll.** Files in the repo root are served as-is.

Local preview: `bash scripts/serve.sh` (or `python3 -m http.server 8000`) → `http://localhost:8000`.

## Active work: v2 monopo-inspired refresh

The original 8-sprint redesign (PRs #2–#14) shipped a dark monopo-inspired portfolio. **v2** (PRs #15–#17, ongoing) closes the visual gap with monopo.vn — adds an inline desktop nav, hero text rotation, full manifesto on the home page, and a WebGL hero (Three.js sphere-noise background + Fresnel cursor lens). Plan lives in **`prd-v2.md`**. The original `prd.md` documents the v1 sprint plan and is kept for history.

Reference assets (out of served root):
- `reference/new-website.html` — saved copy of `monopo.vn` used as the structural reference.
- `reference/screens/image_0[1-9].png`, `image_10.png` — top-to-bottom scroll screenshots of the target design.

## Stack

Fully vanilla, fully self-hosted. No build step, no CDN runtime calls.

- `assets/css/site.css` — single stylesheet. `:root` design tokens (palette, accent gradient, type scale via `clamp`, spacing, motion, easing). All redesign rules live here.
- `assets/js/site.js` — chrome JS: overlay-nav focus trap, IntersectionObserver reveal, member expand, manifesto line-draw, scroll-to-top, hero rotation. Loaded with `defer` on every page.
- `assets/js/hero/` — **WebGL hero modules** (`index.js`, `background.js`, `lens.js`, `pointer.js`). Loaded only on `index.html` via `<script type="module">`. Imports `three` via `<script type="importmap">` from `assets/js/vendor/three.module.js` (pinned r163).
- `assets/fonts/` — self-hosted woff2 (Inter 400/500/700, Manrope 400/500/700, JetBrains Mono 400/500). Wired via `@font-face` at the top of `site.css`.
- Massively template fully removed (PR #12). No `main.css`, no jQuery, no FontAwebFonts.

## Pages

Four standalone HTML files at the repo root, each duplicating header/nav/footer:
- `index.html` — projects index.
- `profile.html` — about/profile.
- `DeliveryRouteOptimisation.html`, `ChaptiveAI.html` — project detail pages.

Adding a new project: copy an existing project page so chrome stays consistent, add a card to `index.html`, drop media into `gif/` or `images/`. Update header/footer on all 4 pages in the same commit.

## Agents and skills

Defined in `.claude/agents/` and `.claude/skills/`. The redesign loop is:

`redesign-orchestrator` → picks next feature from `prd.md` → spawns `feature-dev-<area>` → spawns `visual-reviewer` → invokes `git-flow` skill to PR.

See `prd.md` §6 and §7 for the full agent/skill catalogue. Never edit code outside the `feature-dev-*` allow-lists.

## Conventions to preserve

- External links: `target="_blank" rel="noopener"`.
- `mailto:` links use a real email, never `href="#"`.
- Asset paths are relative (`assets/...`, `gif/...`), never absolute.
- Favicon `<link>` tags duplicated across all 4 HTML files — keep in sync.
- GIF filename mismatch (`gif/chaptly_*.gif` vs. `ChaptiveAI.html`) is intentional — don't rename.
- Every animation must respect `prefers-reduced-motion: reduce`.

## Branching

Never commit to `main`. Always go through the `git-flow` skill (`feature/sprint-<N>-<slug>`, `hotfix/<slug>`, `chore/<slug>`, `release/sprint-<N>`). PR body links the PRD section, matching screenshot, and visual-reviewer report.
