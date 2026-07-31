#!/bin/bash
# Fetch THE document: hanzoai/openapi `hanzo.yaml`.
#
# One file, pinned to one commit. openapi-specs/hanzo.pin names the revision the
# reference is built from, so a docs build is reproducible and a spec change is
# a reviewable one-line bump rather than a 2 MB diff arriving by surprise.
#
# hanzoai/openapi is a PRIVATE repo, so the raw fetch needs a token
# (GITHUB_TOKEN / GH_TOKEN, or `gh auth token` locally). Three sources, tried in
# order, all yielding the same bytes:
#
#   1. the pinned raw URL, when a token is available
#   2. a sibling checkout at ../../../openapi, for offline work
#   3. the committed snapshot already in openapi-specs/
#
# Falling through to (3) is normal and safe: the snapshot IS the pinned
# revision, committed so a builder with no credentials still renders the full
# reference. What is never allowed is an empty result — the generator raises if
# the document is missing.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$SCRIPT_DIR/.."
SPECS_DIR="$APP_DIR/openapi-specs"
PIN_FILE="$SPECS_DIR/hanzo.pin"
DOCUMENT="$SPECS_DIR/hanzo.yaml"
# flows.yaml names the six canonical journeys as operationIds, in call order.
# Upstream owns it: the SDKs ship the same six as `examples/<flow>/`, and the
# docs' four-surface pages are one more projection of the same list.
FLOWS="$SPECS_DIR/flows.yaml"
# sdks.yaml is the SDK matrix — the package names the docs print must be the
# ones the generator actually publishes under.
SDKS="$SPECS_DIR/sdks.yaml"

mkdir -p "$SPECS_DIR"

# Fetch one file from the pinned revision. $1 = repo-relative path, $2 = dest.
fetch_pinned() {
  [ -n "${TOKEN:-}" ] || return 1
  curl -fsSL -H "Authorization: Bearer $TOKEN" \
    "https://raw.githubusercontent.com/hanzoai/openapi/$PIN/$1" -o "$2" 2>/dev/null
}

if [ ! -f "$PIN_FILE" ]; then
  echo "[openapi] no $PIN_FILE — nothing to pin to; keeping the committed snapshot"
  exit 0
fi
PIN="$(tr -d '[:space:]' < "$PIN_FILE")"

TOKEN="${GITHUB_TOKEN:-${GH_TOKEN:-}}"
if [ -z "$TOKEN" ] && command -v gh >/dev/null 2>&1; then
  TOKEN="$(gh auth token 2>/dev/null || true)"
fi

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT

if fetch_pinned hanzo.yaml "$tmp"; then
  install -m 0644 "$tmp" "$DOCUMENT"
  got=hanzo.yaml
  for extra in flows.yaml sdks.yaml; do
    if fetch_pinned "$extra" "$tmp"; then
      install -m 0644 "$tmp" "$SPECS_DIR/$extra"
      got="$got + $extra"
    fi
  done
  echo "[openapi] fetched $got @ ${PIN:0:9} ($(wc -c < "$DOCUMENT") bytes)"
  exit 0
fi

SIBLING_DIR="$APP_DIR/../../../openapi"
if [ -f "$SIBLING_DIR/hanzo.yaml" ]; then
  install -m 0644 "$SIBLING_DIR/hanzo.yaml" "$DOCUMENT"
  [ -f "$SIBLING_DIR/flows.yaml" ] && install -m 0644 "$SIBLING_DIR/flows.yaml" "$FLOWS"
  [ -f "$SIBLING_DIR/sdks.yaml" ] && install -m 0644 "$SIBLING_DIR/sdks.yaml" "$SDKS"
  echo "[openapi] using the sibling checkout ($(wc -c < "$DOCUMENT") bytes) — pin is ${PIN:0:9}"
  exit 0
fi

if [ -f "$DOCUMENT" ]; then
  echo "[openapi] no token and no sibling checkout; building from the committed snapshot @ ${PIN:0:9}"
  exit 0
fi

echo "[openapi] ERROR: hanzo.yaml is unavailable from every source" >&2
exit 1
