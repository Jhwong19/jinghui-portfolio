---
description: Reports current branch, sprint progress from prd.md, next unfinished feature, and which feature-dev-* agent owns it.
---

You are running `/sprint-status`. Produce a concise status report. Be terse — this is a status command, not a planning session.

## Steps
1. `git branch --show-current` and `git status -s` — current branch, dirty/clean.
2. Read `prd.md` §3 (sprint plan).
3. Scan for completion markers (checked items, recent commits referencing F-numbers, recently-merged PRs via `gh pr list --state merged --limit 10` if `gh` is available).
4. Identify:
   - Current sprint (highest sprint with any work landed; else Sprint 0).
   - Next unfinished F-numbered feature in that sprint.
   - The `feature-dev-*` agent that owns it (per `prd.md` §6.3 table).
   - The matching `reference/screens/image_0X.png`.

## Output format
One screen, no fluff:

```
Branch:       <name>  (<clean|N files>)
Sprint:       <N> — <sprint title>
Done:         F<N>.1 ✓  F<N>.2 ✓
In progress:  F<N>.3
Next:         F<N>.4 — <feature title>
Owner:        feature-dev-<area>
Screenshot:   reference/screens/image_0X.png
Component:    C<#>

Run /next-feature to dispatch the orchestrator, or invoke feature-dev-<area> directly.
```

## Constraints
- Read-only. Do not edit any files.
- If `prd.md` is missing or unparseable, say so and stop.
