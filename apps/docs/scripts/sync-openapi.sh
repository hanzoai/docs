#!/bin/bash
# Sync OpenAPI specs from the openapi repo into docs
# Works locally (sibling repo) and in CI (clones from GitHub)
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCS_DIR="$SCRIPT_DIR/.."
OPENAPI_DIR="$DOCS_DIR/../../../openapi"

# If local openapi repo doesn't exist, clone it
if [ ! -d "$OPENAPI_DIR" ]; then
  OPENAPI_DIR="$(mktemp -d)/openapi"
  git clone --depth 1 https://github.com/hanzoai/openapi.git "$OPENAPI_DIR"
fi

mkdir -p "$DOCS_DIR/openapi-specs"

# Commerce excluded temporarily — 3.0.3 spec needs migration to 3.1.0 schema
SERVICES="analytics auto bot chat cloud console db dns edge engine flow gateway iam kms kv mq nexus o11y operative paas platform registry search vector visor zt"

for service in $SERVICES; do
  if [ -f "$OPENAPI_DIR/$service/openapi.yaml" ]; then
    cp "$OPENAPI_DIR/$service/openapi.yaml" "$DOCS_DIR/openapi-specs/$service.yaml"
  fi
done

echo "Synced $(ls "$DOCS_DIR/openapi-specs/"*.yaml 2>/dev/null | wc -l | tr -d ' ') specs"
