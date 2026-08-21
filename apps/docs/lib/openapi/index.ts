import { createOpenAPI } from '@hanzo/docs/openapi/server';
import fs from 'node:fs';
import { DOCUMENT } from '@/scripts/openapi-doc';

const isExport = process.env.NEXT_EXPORT === '1';
// ONE document. The interactive loader reads exactly the file the static
// reference is generated from, so dev and the export never disagree — which
// means it reads the path through `openapi-doc`, the one module that resolves
// it, rather than spelling a filename the lock is free to change.
const document = DOCUMENT;

// Load the document when it is present (fetched by sync-openapi.sh). During
// static export the generated API pages contain slugs with dots and deeply
// nested paths that break Next.js prerendering / file-copy, so we skip them
// entirely in that mode and serve the generated MDX instead.
const specFiles = !isExport && fs.existsSync(document) ? [document] : [];

export const hasSpecs = specFiles.length > 0;

export const openapi = hasSpecs
  ? createOpenAPI({ input: specFiles, proxyUrl: '/api/proxy' })
  : (null as any);
