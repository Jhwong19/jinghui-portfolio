---
name: git-flow
description: Push code to GitHub on the right kind of branch (feature/, hotfix/, chore/, release/) and open a PR linked to the PRD. Use when finishing a feature in the redesign, landing a hotfix on main, or cutting a release tag. Enforces no-direct-to-main, no force-push to main, and never --no-verify.
---

# git-flow

End-to-end git workflow for the portfolio redesign. Encapsulates branch naming, pre-push checks, PR templating, and release tagging.

## When to use
- Finishing a feature from `prd.md` — use `feature/`.
- Urgent fix on `main` — use `hotfix/`.
- Maintenance / config / docs — use `chore/`.
- Cutting a release after Sprint 7 — use `release/` + tag.

Do **not** use for: experimentation (use a local branch and don't push), one-off `git status` checks (just run them).

## Branch types

| Kind | Pattern | Source | Merge target | Strategy |
|---|---|---|---|---|
| feature | `feature/sprint-<N>-<slug>` | `main` | `main` | squash |
| hotfix | `hotfix/<slug>` | `main` | `main` | squash |
| chore | `chore/<slug>` | `main` | `main` | squash |
| release | `release/sprint-<N>` | `main` | `main` | tag, no merge |

`<slug>` is kebab-case and ≤ 30 chars.

## Standard workflow (feature / chore)

1. **Verify clean tree**: `git status` — must be clean or only contain expected scope.
2. **Sync main**: `git fetch origin && git checkout main && git pull --ff-only`.
3. **Branch**: `git checkout -b feature/sprint-2-hero` (or chore/, etc).
4. **Implement** via the appropriate `feature-dev-*` agent. Commit in atomic chunks.
5. **Pre-push checks** (all must pass):
   - `bash scripts/check-links.sh` — no broken internal links.
   - `grep -RIn 'console\.log' assets/js/site.js` — must be empty.
   - For redesign work: confirm only files inside the agent's allowed-files list were touched. `git diff --name-only main...HEAD` and compare.
6. **Commit message**: include trailer.
   ```
   <type>: <one-line summary>

   <body — what changed and why, in 1–3 lines>

   PRD: §<section>
   Screenshot: reference/screens/image_0X.png
   Visual-review: <PASS | NEEDS_WORK link>

   Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
   ```
7. **Push**: `git push -u origin <branch>`.
8. **PR**: `gh pr create --base main --title "<title>" --body "$(cat <<'EOF'
## Summary
- <bullet>

## PRD reference
- §<section>
- Screenshot(s): `reference/screens/image_0X.png`
- Component IDs: <C#>

## Visual-review report
<paste reviewer output or link>

## Test plan
- [ ] python3 -m http.server 8000 — render check
- [ ] scripts/check-links.sh
- [ ] Mobile 375 / Tablet 768 / Desktop 1440
- [ ] Reduced-motion sanity

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"`.
9. **Output the PR URL** to the user.

## Hotfix workflow
- Same as feature but `hotfix/<slug>`.
- Pre-push: confirm change is genuinely urgent (production-broken, link-broken, security). Otherwise use `chore/`.
- Squash-merge after one approval; do not wait for full sprint review.

## Release workflow (Sprint 7 only)
1. `git checkout main && git pull --ff-only`.
2. `git tag -a v$(date +%Y.%m.%d) -m "Redesign launch"`.
3. `git push origin --tags`.
4. Optional: `gh release create vYYYY.MM.DD --notes-file release-notes.md`.

## Hard rules
- **Never** `git push --force` or `git push -f` against `main`. Force-push only the current feature branch and only if you wrote those commits.
- **Never** `--no-verify`, `--no-gpg-sign`, or `-c commit.gpgsign=false` unless the user explicitly requests it.
- **Never** commit directly to `main`.
- **Never** delete `main` or rename it.
- If a pre-commit hook fails, fix the underlying issue and create a NEW commit. Do not amend a published commit.
- If the user has uncommitted unrelated changes, stop and ask — do not stash silently.

## Safety prompts
Before destructive operations (`git reset --hard`, `git clean -fd`, `git branch -D`, force-push), echo the command and ask the user to confirm.
