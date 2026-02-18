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

FROM nginx:alpine
COPY --from=builder /app/apps/flow/out /usr/share/nginx/html
COPY apps/flow/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
