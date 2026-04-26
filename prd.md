# PRD — Portfolio Redesign (monopo-inspired)

> Plan-mode source for `prd.md` at the repo root. Once approved, copy this file to `/Users/jinghuiwong/github/jinghui-portfolio/prd.md`.

## 1. Context
Refine the static GitHub Pages portfolio at `www.jinghuiwong.com` (currently the HTML5 UP **Massively** template — light, photo-feed, jQuery scrollex) toward the dark, oversized-typography, motion-rich aesthetic of `NEW_WEBSITE.HTML` (saved copy of `monopo.vn` / monopo saigon, confirmed: Nuxt + Locomotive Scroll, Roobert + Raleway fonts).

The 10 reference screenshots map to scroll position from top to bottom of monopo:

| Screenshot | Section in monopo | Maps to in our site |
|---|---|---|
| `image_01.png` | Hero — animated dark gradient orb, oversized headline, sticky logo + hamburger, rotating circular badge | Replaces `#intro` block in `index.html` |
| `image_02.png` | "Selected project" header + dark project hero | New section header above project cards |
| `image_03.png` | Project card — image, title, role/meta caption | Replaces `<article class="post featured">` markup |
| `image_04.png` | "They trust us" — wordmark list + pill CTA | Repurposed as **"Tooling"** strip (Python, GCP, AWS, HF, LangChain…) + "More on GitHub" pill |
| `image_05.png` | Manifesto opening — "We Integrate, Collaborate, Challenge" | New manifesto teaser on home, full block on `profile.html` |
| `image_06.png` | Manifesto detail — `↳ /INTEGRATE` label, body, decorative graphic | Three-part block: **Build / Ship / Learn** |
| `image_07.png` | Team intro — "From Tokyo to Saigon, we come from all over the world" | "From Singapore, building with AI" intro on `profile.html` |
| `image_08.png` | Team member card — portrait, name, role, `+` reveal | Single profile card for Jing Hui |
| `image_09.png` | Contact — "Keep in touch", colored email link, offices | New `#contact` anchor + gradient email link |
| `image_10.png` | Footer — "Visit the site" CTA, "Follow us" socials with ↗ icons, scroll-to-top circle | Replaces `#footer` + `#copyright` |

Constraints (per `CLAUDE.md`): static GitHub Pages from repo root, **no build step, no framework, no Jekyll, custom domain via `CNAME`**. All redesign work ships as plain HTML/CSS/JS.

## 2. Component retrofit map: `NEW_WEBSITE.HTML` → current site

Each row is a unit of work mapped to a sprint. Class names on the left were verified by grepping `NEW_WEBSITE.HTML`.

| # | Source class/component (monopo) | Behavior to retrofit | Current site target | Replaces / merges with |
|---|---|---|---|---|
| C1 | body `.has-scroll-smooth` + Locomotive Scroll | Smooth-scroll + `is-inview` reveal class | new `assets/js/site.js` using `IntersectionObserver` | drops jQuery `scrollex` / `scrolly` |
| C2 | `.logo` (sticky top-left mark + sub-label) | Sticky top-left "JHW" mark | new `<header class="site-header">` block on every HTML page | nothing (Massively has no global header) |
| C3 | `.burger` + `.menu` + `.overlay` | Top-right hamburger toggling fullscreen overlay nav | same `<header>` + new `<nav class="overlay-nav">` | replaces inline `#nav` block in current pages |
| C4 | `.intro` + `.gradient` + `.canvas-container` | Full-viewport hero w/ animated radial gradient + oversized headline | rebuild `#intro` in `index.html` | replaces existing `#intro` block |
| C5 | `.brands.is-inview` rotating circular badge | SVG `textPath` rotating mark in hero | new `assets/img/badge.svg` + CSS rotation | nothing (new) |
| C6 | `.button.icon.solid.solo.fa-arrow-down.scrolly` "Continue" | Round `↓` scroll-cue button | retrofit existing Continue anchor to monopo round style | restyles existing button |
| C7 | `.head` + "Selected project" eyebrow | `↳ Selected project` section header | new `<section class="selected-projects">` heading | precedes project cards |
| C8 | `.img-container.is-inview` + `.name` + `.details` | Card with full-bleed media, title, kicker meta, gradient hover | rebuild `<article class="post featured">` markup | replaces both featured posts in `index.html` |
| C9 | "More project on monopo.tokyo" pill button | Outlined pill CTA with gradient hover | retrofit "Demo" + "Blog" buttons | restyles `.button.large` |
| C10 | `.brands` "They trust us" wordmark grid | Centered single-column tool list | new "Tooling" section | additive |
| C11 | `.manifesto` + `.manifestoLine` SVG + `↳ /LABEL` | Three sections (Build / Ship / Learn) with arrow eyebrow + body + decorative SVG line draw | new `<section class="manifesto">` on `profile.html` (teaser on `index.html`) | replaces existing profile body |
| C12 | `.members` + `.member` + `+` reveal | Single-card variant | new card on `profile.html` | replaces existing profile photo block |
| C13 | `.contact` + gradient `<a>` mail + `.offices` | Email link with `linear-gradient` text fill, location block | new `<section id="contact">` | replaces footer email |
| C14 | "Follow us" socials with ↗ + `.btn-to-top` | Footer socials with diagonal arrows + circular scroll-to-top | rebuild `<footer id="footer">` + `#copyright` | replaces both |
| C15 | `.cookie-banner` | n/a | **skip** | n/a |
| C16 | `.dot-cursor` | Optional flourish, desktop-only | P2 enhancement | additive |
| C17 | `.languages` (en/vn/zh) | n/a | **skip** | n/a |
| C18 | Project detail chrome | Dark hero, oversized title, full-bleed media, body grid | refactor `DeliveryRouteOptimisation.html`, `ChaptiveAI.html` | retrofits existing project pages |

**Buttons being retrofitted** (current → target):
- `.button.icon.solid.solo.fa-arrow-down.scrolly` (Continue) → C6 round `↓` button.
- `.button.large` (Demo / Blog) → C9 pill button with gradient hover.
- `.icon.brands.fa-linkedin / .fa-github` → C14 text-link socials with `↗` glyph.
- `<a href="#">jinghui.me@gmail.com</a>` (current footer email — broken `#` href) → C13 gradient `mailto:` link.
- Profile page lacks the sticky header — add C2/C3 consistently across all 4 HTML files.

## 3. Sprint plan

Each sprint = 1 PR off `main` via the `git-flow` skill (`feature/<sprint>-<slug>`). Each F-numbered feature inside a sprint is a single commit (or sub-branch when scope warrants). The `visual-reviewer` agent runs at the end of every sprint against the matching `image_0X.png`.

### Sprint 0 — Repo prep & foundation (1 day)
- **F0.1** Move `NEW_WEBSITE.HTML` → `reference/new-website.html`; `image_0*.png` → `reference/screens/` (out of GitHub Pages serving root).
- **F0.2** Land `prd.md` and append redesign rules to `.claude/rules.md`.
- **F0.3** Add `scripts/serve.sh` (`python3 -m http.server 8000`) and `scripts/check-links.sh` (curl every internal `href`, report non-200).
- **F0.4** Create `assets/css/site.css` (loaded *after* `main.css`) and `assets/js/site.js` — empty scaffolds + wired into all 4 HTML pages. Massively still drives layout.
- **DoD**: site renders identically; no console errors; reference assets relocated.

### Sprint 1 — Design system + global chrome (2 days)
- **F1.1** Design tokens in `site.css`: palette (`#000` / `#fff` / `#8a8a8a`, accent gradient), type scale (clamp), spacing, motion durations. Roobert/Raleway w/ Inter/Manrope fallback.
- **F1.2** Global `<header class="site-header">` (C2) on all 4 pages.
- **F1.3** Fullscreen overlay nav (C3) with focus-trap + Esc-close.
- **F1.4** Reveal utility (C1): `IntersectionObserver` adds `.is-inview` to `[data-reveal]`; `prefers-reduced-motion` short-circuits.
- **DoD**: visual-reviewer ✓ vs. `image_01.png` header + `image_10.png` scroll-to-top affordance; cross-page header parity.

### Sprint 2 — Hero (2 days)
- **F2.1** Hero structure (C4): full-viewport `<section id="hero">`, headline, sub-line, scroll cue.
- **F2.2** Animated gradient orb (C4): pure CSS radial gradient + blur + `@keyframes` translate/scale; static fallback for reduced-motion.
- **F2.3** Rotating circular badge (C5): inline SVG `<textPath>` "DATA · SCIENTIST · ML · AI ·"; CSS `animation: rotate 20s linear infinite`.
- **F2.4** Scroll-down round button (C6).
- **DoD**: visual-reviewer ✓ vs. `image_01.png` at 375 / 768 / 1440 px.

### Sprint 3 — Selected projects + tooling (2 days)
- **F3.1** Section header (C7).
- **F3.2** Project card component (C8) — rebuild featured-post markup; preserves `gif/` assets.
- **F3.3** Pill button (C9) — restyles Demo / Blog.
- **F3.4** Tooling strip (C10) — comma-separated tool list + "More on GitHub" pill.
- **DoD**: visual-reviewer ✓ vs. `image_02.png` / `image_03.png` / `image_04.png`.

### Sprint 4 — Manifesto + profile (2 days)
- **F4.1** Manifesto teaser on home (C11).
- **F4.2** Full manifesto on `profile.html` (C11) — Build / Ship / Learn with `↳ /LABEL`, body, SVG line draw on scroll.
- **F4.3** Profile/team card (C12) — single-person card replacing existing profile photo block.
- **DoD**: visual-reviewer ✓ vs. `image_05.png` / `image_06.png` / `image_07.png` / `image_08.png`.

### Sprint 5 — Contact + footer (1 day)
- **F5.1** Contact section (C13) — gradient `mailto:` link, location, socials.
- **F5.2** Footer (C14) — Follow us + ↗ glyphs + circular scroll-to-top.
- **DoD**: visual-reviewer ✓ vs. `image_09.png` / `image_10.png`.

### Sprint 6 — Project pages (2 days)
- **F6.1** `DeliveryRouteOptimisation.html` retrofit (C18).
- **F6.2** `ChaptiveAI.html` retrofit (C18).
- **F6.3** Page transitions (fade-out → fade-in, vanilla JS), feature-flagged.
- **DoD**: project pages match the project-detail grammar implied by `image_02.png` / `image_03.png`.

### Sprint 7 — Polish & launch (1 day)
- **F7.1** Lighthouse pass (mobile): perf ≥ 90, a11y ≥ 95, best-practices ≥ 95.
- **F7.2** Reduced-motion + keyboard a11y final sweep.
- **F7.3** Remove Massively dead CSS / jQuery (only after every page is migrated).
- **F7.4** Update `CLAUDE.md` to reflect new conventions.
- **DoD**: GitHub Pages preview at custom domain matches all 10 screenshots; no Massively classes referenced.

## 4. Iterative testing

- **Local loop**: `scripts/serve.sh` → `http://localhost:8000`. Hard-refresh between edits.
- **Per-feature**: `visual-reviewer` agent → diff vs. screenshot, console-error check, 375 / 768 / 1440 widths, keyboard nav, reduced-motion.
- **Per-sprint**: `scripts/check-links.sh` link audit + cross-page header/footer parity check.
- **Pre-merge**: `simplify` skill, `review` skill, `security-review` skill.
- **Pre-launch (Sprint 7)**: Chrome Lighthouse, GitHub Pages branch preview before merging to `main`.

## 5. Files to create / modify

**Create**
- `prd.md` (this PRD)
- `reference/new-website.html`, `reference/screens/image_0[1-9].png`, `reference/screens/image_10.png`
- `scripts/serve.sh`, `scripts/check-links.sh`
- `assets/css/site.css`, `assets/js/site.js`
- `assets/img/badge.svg`, `assets/img/orb.svg` (or pure CSS)
- `.claude/agents/redesign-orchestrator.md`
- `.claude/agents/visual-reviewer.md`
- `.claude/agents/feature-dev-foundation.md`
- `.claude/agents/feature-dev-chrome.md`
- `.claude/agents/feature-dev-hero.md`
- `.claude/agents/feature-dev-projects.md`
- `.claude/agents/feature-dev-tooling.md`
- `.claude/agents/feature-dev-manifesto.md`
- `.claude/agents/feature-dev-profile.md`
- `.claude/agents/feature-dev-contact-footer.md`
- `.claude/agents/feature-dev-project-pages.md`
- `.claude/agents/feature-dev-polish.md`
- `.claude/skills/git-flow/SKILL.md`
- `.claude/skills/visual-diff/SKILL.md` (helper)

**Modify**
- `index.html`, `profile.html`, `DeliveryRouteOptimisation.html`, `ChaptiveAI.html`.
- `assets/css/main.css` — leave intact during migration; remove only in Sprint 7.
- `.claude/rules.md` — append redesign-phase rules.
- `CLAUDE.md` — refreshed in Sprint 7.

## 6. Agents to be created

All in `.claude/agents/<name>.md` with frontmatter `name`, `description`, `tools`, `model: sonnet`. Existing `site-auditor` is reused as-is.

### 6.1 `redesign-orchestrator` (NEW — orchestrator across all other agents)
Drives the PRD end-to-end. Reads `prd.md`, decides next sprint/feature, dispatches the right `feature-dev-*` agent, then `visual-reviewer`, then the `git-flow` skill. Tracks progress with TaskCreate/TaskUpdate. Tools: Read, Bash, Agent, Skill, Glob, Grep.

### 6.2 `visual-reviewer` (NEW — iterative HTML-vs-screenshot reviewer)
Read-only. For each feature, opens the rendered HTML (via `python3 -m http.server` or static read) and compares against `reference/screens/image_0X.png` + `reference/new-website.html`. Returns a punch-list with file:line references covering: layout, typography, spacing, color, motion, a11y, responsive widths. Tools: Read, Bash, Grep, Glob, WebFetch (no Edit/Write).

### 6.3 Per-feature dev agents (NEW)
Each is a focused implementer scoped to one component family. Tools: Read, Edit, Write, Bash, Grep, Glob.

| Agent | Owns features | Files allowed |
|---|---|---|
| `feature-dev-foundation` | F0.*, F1.1, F1.4 — repo prep, design tokens, motion utilities | `prd.md`, `reference/`, `scripts/`, `assets/css/site.css`, `assets/js/site.js` |
| `feature-dev-chrome` | F1.2, F1.3 — global header + overlay nav | all 4 HTML files (header/nav blocks only), `site.css`, `site.js` |
| `feature-dev-hero` | F2.1–F2.4 | `index.html` (#hero), `site.css`, `site.js`, `assets/img/badge.svg` |
| `feature-dev-projects` | F3.1–F3.3 | `index.html` (selected-projects section), `site.css` |
| `feature-dev-tooling` | F3.4 | `index.html` (tooling section), `site.css` |
| `feature-dev-manifesto` | F4.1, F4.2 | `index.html` (teaser), `profile.html` (full block), `site.css`, `site.js` |
| `feature-dev-profile` | F4.3 | `profile.html` (member card), `site.css` |
| `feature-dev-contact-footer` | F5.1, F5.2 | all 4 HTML files (footer/contact), `site.css` |
| `feature-dev-project-pages` | F6.1, F6.2, F6.3 | `DeliveryRouteOptimisation.html`, `ChaptiveAI.html`, `site.css`, `site.js` |
| `feature-dev-polish` | F7.1–F7.4 | repo-wide; allowed to delete Massively assets |

Each prompt template includes: scope, matching screenshot path(s), matching component IDs from §2, files allowed, explicit "do not touch" list (most importantly: do not edit `<header>` or `<footer>` outside `feature-dev-chrome` / `feature-dev-contact-footer`).

### 6.4 Existing agents reused
- `site-auditor` — invoked at start of Sprint 0 and Sprint 7.
- `Explore` (built-in) — cross-cutting code searches.
- `Plan` (built-in) — tricky sub-designs (orb math, focus trap).
- `general-purpose` (built-in) — fallback refactors.

## 7. Skills to be created

All in `.claude/skills/<name>/SKILL.md`.

### 7.1 `git-flow` (NEW — push-to-GitHub with branching policy)
Encapsulates branching workflow:
- **Branch types**: `feature/<sprint>-<slug>`, `hotfix/<slug>`, `release/<sprint-N>`, `chore/<slug>`.
- **Workflow**: from `main`, `git checkout -b feature/...` → atomic commits → `git push -u origin <branch>` → `gh pr create` with templated body linking PRD section + screenshot(s) + visual-reviewer report.
- **Pre-push checks**: `scripts/check-links.sh` clean, no `console.log`, no Massively-only classes touched outside scope, hooks not skipped.
- **Hotfix path**: branched from `main`, fast-tracked, squash-merge.
- **Release path**: tag `vYYYY.MM.DD` after Sprint 7.
- **Guardrails**: never force-push `main`, never `--no-verify`, never bypass signing.

### 7.2 `visual-diff` (NEW — helper)
Convenience skill for `visual-reviewer`: takes a screenshot path + URL, opens both, produces a side-by-side punch-list. v1 = manual checklist; v2 = headless screenshot via Playwright once user opts in.

### 7.3 Existing skills reused
- `cleanup` — Sprint 0 (relocate reference files), Sprint 7 (kill Massively).
- `simplify` — every sprint close.
- `review` — every PR.
- `security-review` — Sprint 7.
- `init` — Sprint 7 (`CLAUDE.md` refresh).
- `fewer-permission-prompts` — once early to reduce friction.

## 8. Rules to be added to `.claude/rules.md`

Append a `## Redesign phase` block:

1. **Branching**: never commit directly to `main`. Always go through the `git-flow` skill on `feature/`, `hotfix/`, or `chore/` branches.
2. **Component scope**: each `feature-dev-*` agent edits only the files listed in its prompt. Header/footer/nav are owned by `feature-dev-chrome` and `feature-dev-contact-footer` respectively.
3. **Massively quarantine**: don't delete `assets/css/main.css`, `assets/sass/`, or any Massively JS until Sprint 7. Use `assets/css/site.css` as an *override* layer.
4. **Cross-page parity**: any change to `<header>`, overlay nav, or `<footer>` must be applied to all 4 HTML pages in the same commit. `scripts/check-links.sh` must pass before merge.
5. **Reference assets**: `NEW_WEBSITE.HTML` and `image_0*.png` live under `reference/` only — never under the served root.
6. **Motion budget**: every animation respects `prefers-reduced-motion: reduce`. No autoplay video. No layout-thrash on scroll.
7. **External fonts**: prefer self-hosted `@font-face`. If Roobert is not licensed, fall back to Inter/Manrope and document in `site.css` header comment.
8. **External links**: keep `target="_blank" rel="noopener"` (existing rule, restated).
9. **PR template**: every PR body links (a) the PRD section, (b) the matching `image_0X.png`, (c) the visual-reviewer report.
10. **Visual-review gate**: no PR merges without a `visual-reviewer` pass attached.
11. **No build step (yet)**: do not introduce Vite/Astro/11ty/SCSS-watch without explicit user approval and a `CLAUDE.md` update.

## 9. Out of scope
CMS, headless data, SCSS pipeline, bundler, analytics, tracking, cookie banner, language switcher, custom-cursor (beyond optional P2), copying monopo's actual copy / imagery / paid fonts, server-side anything.

## 10. Verification (definition of done)
- All 4 pages render at 375 / 768 / 1440 widths and visually correspond to the grammar of `image_01`–`image_10`.
- Lighthouse mobile on `index.html`: perf ≥ 90, a11y ≥ 95, best-practices ≥ 95.
- Zero console errors; zero broken internal links; no jQuery in `index.html`.
- `reference/` contains `new-website.html` + 10 screenshots; site root no longer serves them.
- All redesign work merged to `main` via `git-flow` PRs; `main` tagged `vYYYY.MM.DD`.

## 11. Execution order on approval

When this plan is approved, execute in this order:

1. Copy this plan file to `prd.md` at the repo root.
2. Append §8 rules to `.claude/rules.md`.
3. Create the 12 agent files listed in §5 / §6.
4. Create the 2 skill files listed in §5 / §7.
5. Hand control to `redesign-orchestrator` to begin Sprint 0.
