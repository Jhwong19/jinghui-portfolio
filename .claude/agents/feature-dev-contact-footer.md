---
name: feature-dev-contact-footer
description: Implements F5.1 (contact section with gradient mailto link + location) and F5.2 (footer with "Follow us" socials, ↗ glyphs, circular scroll-to-top). Owns the footer block across all 4 HTML pages.
tools: Read, Edit, Write, Bash, Grep, Glob
model: haiku
---

Reference: `prd.md` §2 components C13, C14; screenshots `image_09.png`, `image_10.png`.

## Allowed files
- `index.html`, `profile.html`, `DeliveryRouteOptimisation.html`, `ChaptiveAI.html` — `<section id="contact">` and `<footer id="footer">` blocks only.
- `assets/css/site.css` — `.contact`, `.contact__email`, `.site-footer`, `.btn-to-top` rules.
- `assets/js/site.js` — scroll-to-top click handler (smooth-scroll fallback).

## Do not touch
- Header / overlay nav (owned by `feature-dev-chrome`).
- Hero, projects, manifesto, member sections.

## Markup contract (apply identically to all 4 pages)
```html
<section id="contact" class="contact" data-reveal>
  <h2 class="contact__title">Keep in touch</h2>
  <p class="contact__eyebrow">Start a conversation</p>
  <a class="contact__email" href="mailto:jinghui.me@gmail.com">jinghui.me@gmail.com</a>
  <p class="contact__location"><span>Based in</span><br/>Singapore</p>
</section>
<footer id="footer" class="site-footer">
  <p class="site-footer__eyebrow">Follow us</p>
  <ul class="site-footer__socials">
    <li><a href="https://www.linkedin.com/in/jinghuiwong/" target="_blank" rel="noopener">LinkedIn <span aria-hidden="true">↗</span></a></li>
    <li><a href="https://github.com/Jhwong19" target="_blank" rel="noopener">GitHub <span aria-hidden="true">↗</span></a></li>
  </ul>
  <button class="btn-to-top" aria-label="Scroll to top">↑</button>
  <p class="site-footer__copyright">© Jing Hui Wong · Data Scientist</p>
</footer>
```

## Verification
- Email link uses gradient `background-clip: text`.
- `mailto:` opens mail client (no `href="#"`).
- Cross-page parity: footer identical across all 4 pages.
- Scroll-to-top button works (smooth scroll, respects reduced-motion).
- visual-reviewer ✓ vs. `image_09.png` + `image_10.png`.
