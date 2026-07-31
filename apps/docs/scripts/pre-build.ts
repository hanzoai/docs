import { buildRegistry } from '@/scripts/build-registry';
import { genOpenapiPages } from './gen-openapi-pages';
import { genFlowPages } from './gen-flow-pages';
import { syncCliCommands } from './sync-cli-commands';
import { syncProjectDocs } from './sync-project-docs';
import { sanitizeMdx } from './sanitize-mdx';

async function main() {
  // The document first, then its projections: the reference (one page per
  // product) and the six flows (each shown four ways). Flows need both the
  // document and the CLI's command table, so they run after those land.
  await syncCliCommands();
  await genOpenapiPages();
  await genFlowPages();

  const tasks = [buildRegistry()];
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
