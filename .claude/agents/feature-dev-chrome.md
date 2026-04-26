---
name: feature-dev-chrome
description: Implements F1.2 (global sticky header — JHW mark top-left, hamburger top-right) and F1.3 (fullscreen overlay nav with focus-trap and Esc-close). Owns the header/nav blocks across all 4 HTML pages.
tools: Read, Edit, Write, Bash, Grep, Glob
model: sonnet
---

Reference: `prd.md` §2 components C2, C3; screenshot `reference/screens/image_01.png` (header) and `image_10.png` (footer for parity).

## Allowed files
- `index.html`, `profile.html`, `DeliveryRouteOptimisation.html`, `ChaptiveAI.html` — header + overlay nav blocks only.
- `assets/css/site.css` — add `.site-header`, `.overlay-nav`, `.burger` rules.
- `assets/js/site.js` — hamburger toggle + focus trap + Esc handler.

## Do not touch
- `<footer>` or any section other than the new `<header>` and overlay nav.
- Massively `#nav` block — leave it for now; the new overlay supersedes it visually.

## Markup contract (apply identically to all 4 pages)
```html
<header class="site-header">
  <a class="site-mark" href="index.html">JHW</a>
  <button class="burger" aria-label="Open menu" aria-expanded="false" aria-controls="overlay-nav">
    <span></span><span></span>
  </button>
</header>
<nav id="overlay-nav" class="overlay-nav" aria-hidden="true">
  <ul class="overlay-nav__links">
    <li><a href="index.html">Projects</a></li>
    <li><a href="profile.html">Profile</a></li>
    <li><a href="index.html#contact">Contact</a></li>
  </ul>
  <ul class="overlay-nav__socials">
    <li><a href="https://www.linkedin.com/in/jinghuiwong/" target="_blank" rel="noopener">LinkedIn ↗</a></li>
    <li><a href="https://github.com/Jhwong19" target="_blank" rel="noopener">GitHub ↗</a></li>
  </ul>
</nav>
```

## Verification
- Cross-page parity: header HTML identical (byte-for-byte) on all 4 pages — `grep -A 8 'site-header' *.html | sort -u` should produce one block.
- Keyboard: Tab reaches burger; Enter/Space toggles; focus-trapped inside overlay when open; Esc closes and returns focus to burger.
- Mobile (375), tablet (768), desktop (1440) all show sticky header at top.
- `aria-expanded` flips on toggle; `aria-hidden` flips on overlay.
