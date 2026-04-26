# PRD v2 — monopo.vn-inspired refresh

## Why v2

The original 8-sprint redesign (v1, PRs #2–#14, all merged) shipped a dark monopo-inspired portfolio but matched the source only loosely. The hero is a CSS radial-gradient orb; the chrome is a burger + fullscreen overlay; the headline is static. Reviewing against [monopo.vn](https://monopo.vn/) end-to-end revealed five concrete gaps:

1. No cursor-driven refractive lens (monopo's signature interaction).
2. No animated WebGL background (monopo uses a noise-driven sphere mesh shader).
3. No rotating hero headline (monopo cycles through phrases like `Hello Saigon → Tokyo-born, Creative Studio → United, Unbound`).
4. Burger overlay instead of inline top-right nav (monopo shows `work · manifesto · saigon souls · team · contact` inline on desktop).
5. The full BUILD/SHIP/LEARN manifesto only lives on `profile.html`; the homepage shows just a teaser pill. monopo features its manifesto prominently mid-scroll on the home page.

Plus polish items: the rotating SVG badge is too large and the type scale doesn't push to monopo's display sizes.

The outcome is a static portfolio visually nearly indistinguishable from monopo.vn's hero, with all reproductions self-hosted (no CDN), gracefully degrading to the existing CSS orb on browsers that fail WebGL.

## Architecture decisions

- **Three.js** pinned at **r163**, self-hosted at `assets/js/vendor/three.module.js` (~620 KB raw / ~150 KB gz). Loaded via a native `<script type="importmap">` in `index.html` only — profile and project pages stay lean.
- A single `<canvas id="hero-canvas">` mounted inside `<section id="hero">`, absolutely positioned (canvas z-index 0, hero text 2, badge 3).
- The lens is **not** a flat plane RT distortion — it's a `SphereGeometry(0.4)` with a Fresnel/refraction shader sampling a `CubeCamera(256)` that re-renders the background sphere each frame (faithful to monopo).
- Background is `SphereGeometry(1.5, 32, 32)` with a noise/color-field fragment shader (port of CMOISDEAD `Background.tsx` + `fragment.ts`).
- `prefers-reduced-motion: reduce` → render exactly one frame, then `cancelAnimationFrame`. Freeze.
- `IntersectionObserver` pauses the RAF loop when hero scrolls out (ratio < 0.05). `pixelRatio` capped at `min(devicePixelRatio, 1.75)`.
- WebGL fallback: `try { … } catch`. On failure, leave `.hero__orb` visible. Add `.hero--canvas-on` class only after first successful render.
- Inline nav cutoff: ≥768px shows inline links (`Projects · Profile · Contact`); <768px keeps the burger + overlay-nav unchanged.

## Sprint sequencing — 4 PRs

Each sprint is independently shippable. Three.js work is isolated to v2.3 so it can be reverted cleanly.

### Sprint v2.1 — Chrome refresh + type scale
CSS + HTML only. Inline nav `<ul class="site-header__links">` on all 4 pages, `display: flex` ≥768px, `display: none` <768px; `.burger` hidden ≥768px. Restyle `.hero__badge` to ~96px / 30s rotation / tighter letter-spacing. Bump tokens: `--fs-display: clamp(3.5rem, 9vw, 8rem)`, add `--fs-mega: clamp(5rem, 14vw, 12rem)` and apply to `.hero__title`. Tighten `line-height: 0.92`, `letter-spacing: -0.04em`.

### Sprint v2.2 — Hero text rotation + manifesto on home
New IIFE in `site.js` rotates `.hero__title` through `["Hello", "Jing Hui Wong", "Building with AI", "Data Scientist"]` every 2500ms with opacity transition. Reduced-motion: render last string only. Pause when `document.hidden`. Replace `<section class="manifesto-teaser">` on `index.html` with a full `<section class="manifesto">` cloned from `profile.html` — existing `.manifesto` styles and `.manifesto-line` IntersectionObserver IIFE handle it without further JS changes.

### Sprint v2.3 — WebGL hero (the risk sprint)
New files under `assets/js/`: `vendor/three.module.js` (r163), `hero/index.js` (~180 LOC bootstrap), `hero/background.js` (~120 LOC + GLSL strings), `hero/lens.js` (~140 LOC + GLSL strings), `hero/pointer.js` (~50 LOC mouse → lens lerp). Add `<script type="importmap">` and `<canvas id="hero-canvas">` to `index.html`. Add CSS: `#hero-canvas { position: absolute; inset: 0; z-index: 0; }`, `.hero--canvas-on .hero__orb { display: none; }`. Source to port from CMOISDEAD/monopo.vn (`App.tsx`, `Background.tsx`, `Lens.tsx`, `vertex.ts`, `fragment.ts`, `vertex1.ts`, `fragment1.ts`).

### Sprint v2.4 — Polish pass
Re-tune shader uniforms after side-by-side with monopo.vn. Optional Inter Tight swap (~60 KB) for tighter type. Visual diff. Lighthouse: perf ≥85, a11y ≥95.

## Defaults chosen for open questions

1. Rotation order: `Hello → Jing Hui Wong → Building with AI → Data Scientist` (per user).
2. Font: keep Inter only.
3. Refraction: sphere-in-sphere CubeCamera (faithful to monopo).
4. Background: sphere-noise via fragment shader (faithful to monopo).
5. Manifesto: clone full block to index.html (two copies; future edits touch both files).

## Risks

- **Importmap** support: Safari ≥16.4. Acceptable for 2026 audience.
- **GLSL inlining**: must paste shader strings exactly; missing `#extension GL_OES_standard_derivatives` directive at top of fragment breaks Safari rendering.
- **Bundle weight**: +160 KB gz on `index.html` only.
- **GPU pressure**: CubeCamera re-renders the background sphere from 6 faces at 256² per frame. `IntersectionObserver` pause when scrolled past hero contains the cost.
- **Manifesto sync drift**: once duplicated, copy edits need both files. No automated guard.
