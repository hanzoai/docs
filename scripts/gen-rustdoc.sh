#!/usr/bin/env bash
# Generate rustdoc for the Hanzo crates and stage it as each doc app's static /api.
# Run at deploy time (not committed) so the repo stays free of generated HTML.
set -e
gen() { # <repo> <app> <cargo-doc-args...>
  local repo="$1" app="$2"; shift 2
  ( cd ~/work/hanzo/$repo && cargo doc --no-deps "$@" )
  mkdir -p ~/work/hanzo/docs/apps/$app/public/api
  rsync -a ~/work/hanzo/$repo/target/doc/ ~/work/hanzo/docs/apps/$app/public/api/
}
gen engine engine-docs -p hanzo-engine -p hanzo-server-core --features cuda
gen engine router-docs -p hanzo-router
gen ml     ml-docs     --workspace
