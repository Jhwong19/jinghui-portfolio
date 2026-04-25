---
name: cleanup
description: Walk through identifying and removing unnecessary files from the portfolio repo. Audits the site, presents a categorized removal plan, and applies deletions only after explicit confirmation. Use when the user wants to shrink the repo before a redesign or just clean up cruft.
---

# Cleanup workflow

Goal: shrink the repo to only files that are actually served or load-bearing, in preparation for a later redesign. The user drives the decisions; this skill is the choreography.

## Steps

1. **Audit.** Delegate to the `site-auditor` agent to produce a punch-list of unreferenced files, duplicates, and dead links. Don't duplicate its grep work in the main thread.
2. **Categorize** the findings into three buckets, in this order:
   - **Safe to delete** — unreferenced, no template role, no ambiguity.
   - **Duplicates** — note which copy is referenced by live pages and recommend keeping that one.
   - **Needs decision** — template assets, anything ambiguous, anything the auditor couldn't verify.
3. **Confirm.** Present the categorized plan to the user. List paths, not summaries — the user needs to see what's about to disappear. Do not assume blanket approval; wait for explicit go-ahead, ideally per category.
4. **Apply.** Only after confirmation, run deletions with `git rm` so they're staged (or plain `rm` for untracked files).
5. **Verify.** After deletion, re-run a quick reference check (grep the deleted basenames across remaining HTML/CSS) to confirm no dead links were introduced. Surface anything that pops up.
6. **Stop.** Do not commit. Leave the staged deletions for the user to review and commit themselves.

## Constraints

- Don't touch `assets/sass/`, `assets/webfonts/`, `favicon/`, `CNAME`, or `.git/` without explicit instruction, even if they look unreferenced.
- Before deleting one of a duplicated pair, update any references to point at the surviving copy first.
- If the audit surfaces nothing meaningful, say so plainly and stop. Don't manufacture cleanup work.

See also: `.claude/rules.md` for repo-specific guardrails.
