FROM node:20-alpine AS builder
RUN corepack enable
WORKDIR /app

# Copy workspace root config
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./

# Copy only the packages needed and the flow app
COPY packages/ ./packages/
COPY apps/flow/ ./apps/flow/

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @hanzo/flow-site build

FROM ghcr.io/hanzoai/static:0.4.1
COPY --from=builder /app/apps/flow/out /srv
EXPOSE 3000
ENTRYPOINT ["/static", "--root=/srv", "--spa", "--port=3000"]
