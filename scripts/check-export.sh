#!/bin/sh
# Is this static export a site?
#
# A static-export build fails by exporting NOTHING. The layer is valid, the image
# is valid, the push succeeds, and the host answers 404 — no builder notices,
# because from a builder's point of view nothing went wrong. So the question has
# to be asked explicitly, and it has to be asked by every builder, which means it
# is asked HERE and nowhere else.
#
# Called from:
#   Dockerfile                  build stage, before the export is copied into the
#                               serving image. This is the universal call site:
#                               every builder runs the Dockerfile, so a failure
#                               here aborts the build BEFORE any push, whether
#                               that push came from `docker buildx --push`, an
#                               in-cluster BuildKit job, or a plain docker build.
#   .hanzo/workflows/deploy.yml on /public copied out of the FINISHED image, so
#                               the forge lane also proves the copy landed.
#
# Usage: check-export.sh <export-dir> [require-file]
#
# <require-file> lists extra pages this particular app must have exported, one
# path per line, relative to <export-dir>; blank lines and # comments ignored.
# Default: <export-dir>/../export.require, which is how `apps/<app>/out` finds
# `apps/<app>/export.require` with nothing passed. An app that declares no file
# is checked against the universal rules alone.
set -eu

dir="${1:?usage: check-export.sh <export-dir> [require-file]}"
req="${2:-$(dirname "$dir")/export.require}"
fail=0

say() { echo "export gate: $*" >&2; }

[ -d "$dir" ] || { say "FAIL no such export directory: $dir"; exit 1; }

# 1-2. The two pages every site in this monorepo has: the landing page and the
# root of the docs tree. `trailingSlash: true` means /docs is docs/index.html —
# a docs.html would be a 404 from the static server.
for f in index.html docs/index.html; do
  [ -s "$dir/$f" ] || { say "FAIL missing or empty $f"; fail=1; }
done

# 3. A shell that renders but generates no pages still produces both files above.
# The page count is what separates a site from a shell.
n=$(find "$dir" -name '*.html' | wc -l | tr -d ' ')
say "html pages exported: $n"
[ "$n" -ge 50 ] || { say "FAIL only $n html pages — the export looks broken"; fail=1; }

# 4. A page whose nav did not render is a page nothing else is reachable from.
grep -q 'href="/docs/' "$dir/docs/index.html" 2>/dev/null \
  || { say "FAIL /docs carries no nav — shell-only render"; fail=1; }

# 5. Whole sections vanish silently: a submodule that was not checked out drops
# its pages and every other page still builds. Each app names the sections it
# must not lose, so losing one is a failed build rather than a quiet hole.
if [ -f "$req" ]; then
  say "required pages from $req"
  while IFS= read -r line; do
    case "$line" in ''|\#*) continue ;; esac
    [ -s "$dir/$line" ] || { say "FAIL missing or empty $line"; fail=1; }
  done < "$req"
fi

[ "$fail" -eq 0 ] || { say "REFUSING this export"; exit 1; }
say "ok"
