import { createOpenAPI } from '@hanzo/docs/openapi/server';
import path from 'node:path';
import fs from 'node:fs';

const specsDir = path.resolve('./openapi-specs');

// Load OpenAPI specs when the directory exists (populated by sync-openapi.sh).
// With projects excluded from the build, the ~780 generated API pages fit
// comfortably within CI memory limits alongside ~240 MDX pages.
const specFiles = fs.existsSync(specsDir)
  ? fs
      .readdirSync(specsDir)
      .filter((f: string) => f.endsWith('.yaml'))
      .map((f: string) => path.join(specsDir, f))
  : [];

export const hasSpecs = specFiles.length > 0;

export const openapi = hasSpecs
  ? createOpenAPI({ input: specFiles, proxyUrl: '/api/proxy' })
  : (null as any);
