#!/bin/bash
# Sync OpenAPI specs from the openapi repo into docs
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCS_DIR="$SCRIPT_DIR/.."
OPENAPI_DIR="$DOCS_DIR/../../../openapi"

mkdir -p "$DOCS_DIR/openapi-specs"

for service in analytics auto bot chat cloud commerce console db dns edge engine flow gateway iam kms kv mq nexus o11y operative paas platform registry search vector visor zt; do
  if [ -f "$OPENAPI_DIR/$service/openapi.yaml" ]; then
    cp "$OPENAPI_DIR/$service/openapi.yaml" "$DOCS_DIR/openapi-specs/$service.yaml"
  fi
done

echo "Synced $(ls "$DOCS_DIR/openapi-specs/"*.yaml 2>/dev/null | wc -l | tr -d ' ') specs"
