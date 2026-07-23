# hanzo-docs/docs — the ONE Fumadocs build, exported static and served by
# hanzoai/static (the house static server; no nginx anywhere in the stack).
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
RUN pnpm build --filter=docs

FROM ghcr.io/hanzoai/static:v0.3.1
COPY --from=build /src/apps/docs/out /public
EXPOSE 3000
ENTRYPOINT ["/static", "-port", "3000", "-root", "/public", "-404", "404.html"]
