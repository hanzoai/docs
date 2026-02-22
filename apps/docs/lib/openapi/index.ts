import { createOpenAPI } from '@hanzo/docs/openapi/server';
import path from 'node:path';
import fs from 'node:fs';

const specsDir = path.resolve('./openapi-specs');

// Auto-discover all specs
const specFiles = fs.existsSync(specsDir)
  ? fs.readdirSync(specsDir)
      .filter((f: string) => f.endsWith('.yaml'))
      .map((f: string) => path.join(specsDir, f))
  : [path.resolve('./scalar.yaml')]; // Fallback to example

export const openapi = createOpenAPI({
  input: specFiles,
  proxyUrl: '/api/proxy',
});
