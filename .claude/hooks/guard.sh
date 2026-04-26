#!/usr/bin/env bash
# PreToolUse hook for Bash. Blocks:
#   1. git commit / push directly to main (or with --no-verify, force-push to main)
#   2. build-tool invocations (npm, yarn, pnpm, vite, astro, jekyll, sass --watch, webpack, esbuild)
# Exit 2 = block + show stderr to Claude. Exit 0 = allow.

set -u

payload="$(cat)"
cmd="$(printf '%s' "$payload" | python3 -c 'import sys, json; d = json.load(sys.stdin); print(d.get("tool_input", {}).get("command", ""))')"

[ -z "$cmd" ] && exit 0

block() {
  printf 'BLOCKED by .claude/hooks/guard.sh: %s\n' "$1" >&2
  printf 'Command: %s\n' "$cmd" >&2
  printf 'See .claude/rules.md (workflow + technical defaults).\n' >&2
  exit 2
}

# --- Branching guardrails ----------------------------------------------------

current_branch="$(git -C "${CLAUDE_PROJECT_DIR:-.}" branch --show-current 2>/dev/null || echo "")"

# Reject any --no-verify, --no-gpg-sign in commit/push
if printf '%s' "$cmd" | grep -Eq '\bgit\b.*\b(commit|push|merge|rebase)\b.*--no-verify'; then
  block "--no-verify is not allowed (rules: workflow #5)."
fi
if printf '%s' "$cmd" | grep -Eq '\bgit\b.*--no-gpg-sign'; then
  block "--no-gpg-sign is not allowed (rules: workflow #5)."
fi

# Reject commits/pushes while on main
if [ "$current_branch" = "main" ]; then
  if printf '%s' "$cmd" | grep -Eq '\bgit\s+commit\b'; then
    block "git commit on main is not allowed. Create a feature/, hotfix/, or chore/ branch via the git-flow skill."
  fi
  if printf '%s' "$cmd" | grep -Eq '\bgit\s+push\b'; then
    block "git push from main is not allowed. Push the current feature branch instead."
  fi
fi

# Reject force-push to main from any branch
if printf '%s' "$cmd" | grep -Eq '\bgit\s+push\b.*(--force\b|--force-with-lease\b|\s-f\b).*\bmain\b'; then
  block "force-push to main is not allowed."
fi
if printf '%s' "$cmd" | grep -Eq '\bgit\s+push\b.*\bmain\b.*(--force\b|--force-with-lease\b|\s-f\b)'; then
  block "force-push to main is not allowed."
fi

# --- Build-tool guardrails ---------------------------------------------------
# Allow informational subcommands (--version, --help) for diagnosis.
is_info_only() {
  printf '%s' "$1" | grep -Eq '(^|\s)(--version|-v\b|--help|-h\b)'
}

for tool in npm yarn pnpm npx vite astro jekyll webpack esbuild rollup parcel turbo bun deno; do
  if printf '%s' "$cmd" | grep -Eq "(^|[\s;|&\`(])${tool}\b"; then
    if ! is_info_only "$cmd"; then
      block "Build tool '${tool}' is disallowed (rules: technical defaults #2 — no build step)."
    fi
  fi
done

# sass --watch / sass <input> <output> imply a build pipeline
if printf '%s' "$cmd" | grep -Eq '(^|[\s;|&`(])sass\b' && \
   ! is_info_only "$cmd" && \
   ! printf '%s' "$cmd" | grep -Eq '\bsass\b\s+(--version|--help)'; then
  block "Running 'sass' implies a build step (rules: technical defaults #2). Edit assets/css/site.css directly."
fi

# Reject pip/brew install of bundlers etc — light touch, not exhaustive
if printf '%s' "$cmd" | grep -Eq '\bpip\s+install\s+(vite|astro|jekyll|webpack|esbuild)\b'; then
  block "Installing a bundler is disallowed (rules: technical defaults #2)."
fi

exit 0
