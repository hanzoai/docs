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

FROM public.ecr.aws/docker/library/node:22-alpine AS build
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
RUN apk add --no-cache git libstdc++ libgcc && corepack enable && corepack prepare pnpm@11.1.0 --activate
WORKDIR /src
COPY . .
RUN pnpm install --frozen-lockfile
# Memory budget, not a guess. This build runs in a CI pod capped at 26Gi, but
# nothing inside the container can see that cap: `docker info` reports the node's
# 33.6GB and nproc reports the node's 8 cores, because the build container's
# cgroup carries neither limit. So Next forked 7 static-generation workers and
# every one of them inherited a 24576 MiB heap ceiling — a claim on ~196GiB
# against 26Gi of real memory.
#
# It did not fail like an out-of-memory build. It killed the runner's dockerd,
# which took the build container with it, so the job's log simply STOPPED
# mid-export with no error line and the forge went on reporting it as running.
# That signature — a silent truncation and a job that never ends — is what made
# this look like a broken Dockerfile for weeks. dockerd restarting at the exact
# second the log stopped is what identified it.
#
# 4 processes (3 workers + the parent) x 5120 MiB = 20GiB ceiling, inside 26Gi
# with room for dockerd and the runner itself. Raise NEXT_BUILD_CPUS only
# alongside the pod limit in hanzoai/universe; they are one number in two places.
ENV NEXT_EXPORT=1 \
    HANZO_DOCS_SYNC=0 \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_BUILD_CPUS=3 \
    NODE_OPTIONS=--max-old-space-size=5120
ARG APP=docs
# Next inlines NEXT_PUBLIC_* at BUILD time, so the ingest key has to arrive as a
# build-arg rather than as pod env. Without it the bundle ships keyless and cloud
# files every pageview under the reserved $public tenant — pageview and error
# only, and our own org cannot read it. Ingest answers 200 either way, so the
# loss is silent. The value is publishable and write-only by design.
ARG NEXT_PUBLIC_EVENT_INGEST_KEY=
ENV NEXT_PUBLIC_EVENT_INGEST_KEY=$NEXT_PUBLIC_EVENT_INGEST_KEY
RUN pnpm build --filter="${APP}"

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
