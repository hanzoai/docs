# Stage 1: Build static site
FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat && corepack enable

WORKDIR /app

# Copy workspace root config
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./

# Copy all packages (needed for workspace: deps)
COPY packages/ packages/

# Copy the platform app
COPY apps/platform/ apps/platform/

# Install deps
RUN pnpm install --frozen-lockfile

# Build the platform site (static export)
RUN pnpm --filter @hanzo/platform-site build

# Stage 2: Serve via nginx
FROM nginx:alpine

COPY --from=builder /app/apps/platform/out/ /usr/share/nginx/html/

# Custom nginx config for SPA routing
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri.html $uri/ /index.html; \
    } \
    location /_next/ { \
        expires 365d; \
        add_header Cache-Control "public, immutable"; \
    } \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml; \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
