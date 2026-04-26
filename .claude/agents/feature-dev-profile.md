---
name: feature-dev-profile
description: Implements F4.3 — single-person team-style card on profile.html (portrait, name, role, "+" reveal that expands the bio). Replaces the existing profile photo block.
tools: Read, Edit, Write, Bash, Grep, Glob
model: haiku
---

Reference: `prd.md` §2 component C12; screenshots `image_07.png`, `image_08.png`.

## Allowed files
- `profile.html` — `<section class="member">` block.
- `assets/css/site.css` — `.member`, `.member__expand` rules.
- `assets/js/site.js` — `+` button toggle.

## Do not touch
- Manifesto block (owned by `feature-dev-manifesto`).
- Header / footer.

## Markup contract
```html
<section class="member-intro" data-reveal>
  <p class="eyebrow">↳ Profile</p>
  <h2>From Singapore,<br/>building with AI.</h2>
</section>
<section class="member" data-reveal>
  <figure class="member__portrait">
    <img src="images/profile.jpg" alt="Jing Hui Wong"/>
  </figure>
  <div class="member__meta">
    <p class="member__role">Data Scientist · Singapore</p>
    <h3 class="member__name">Jing Hui<br/>Wong</h3>
    <button class="member__expand" aria-expanded="false" aria-controls="member-bio">+</button>
  </div>
  <div id="member-bio" class="member__bio" hidden>
    <p>...bio paragraph...</p>
  </div>
</section>
```

## Verification
- `+` toggles `aria-expanded` and unhides `#member-bio` (rotates to `×` when open).
- Keyboard: Tab to button, Enter/Space toggles.
- visual-reviewer ✓ vs. `image_07.png` + `image_08.png`.
