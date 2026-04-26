---
name: visual-diff
description: Helper for visual-reviewer. Takes a reference screenshot path and a rendered URL, opens both, and produces a side-by-side punch-list across layout, type, color, motion, and a11y. Use during redesign feature reviews.
---

# visual-diff

Lightweight comparison helper. Used by the `visual-reviewer` agent and any human/agent doing a visual QA pass.

## Inputs
- `screenshot`: path under `reference/screens/image_0X.png`.
- `url`: rendered page (e.g. `http://localhost:8000/index.html`).
- `viewport`: optional, one of `375`, `768`, `1440`. Default: run all three.

## v1 — manual checklist (default)
1. Read the screenshot.
2. Open `url` in the local browser at the requested viewport (instruct the user via `open -a "Google Chrome --args --window-size=<W>,1024 <url>"`, or just `open <url>` and ask them to resize).
3. Read the rendered HTML and any referenced CSS rules under `assets/css/site.css`.
4. Compare across these axes (each with concrete examples):
   - **Layout**: section order, max-widths, alignment, gaps.
   - **Typography**: family, weight, size scale, line-height, letter-spacing, casing.
   - **Color**: bg, fg, accent gradient stops, hover states.
   - **Spacing**: vertical rhythm, section padding, breakpoints (375/768/1440).
   - **Motion**: reveal triggers, orb animation, line draw, badge rotation, reduced-motion fallback.
   - **A11y**: heading order, focus rings, contrast, keyboard, ARIA on interactive elements.
5. Output the punch-list format defined by the `visual-reviewer` agent.

## v2 — headless screenshots (opt-in)
Once the user opts in:
- Add `node_modules/playwright` (or use `npx playwright`).
- For each viewport, capture `out/<feature>-<viewport>.png` via Playwright `page.screenshot`.
- Use ImageMagick `compare` or a perceptual diff (pixelmatch) against the reference.
- Output the diff image path alongside the punch-list.

Do **not** install Playwright without explicit user approval — it adds a build dependency, which is currently disallowed by `.claude/rules.md`.

## Output
Always end with: `RESULT: PASS` or `RESULT: NEEDS_WORK (Nb / Mm / mm)` where `Nb`/`Mm`/`mm` count blockers/major/minor.
