#!/usr/bin/env bash
# Walk the four top-level HTML pages, extract internal href/src values
# (relative paths only — skip http*, mailto:, anchors), and HEAD-check
# each one against http://localhost:8000. Print non-200s. Exit non-zero
# if any fail. Assumes scripts/serve.sh is already running.
set -euo pipefail

cd "$(dirname "$0")/.."

PAGES="index.html profile.html DeliveryRouteOptimisation.html ChaptiveAI.html"
BASE="http://localhost:8000"

SEEN_FILE="$(mktemp -t check-links-seen.XXXXXX)"
FAIL_FILE="$(mktemp -t check-links-fail.XXXXXX)"
trap 'rm -f "$SEEN_FILE" "$FAIL_FILE"' EXIT

PAGE_COUNT=0
for page in $PAGES; do
  PAGE_COUNT=$((PAGE_COUNT + 1))
  if [ ! -f "$page" ]; then
    echo "MISSING source page: $page" >&2
    echo "missing:$page" >> "$FAIL_FILE"
    continue
  fi

  # Extract href="..." and src="..." values (single or double quoted).
  refs=$(grep -oE '(href|src)=("[^"]+"|'"'"'[^'"'"']+'"'"')' "$page" \
    | sed -E 's/^(href|src)=//; s/^["'"'"']//; s/["'"'"']$//')

  printf '%s\n' "$refs" | while IFS= read -r ref; do
    case "$ref" in
      ""|"#"*|http://*|https://*|//*|mailto:*|tel:*|javascript:*|data:*) continue ;;
    esac
    clean="${ref%%#*}"
    clean="${clean%%\?*}"
    [ -z "$clean" ] && continue

    key="${page}|${clean}"
    if grep -Fxq "$key" "$SEEN_FILE" 2>/dev/null; then
      continue
    fi
    printf '%s\n' "$key" >> "$SEEN_FILE"

    url="${BASE}/${clean}"
    code=$(curl -sI -o /dev/null -w "%{http_code}" "$url" || echo "000")
    if [ "$code" != "200" ]; then
      echo "[$code] $page -> $clean"
      echo "$code:$page:$clean" >> "$FAIL_FILE"
    fi
  done
done

CHECKED=$(wc -l < "$SEEN_FILE" | tr -d ' ')
FAILED=$(wc -l < "$FAIL_FILE" | tr -d ' ')

echo "Checked $CHECKED unique links across $PAGE_COUNT pages."
if [ "$FAILED" -gt 0 ]; then
  echo "FAIL: $FAILED non-200 link(s)." >&2
  exit 1
fi
echo "OK: all links returned 200."
