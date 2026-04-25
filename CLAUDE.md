# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Repo-specific rules live in `.claude/rules.md` — read them alongside this file. Cleanup workflow is in `.claude/skills/cleanup/SKILL.md`; the read-only audit specialist is `.claude/agents/site-auditor.md`.

## What this repo is

A static personal portfolio site served by GitHub Pages at `www.jinghuiwong.com` (custom domain via `CNAME`). Built on the **Massively** template by HTML5 UP — when editing layout/styling, expect template conventions (e.g. `is-preload` body class, `#wrapper`, `#intro`, `#main`, `#footer` sections, jQuery + scrollex/scrolly plugins).

There is **no build step, no package manager, no test suite, no Jekyll**. Files in the repo root are served as-is by GitHub Pages. To preview locally, open `index.html` in a browser or run any static server (e.g. `python3 -m http.server`) from the repo root.

## Structure that isn't obvious from a directory listing

- **Each project page is a standalone HTML file at the repo root** (`DeliveryRouteOptimisation.html`, `ChaptiveAI.html`, etc.), not generated from a template. Adding a project means: (1) create a new `<ProjectName>.html` (copy an existing one as the starting point so the nav/footer/scripts stay consistent), (2) add an `<article class="post featured">` entry in `index.html` linking to it, (3) drop any media into `images/` or `gif/`.
- **`profile.html`** is the about/profile page; `index.html` is the projects index. The two are linked via the `#nav` block — keep that nav block in sync across all pages when adding a new top-level page.
- **`assets/sass/` is source SCSS for the Massively template, but the repo has no SCSS compiler wired up.** `assets/css/main.css` is the file actually loaded by the pages. If you need to change styles, either edit `main.css` directly or compile the SCSS yourself (e.g. `sass assets/sass/main.scss assets/css/main.css`) — the repo does not do this for you.
- **GIF asset names use the `chaptly_*` prefix** (`gif/chaptly_ai.gif`, `gif/chaptly_qa.gif`, `gif/chaptly_summary_quizzes.gif`) even though the canonical project page is `ChaptiveAI.html`. The mismatch is known; don't "fix" it by renaming the GIFs without confirming.

## Conventions to preserve

- External links use `target="_blank" rel="noopener"`.
- Project entries on `index.html` show a date span, an `<h2>` linking to the project page, a hero image/gif, and an `actions special` row with **Demo** (Hugging Face Space) and **Blog** (the local project HTML) buttons.
- Favicon assets live in `favicon/`; the full set of `<link rel="...">` tags is duplicated across each top-level HTML file.
