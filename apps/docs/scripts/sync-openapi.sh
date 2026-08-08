#!/bin/bash
# Fetch THE document: hanzoai/cloud `openapi.yaml`, from git.hanzo.ai.
#
# THE REFERENCE RENDERS THE SAME DOCUMENT THE SDKS AND THE CLI ARE GENERATED
# FROM. It used to render hanzoai/openapi's `hanzo.yaml` instead — a projection
# of cloud's document with six codegen rules applied, published on its own clock.
# Those rules exist to make a document GENERATABLE, and a doc page needs none of
# them: it reads paths, tags, summaries and schemas, all of which cloud emits
# itself. So the projection bought the reference nothing and cost it currency.
# Measured the day this changed, the pinned projection was 19 cloud releases
# behind, and four relay-door products — download, files, upload, exec — were
# rendered with twelve operations each where cloud's document has one, one, one
# and two. Every one of those extra entries was the same heading repeated.
#
# `.spec-lock` names the cloud release the reference is built from, in the same
# four lines every SDK uses, so a bump is one reviewable line rather than a 4 MB
# diff arriving by surprise. The digest is checked: a pinned ref whose bytes
# moved means someone moved a tag.
#
# `flows.yaml` and `sdks.yaml` still come from hanzoai/openapi at `hanzo.pin`,
# and that is correct — neither is the document. flows.yaml is the six canonical
# journeys and sdks.yaml is the per-language publishing matrix.
#
# Three sources for the document, tried in order, all yielding the same bytes:
#
#   1. git.hanzo.ai at the locked ref, when FORGE_TOKEN is set
#   2. a sibling checkout of hanzoai/cloud at ../../../cloud, for offline work
#   3. the committed snapshot already in openapi-specs/
#
# Falling through to (3) is normal and safe: the snapshot IS the locked release,
# committed so a builder with no credentials still renders the full reference.
# What is never allowed is an empty result — the generator raises if the document
# is missing.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$SCRIPT_DIR/.."
SPECS_DIR="$APP_DIR/openapi-specs"
PIN_FILE="$SPECS_DIR/hanzo.pin"
LOCK="$SPECS_DIR/.spec-lock"
DOCUMENT="$SPECS_DIR/openapi.yaml"
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

# flows.yaml and sdks.yaml, from hanzoai/openapi at hanzo.pin. Neither is the
# document; a miss here leaves the committed copy in place and is not fatal.
for extra in flows.yaml sdks.yaml; do
  if fetch_pinned "$extra" "$tmp"; then
    install -m 0644 "$tmp" "$SPECS_DIR/$extra"
    echo "[openapi] fetched $extra @ ${PIN:0:9}"
  fi
done

REF="$(sed -n 's/^ref=//p' "$LOCK" 2>/dev/null || true)"
WANT="$(sed -n 's/^sha256=//p' "$LOCK" 2>/dev/null || true)"

# The forge serves its API at /v1/, NOT /api/v1/ — /api/v1 answers with a 404
# that reads exactly like a rejected credential.
if [ -n "$REF" ] && [ -n "${FORGE_TOKEN:-}" ] && \
   curl -fsSL -H "Authorization: token $FORGE_TOKEN" \
     "https://git.hanzo.ai/v1/repos/hanzoai/cloud/raw/openapi.yaml?ref=$REF" -o "$tmp" 2>/dev/null; then
  got="$(sha256sum "$tmp" | cut -d' ' -f1)"
  if [ -n "$WANT" ] && [ "$got" != "$WANT" ]; then
    echo "[openapi] ERROR: hanzoai/cloud@$REF:openapi.yaml hashes to $got, but $LOCK says $WANT — the ref moved under this reference" >&2
    exit 1
  fi
  install -m 0644 "$tmp" "$DOCUMENT"
  echo "[openapi] fetched the document @ $REF ($(wc -c < "$DOCUMENT") bytes)"
  exit 0
fi

SIBLING_DIR="$APP_DIR/../../../cloud"
if [ -f "$SIBLING_DIR/openapi.yaml" ]; then
  install -m 0644 "$SIBLING_DIR/openapi.yaml" "$DOCUMENT"
  echo "[openapi] using the sibling hanzoai/cloud checkout ($(wc -c < "$DOCUMENT") bytes) — lock is $REF"
  exit 0
fi

if [ -f "$DOCUMENT" ]; then
  echo "[openapi] no FORGE_TOKEN and no sibling checkout; building from the committed snapshot @ $REF"
  exit 0
fi

echo "[openapi] ERROR: the document is unavailable from every source" >&2
exit 1
