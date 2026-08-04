# The ONE Fumadocs build for this monorepo, exported static and served by
# hanzoai/static (the house static server; no nginx anywhere in the stack).
#
# APP selects which workspace to export, so every static site here is built the
# same way and the recipe exists once:
#
#     docker build .                                   # docs.hanzo.ai
#     docker build --build-arg APP=gui-docs .          # any sibling
#
# The siblings still reach Cloudflare Pages through their own workflows in
# .hanzo/workflows/. This is the path they move onto, one host at a time, as each
# gets a verified App CR in hanzoai/universe (see LLM.md).
#
# Built by the platform-native fabric (POST /v1/runner → buildkit Job with this
# repo as the git context) and deployed as the docs-landing Service CR at
# docs.hanzo.ai. Mirrors the pnpm recipe the retired GitHub workflow ran:
# NEXT_EXPORT=1 (output:'export'), HANZO_DOCS_SYNC=0 (committed project-docs +
# openapi snapshots — the in-cluster re-sync is incomplete by design).
# build:pre runs `bun ./scripts/*.ts` (gen-services-nav, pre-build). node:alpine has
# no bun, so the build stage produced an empty export → an empty /public → 404s.
# Bring the musl bun binary in from the official image.
FROM oven/bun:1-alpine AS bun

# Prune the workspace to what ${APP} actually needs, BEFORE anything is installed.
#
# This repo is 21 apps and 36 packages; apps/docs depends on 11 of them. Installing
# the whole workspace put node_modules for all 57 on the runner's 38Gi emptyDir,
# alongside .next and out, and the kubelet evicts the runner over that line — after
# a build that had already completed every one of its tasks.
#
# `turbo prune --docker` emits a workspace containing only ${APP} and its
# transitive internal deps. It is the same source and the same lockfile, so the
# image is unchanged; what changes is how much of the monorepo ever lands on disk.
FROM public.ecr.aws/docker/library/node:22-alpine AS pruner
RUN corepack enable && corepack prepare pnpm@11.1.0 --activate
WORKDIR /src
COPY . .
ARG APP=docs
RUN pnpm dlx turbo@2.9.15 prune "${APP}" --docker

FROM public.ecr.aws/docker/library/node:22-alpine AS build
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
RUN apk add --no-cache git libstdc++ libgcc && corepack enable && corepack prepare pnpm@11.1.0 --activate
WORKDIR /src
COPY --from=pruner /src/out/json/ ./
COPY --from=pruner /src/out/full/ ./
# turbo prune emits the workspace, not the repo: root-level scripts are not in it
# and the export gate below runs one. Copied explicitly so the gate still holds.
COPY --from=pruner /src/scripts/ ./scripts/
ENV NEXT_EXPORT=1 \
    HANZO_DOCS_SYNC=0 \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_OPTIONS=--max-old-space-size=24576
ARG APP=docs
# The ingest key, gated HERE for the same reason the export gate is here: this is
# the one thing every builder passes through. A guard in deploy.yml protects one
# of six lanes, and the lane that produced the last live image was not that one,
# so the guard never fired and the bundle shipped keyless.
#
# EVENT_INGEST_KEY is the name in KMS and on the --build-arg; NEXT_PUBLIC_ is
# added here because that prefix is what makes Next inline it.
#
# Fail closed: an empty key builds, serves and looks correct while cloud files
# every pageview under $public, which this org cannot read, and ingest answers
# 200 either way. Refuse the artifact instead.
ARG EVENT_INGEST_KEY=
ENV NEXT_PUBLIC_EVENT_INGEST_KEY=$EVENT_INGEST_KEY
RUN case "$EVENT_INGEST_KEY" in \
      pk-*) : ;; \
      '')   echo "EVENT_INGEST_KEY is empty - pass --build-arg EVENT_INGEST_KEY=<pk-...> (KMS deploy/EVENT_INGEST_KEY, env prod)" >&2; exit 1 ;; \
      *)    echo "EVENT_INGEST_KEY is not a publishable key (expected a pk- prefix)" >&2; exit 1 ;; \
    esac
# Install, build, and drop every intermediate IN ONE LAYER. Only `out/` survives.
#
# The single `&&` chain is the whole point, and it is a disk budget rather than
# tidiness. A RUN is a layer, and a layer stores what existed when it ended — so
# installing in one RUN and deleting in a later one frees NOTHING: node_modules
# is still in the earlier layer, on disk, for the rest of the build. Only files
# that never outlive their own layer cost nothing.
#
# What that saves here: node_modules for a 21-app / 36-package workspace, plus
# .next (~6.9G), plus the turbo cache (~2.4G), plus the pnpm store. The runner's
# docker storage is a 38Gi emptyDir and this build wanted more than all of it.
#
# Over that line the kubelet EVICTS the runner pod --
#   Evicted: Usage of EmptyDir volume "docker-storage" exceeds the limit "38Gi"
# -- which looks nothing like a build failure. The pod restarts, so dockerd
# restarts, so the job log truncates with no error and the run sits in_progress.
# It reads exactly like an OOM and is not one; MemoryPressure stays False and
# node memory sits near 7%. Check `kubectl -n hanzo get events | grep -i evict`
# before believing anything the build log implies about why it stopped.
#
# Splitting this chain back into separate RUNs will reintroduce the eviction
# without changing a line of application code.
#
# Nothing downstream needs the toolchain: the export gate reads `out/` with sh,
# and the serving stage copies `out/` alone.
RUN pnpm install --frozen-lockfile \
 && pnpm build --filter="${APP}" \
 && rm -rf node_modules apps/*/node_modules packages/*/node_modules \
           "apps/${APP}/.next" .turbo \
           /root/.cache /root/.local/share/pnpm /root/.npm

# The export gate, INSIDE the recipe — so it is not a property of one builder.
#
# A static-export build fails by exporting nothing: the layer is valid, the push
# succeeds, and the host answers 404. Gating here means the failure happens
# before an image exists, for every builder, without any of them knowing this
# repo is special — buildx `--push` builds and pushes in one invocation and has
# no step in between to hold, and an in-cluster BuildKit job has none either.
# scripts/check-export.sh states what "a site" means; apps/${APP}/export.require
# names the sections this app must not silently lose.
RUN sh scripts/check-export.sh "apps/${APP}/out"

FROM ghcr.io/hanzoai/static:v0.5.1
# Re-declared: an ARG is scoped to the stage that names it.
ARG APP=docs
COPY --from=build /src/apps/${APP}/out /public
EXPOSE 3000
ENTRYPOINT ["/static", "-port", "3000", "-root", "/public"]
