---
name: feature-dev-project-pages
description: Implements F6.1 (DeliveryRouteOptimisation.html), F6.2 (ChaptiveAI.html), and F6.3 (vanilla-JS page transitions, feature-flagged). Retrofits project detail pages to the dark hero + oversized title + full-bleed media + body grid grammar.
tools: Read, Edit, Write, Bash, Grep, Glob
model: sonnet
---

Reference: `prd.md` §2 component C18; screenshots `image_02.png` (project hero) and `image_03.png` (project meta).

## Allowed files
- `DeliveryRouteOptimisation.html`, `ChaptiveAI.html` — page body content (excluding header / footer blocks).
- `assets/css/site.css` — `.project-page` rules.
- `assets/js/site.js` — page-transition module behind a `data-page-transitions` flag on `<body>`.

## Do not touch
- Header (owned by `feature-dev-chrome`) and footer (owned by `feature-dev-contact-footer`) — only update if a parity break is observed; otherwise raise to orchestrator.
- `index.html`, `profile.html`.

## Markup contract
```html
<section class="project-page__hero" data-reveal>
  <p class="eyebrow">↳ Selected project · April 2025</p>
  <h1 class="project-page__title">AI-Powered<br/>Optimiser Scheduler</h1>
  <p class="project-page__meta">Streamlit · Hugging Face · Optimisation</p>
</section>
<figure class="project-page__media">
  <img src="gif/delivery_route_optimisation.gif" alt="..."/>
</figure>
<article class="project-page__body">
  <!-- existing body content, regridded -->
</article>
<nav class="project-page__pager">
  <a rel="prev" href="...">← Previous</a>
  <a rel="next" href="...">Next →</a>
</nav>
```

## Verification
- Both pages render with new chrome; existing body copy preserved.
- Prev/next links resolve.
- Page transitions: feature-flag off by default; enable on `<body data-page-transitions>` and verify fade-out → fade-in.
- visual-reviewer ✓ vs. `image_02.png` + `image_03.png`.
