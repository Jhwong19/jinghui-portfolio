# Project rules

Rules specific to this static portfolio repo. Read alongside `CLAUDE.md`.

## Cleanup phase

- Default to **identify → propose → confirm → delete**. Never bulk-delete without showing the plan first.
- Don't delete from `assets/webfonts/`, `assets/sass/`, or `favicon/` without explicit instruction even when something looks unreferenced — they're part of the Massively template baseline and may be loaded via `@font-face` rules in `main.css` rather than direct HTML references.
- Use `git rm` for tracked deletions so they're staged. Don't commit on the user's behalf.

## Redesign phase (future)

- Keep changes additive until the new design is functional. Don't remove existing pages until their replacements actually work in a browser.
- The site has no build step today. If a redesign introduces one (Jekyll, Astro, Vite, 11ty, etc.), confirm with the user before adding tooling, and update `CLAUDE.md` to reflect the new workflow.
- Hosting is GitHub Pages from the repo root with custom domain via `CNAME`. Any new build setup must preserve that, or the user must explicitly opt into a different hosting model.

## Always

- External links use `target="_blank" rel="noopener"` — preserve this when editing nav/social links.
- The `#nav` block is duplicated across `index.html`, `profile.html`, and each project page. Sync changes across all of them, or factor them out as part of an explicit refactor.
