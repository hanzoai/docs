import { buildRegistry } from '@/scripts/build-registry';
import { genOpenapiPages } from './gen-openapi-pages';
import { syncProjectDocs } from './sync-project-docs';
import { sanitizeMdx } from './sanitize-mdx';

async function main() {
  const tasks = [buildRegistry(), genOpenapiPages()];
  if (process.env.HANZO_DOCS_SYNC !== '0') {
    tasks.push(syncProjectDocs());
  }
  await Promise.all(tasks);
  // After sync + generation, neutralise parser-breaking constructs in ported
  // docs (angle-bracket autolinks, mis-nested JSX wrappers) so every page
  // compiles instead of falling back to the error boundary.
  sanitizeMdx();
}

await main().catch((e) => {
  console.error('Failed to run pre build script', e);
  process.exit(1);
});
