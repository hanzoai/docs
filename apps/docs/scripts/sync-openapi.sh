#!/bin/bash
# Fetch THE document: cloud's `openapi.yaml`, from git.hanzo.ai at the ref and
# from the repo `.spec-lock` names.
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
# `flows.yaml` and `sdks.yaml` sit beside it, TRACKED and not fetched. Neither is
# the document — flows.yaml is the six canonical journeys, sdks.yaml is the
# per-language publishing matrix — but both used to be pulled from hanzoai/openapi
# at a pin, and both drifted from cloud on that repo's clock. flows.yaml names
# operationIds, and the pinned copy carried the PROJECTION's id scheme
# (`get_v1_kv_name` for cloud's `get_v1_kv_by_name`), so three of its eleven ids
# resolved to nothing and the flow pages could not be generated at all. A file
# whose contents must agree with the document does not get a second upstream.
#
# The repo is `hanzo-inc/cloud`, which is where the tree lives. `hanzoai/cloud`
# still resolves — the forge 301s it here and `curl -L` follows with the header
# intact — but a name that only works through a redirect is a name that stops
# working the day the redirect is tidied up, and it reads like the public OSS
# split, which is a different tree with a different document.
#
# Three sources for the document, tried in order, all yielding the same bytes:
#
#   1. git.hanzo.ai at the locked ref, when FORGE_TOKEN is set
#   2. a sibling checkout of the cloud tree at ../../../cloud, for offline work
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
LOCK="$SPECS_DIR/.spec-lock"
DOCUMENT="$SPECS_DIR/openapi.yaml"
mkdir -p "$SPECS_DIR"

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT

REF="$(sed -n 's/^ref=//p' "$LOCK" 2>/dev/null || true)"
WANT="$(sed -n 's/^sha256=//p' "$LOCK" 2>/dev/null || true)"
# The lock already names the repo; reading it here means the repo is stated once.
# It was spelled again in the URL below, so moving the tree changed one of the two.
REPO="$(sed -n 's/^repo=//p' "$LOCK" 2>/dev/null || true)"
REPO="${REPO:-hanzo-inc/cloud}"

# The forge serves its API at /v1/, NOT /api/v1/ — /api/v1 answers with a 404
# that reads exactly like a rejected credential.
if [ -n "$REF" ] && [ -n "${FORGE_TOKEN:-}" ] && \
   curl -fsSL -H "Authorization: token $FORGE_TOKEN" \
     "https://git.hanzo.ai/v1/repos/$REPO/raw/openapi.yaml?ref=$REF" -o "$tmp" 2>/dev/null; then
  got="$(sha256sum "$tmp" | cut -d' ' -f1)"
  if [ -n "$WANT" ] && [ "$got" != "$WANT" ]; then
    echo "[openapi] ERROR: $REPO@$REF:openapi.yaml hashes to $got, but $LOCK says $WANT — the ref moved under this reference" >&2
    exit 1
  fi
  install -m 0644 "$tmp" "$DOCUMENT"
  echo "[openapi] fetched the document @ $REF ($(wc -c < "$DOCUMENT") bytes)"
  exit 0
fi

# A sibling checkout is a source of the SAME bytes, not a licence to build from
# whatever is on someone's disk. It sits on whatever commit its owner left it on,
# and installing that silently rebuilt the whole reference from an older release
# while `.spec-lock` still claimed the pinned one. So it is digest-checked like
# any other source, and a mismatch falls through to the committed snapshot.
SIBLING="$APP_DIR/../../../cloud/openapi.yaml"
if [ -f "$SIBLING" ]; then
  got="$(sha256sum "$SIBLING" | cut -d' ' -f1)"
  if [ -z "$WANT" ] || [ "$got" = "$WANT" ]; then
    install -m 0644 "$SIBLING" "$DOCUMENT"
    echo "[openapi] using the sibling cloud checkout ($(wc -c < "$DOCUMENT") bytes) @ $REF"
    exit 0
  fi
  echo "[openapi] the sibling checkout is not at $REF ($got) — keeping the committed snapshot"
fi

if [ -f "$DOCUMENT" ]; then
  echo "[openapi] building from the committed snapshot @ $REF"
  exit 0
fi

echo "[openapi] ERROR: the document is unavailable from every source" >&2
exit 1
