---
name: feature-dev-tooling
description: Implements F3.4 — the "Tooling" strip adapted from monopo's "They trust us" wordmark list. Centered comma-separated tool names + "More on GitHub" pill CTA.
tools: Read, Edit, Write, Bash, Grep, Glob
model: haiku
---

Reference: `prd.md` §2 component C10; screenshot `image_04.png`.

## Allowed files
- `index.html` — `<section class="tooling">` block (added below selected-projects).
- `assets/css/site.css` — `.tooling` rules.

## Do not touch
- Anything else.

## Markup contract
```html
<section class="tooling" data-reveal>
  <p class="tooling__eyebrow">Built with</p>
  <p class="tooling__list">
    Python, SQL, GCP, AWS, Hugging Face,<br/>
    Streamlit, LangChain, FastAPI,<br/>
    PyTorch, scikit-learn, pandas.
  </p>
  <a class="btn-pill btn-pill--gradient" href="https://github.com/Jhwong19" target="_blank" rel="noopener">More on GitHub ↗</a>
</section>
```

## Verification
- Centered text matches screenshot proportions.
- Gradient pill on the CTA (green→amber→orange).
- visual-reviewer ✓ vs. `image_04.png`.
