FROM node:20-alpine AS builder
RUN corepack enable
WORKDIR /app

# Copy workspace root config
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./

# Copy only the packages needed and the cloud app
COPY packages/ ./packages/
COPY apps/cloud/ ./apps/cloud/

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @hanzo/cloud build

FROM ghcr.io/hanzoai/static:latest
COPY --from=builder /app/apps/cloud/out /srv
