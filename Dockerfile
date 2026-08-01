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
ENV NEXT_EXPORT=1 \
    HANZO_DOCS_SYNC=0 \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_OPTIONS=--max-old-space-size=24576
ARG APP=docs
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
