import { createOpenAPI } from '@hanzo/docs/openapi/server';
import path from 'node:path';
import fs from 'node:fs';

const isExport = process.env.NEXT_EXPORT === '1';
const specsDir = path.resolve('./openapi-specs');

// Load OpenAPI specs when the directory exists (populated by sync-openapi.sh).
// During static export the generated API pages contain slugs with dots and
// deeply nested paths that break Next.js prerendering / file-copy, so we
// skip them entirely in that mode.
const specFiles =
  !isExport && fs.existsSync(specsDir)
    ? fs
        .readdirSync(specsDir)
        .filter((f: string) => f.endsWith('.yaml'))
        .map((f: string) => path.join(specsDir, f))
    : [];

export const hasSpecs = specFiles.length > 0;

export const openapi = hasSpecs
  ? createOpenAPI({ input: specFiles, proxyUrl: '/api/proxy' })
  : (null as any);
