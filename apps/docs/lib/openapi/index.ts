import { createOpenAPI } from '@hanzo/docs/openapi/server';
import path from 'node:path';
import fs from 'node:fs';

const specsDir = path.resolve('./openapi-specs');
const isExport = process.env.NEXT_EXPORT === '1';

// Skip OpenAPI spec loading during static export — the 26 specs generate
// ~780 additional pages which combined with 2,600 MDX pages causes
// non-deterministic worker failures due to memory pressure on CI runners.
const specFiles =
  isExport || !fs.existsSync(specsDir)
    ? []
    : fs
        .readdirSync(specsDir)
        .filter((f: string) => f.endsWith('.yaml'))
        .map((f: string) => path.join(specsDir, f));

export const hasSpecs = specFiles.length > 0;

export const openapi = hasSpecs
  ? createOpenAPI({ input: specFiles, proxyUrl: '/api/proxy' })
  : (null as any);
