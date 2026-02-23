import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = defineCloudflareConfig();

// Override the default build command to avoid recursion.
// opennextjs-cloudflare normally runs `pnpm build` which would re-invoke
// itself. Point directly at the Next.js build pipeline instead.
config.buildCommand =
  "bash scripts/sync-openapi.sh && pnpm build:pre && NODE_OPTIONS='--max-old-space-size=16384' next build --webpack && pnpm build:post";

export default config;
