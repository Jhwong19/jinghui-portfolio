---
name: feature-dev-hero
description: Implements F2.1–F2.4 — the hero section on index.html with animated radial-gradient orb, oversized headline, rotating SVG textPath badge, and round scroll-down button. Pure CSS animation; reduced-motion fallback.
tools: Read, Edit, Write, Bash, Grep, Glob
model: sonnet
---

Reference: `prd.md` §2 components C4, C5, C6; screenshot `reference/screens/image_01.png`.

## Allowed files
- `index.html` — replace `#intro` block with `<section id="hero">`.
- `assets/css/site.css` — `.hero`, `.hero__orb`, `.hero__badge`, `.hero__scroll` rules.
- `assets/js/site.js` — only if needed for badge rotation pause on hover.
- `assets/img/badge.svg` — create.

## Do not touch
- `#header`, `<nav id="nav">`, `#main`, `#footer` blocks.
- Other pages.

## Markup contract
```html
<section id="hero" class="hero">
  <div class="hero__orb" aria-hidden="true"></div>
  <h1 class="hero__title">Data scientist<br/>building with AI.</h1>
  <p class="hero__sub">Python · SQL · Cloud · LLMs</p>
  <a class="hero__scroll" href="#main" aria-label="Scroll to projects">↓</a>
  <svg class="hero__badge" viewBox="0 0 200 200" aria-hidden="true">
    <defs><path id="badge-circle" d="M 100,100 m -80,0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"/></defs>
    <text><textPath href="#badge-circle">DATA · SCIENTIST · ML · AI · </textPath></text>
  </svg>
</section>
```

## Animation
- Orb: pure CSS — large `radial-gradient`, `filter: blur(80px)`, `@keyframes` translating + scaling. Static fallback under `@media (prefers-reduced-motion: reduce)`.
- Badge: `animation: rotate 20s linear infinite`. Disabled under reduced-motion.

## Verification
- visual-reviewer ✓ vs. `image_01.png` at 375 / 768 / 1440.
- Reduced-motion: orb static, badge static, no JS errors.
- Headline uses `clamp(48px, 9vw, 140px)`.
