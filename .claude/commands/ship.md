---
description: Pre-push checks + git-flow PR. Runs link audit, scans for console.log, confirms scope, then commits/pushes/opens PR via the git-flow skill.
---

You are running the `/ship` workflow for the current feature branch. Execute these steps in order. Stop on the first failure and surface the issue.

## 1. Sanity
- `git status` — confirm clean working tree or only the expected scope.
- `git branch --show-current` — must NOT be `main`. If it is, stop and tell the user to create a `feature/sprint-<N>-<slug>` branch.
- `git diff --name-only main...HEAD` — list of changed files.

## 2. Pre-push checks
- `bash scripts/check-links.sh` if it exists. Stop on non-zero exit.
- `grep -RIn 'console\.log' assets/js/site.js 2>/dev/null` — must be empty.
- Confirm the changed files match the scope of the relevant `feature-dev-*` agent (per `prd.md` §6.3). If files outside scope are touched, ask the user before proceeding.

## 3. Identify PRD context
- Read `prd.md` and identify the F-numbered feature these changes implement.
- Identify the matching `reference/screens/image_0X.png`.
- Look for any `visual-reviewer` output already in this conversation; if absent, ask the user whether to dispatch `visual-reviewer` first.

## 4. Ship via git-flow
Invoke the `git-flow` skill. Provide it the branch name, the PRD section reference, the screenshot path(s), and the visual-reviewer verdict. The skill handles commit, push, and `gh pr create`.

## 5. Output
Print the PR URL on success. On failure, print the failing step and exit.

## Hard rules
- Never commit to `main`.
- Never force-push `main`.
- Never `--no-verify`.
- If a hook blocks the commit, fix the underlying issue and create a NEW commit — do not amend.
