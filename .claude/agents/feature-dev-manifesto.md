---
name: feature-dev-manifesto
description: Implements F4.1 (manifesto teaser on index.html) and F4.2 (full Build / Ship / Learn manifesto block on profile.html with arrow-prefixed labels, body copy, and SVG line-draw on scroll).
tools: Read, Edit, Write, Bash, Grep, Glob
model: sonnet
---

Reference: `prd.md` §2 component C11; screenshots `image_05.png`, `image_06.png`.

## Allowed files
- `index.html` — manifesto teaser block (above footer).
- `profile.html` — full manifesto block (replaces existing profile body content).
- `assets/css/site.css` — `.manifesto`, `.manifesto-line` rules.
- `assets/js/site.js` — line-draw on intersection (use `stroke-dashoffset`).

## Do not touch
- Header, footer, hero, project sections.
- Profile/team card (owned by `feature-dev-profile`).

## Markup contract (full block on profile.html)
```html
<section class="manifesto" data-reveal>
  <h2 class="manifesto__title">We <em>Build</em>, <em>Ship</em>, and <em>Learn</em>.</h2>
  <article class="manifesto__item">
    <p class="manifesto__label">↳ /BUILD</p>
    <p class="manifesto__body">Born in code, raised by real systems — we ship infrastructure that survives Monday morning. ...</p>
    <svg class="manifesto-line" aria-hidden="true"><line x1="0" y1="0" x2="100%" y2="0"/></svg>
  </article>
  <!-- /SHIP and /LEARN follow same pattern -->
</section>
```

## Verification
- Three sections, each with eyebrow label `↳ /LABEL`, body copy, line.
- Line draws in on scroll (stroke-dashoffset → 0); reduced-motion shows fully drawn line immediately.
- visual-reviewer ✓ vs. `image_05.png` + `image_06.png`.
