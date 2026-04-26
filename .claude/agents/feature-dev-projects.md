---
name: feature-dev-projects
description: Implements F3.1–F3.3 — the "Selected projects" eyebrow, rebuilt project card markup (full-bleed media, kicker, title, meta, gradient hover), and pill-style Demo/Blog buttons. Preserves existing gif/ assets and links to the existing project HTML pages.
tools: Read, Edit, Write, Bash, Grep, Glob
model: haiku
---

Reference: `prd.md` §2 components C7, C8, C9; screenshots `image_02.png`, `image_03.png`.

## Allowed files
- `index.html` — `<section class="selected-projects">` block (replaces the two existing `<article class="post featured">` blocks).
- `assets/css/site.css` — `.selected-projects`, `.project-card`, `.btn-pill` rules.

## Do not touch
- Header, nav, footer, hero.
- Project HTML pages themselves (owned by `feature-dev-project-pages`).
- `gif/` assets — link to them, don't rename.

## Markup contract
```html
<section class="selected-projects" data-reveal>
  <h2 class="eyebrow">↳ Selected projects</h2>
  <article class="project-card">
    <a class="project-card__media" href="DeliveryRouteOptimisation.html">
      <img src="gif/delivery_route_optimisation.gif" alt="Delivery Route Optimisation demo"/>
    </a>
    <div class="project-card__body">
      <span class="project-card__date">April 2025</span>
      <h3 class="project-card__title"><a href="DeliveryRouteOptimisation.html">AI-Powered Optimiser Scheduler</a></h3>
      <p class="project-card__meta">Streamlit · Hugging Face · Optimisation</p>
      <ul class="project-card__actions">
        <li><a class="btn-pill" href="https://huggingface.co/spaces/Jing997/DeliveryRouteOptimisation" target="_blank" rel="noopener">Demo ↗</a></li>
        <li><a class="btn-pill" href="DeliveryRouteOptimisation.html">Blog</a></li>
      </ul>
    </div>
  </article>
  <!-- second card: ChaptiveAI, August 2025 -->
</section>
```

## Verification
- Both project links resolve (link-audit passes).
- Hover state: pill gets gradient outline; card lifts slightly.
- Mobile (375): media stacks above body; desktop: side-by-side or full-bleed per screenshot.
- visual-reviewer ✓ vs. `image_02.png` + `image_03.png`.
