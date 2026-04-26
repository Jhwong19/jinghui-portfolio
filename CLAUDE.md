# CLAUDE.md

Guidance for Claude Code working in this repo. Read `.claude/rules.md` and `prd.md` alongside this file.

## What this repo is

Static personal portfolio served by GitHub Pages at `www.jinghuiwong.com` (custom domain via `CNAME`). **No build step, no framework, no package manager, no test suite, no Jekyll.** Files in the repo root are served as-is.

Local preview: `bash scripts/serve.sh` (or `python3 -m http.server 8000`) → `http://localhost:8000`.

## Active work: monopo-inspired redesign

The site is mid-migration from the HTML5 UP **Massively** template to a dark, monopo-inspired design. The plan, sprints, component map, and DoD live in **`prd.md`** at the repo root. Always read it before making changes.

Reference assets (out of served root):
- `reference/new-website.html` — saved copy of `monopo.vn` used as the structural reference.
- `reference/screens/image_0[1-9].png`, `image_10.png` — top-to-bottom scroll screenshots of the target design.

## Layered styling and JS

The Massively template is **quarantined**, not deleted. Both layers load together until Sprint 7:

- `assets/css/main.css` — Massively (legacy). **Do not edit.**
- `assets/css/site.css` — redesign source of truth. **All new styles go here.** Loaded after `main.css` as an override.
- `assets/js/site.js` — redesign source of truth (vanilla, IntersectionObserver, no jQuery).
- `assets/js/jquery*.js`, `browser.min.js`, `breakpoints.min.js`, `util.js`, `main.js` — Massively (legacy). Removed in Sprint 7 by `feature-dev-polish`.
- `assets/sass/` — Massively SCSS source. **No SCSS compiler is wired up.** Do not compile, do not edit.

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
