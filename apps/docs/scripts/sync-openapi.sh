#!/bin/bash
# Sync OpenAPI specs from the openapi repo into docs.
#
# Source-derived: every product directory that ships an `openapi.yaml` is synced
# automatically. There is NO hardcoded service list to drift out of date — adding
# a new product to hanzoai/openapi makes it appear here (and in the generated API
# reference) on the next build with zero edits. Same philosophy as the
# source-derived generators downstream.
#
# Works locally (sibling repo checkout) and in CI (shallow clone from GitHub).
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCS_DIR="$SCRIPT_DIR/.."
OPENAPI_DIR="$DOCS_DIR/../../../openapi"

# If the local openapi repo isn't a sibling checkout, clone it.
if [ ! -d "$OPENAPI_DIR" ]; then
  OPENAPI_DIR="$(mktemp -d)/openapi"
  git clone --depth 1 https://github.com/hanzoai/openapi.git "$OPENAPI_DIR"
fi

mkdir -p "$DOCS_DIR/openapi-specs"

# One rule: <product>/openapi.yaml -> openapi-specs/<product>.yaml, for every product.
count=0
for spec in "$OPENAPI_DIR"/*/openapi.yaml; do
  [ -f "$spec" ] || continue
  service="$(basename "$(dirname "$spec")")"
  cp "$spec" "$DOCS_DIR/openapi-specs/$service.yaml"
  count=$((count + 1))
done

# Also sync the unified umbrella spec (all products in one file) if present.
if [ -f "$OPENAPI_DIR/hanzo.yaml" ]; then
  cp "$OPENAPI_DIR/hanzo.yaml" "$DOCS_DIR/openapi-specs/hanzo.yaml"
fi

echo "Synced ${count} product specs ($(ls "$DOCS_DIR/openapi-specs/"*.yaml 2>/dev/null | wc -l | tr -d ' ') files total, incl. unified hanzo.yaml)"
