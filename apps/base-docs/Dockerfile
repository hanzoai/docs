FROM node:22-slim AS build
WORKDIR /app
RUN npm install -g pnpm
# Copy workspace root
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/ ./packages/
COPY apps/base-docs/ ./apps/base-docs/
RUN pnpm install --frozen-lockfile
WORKDIR /app/apps/base-docs
RUN pnpm build

FROM nginx:alpine
COPY --from=build /app/apps/base-docs/out /usr/share/nginx/html
COPY apps/base-docs/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
