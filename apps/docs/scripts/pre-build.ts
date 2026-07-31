import { buildRegistry } from '@/scripts/build-registry';
import { genOpenapiPages } from './gen-openapi-pages';
import { genFlowPages } from './gen-flow-pages';
import { syncCliCommands } from './sync-cli-commands';
import { syncProjectDocs } from './sync-project-docs';
import { sanitizeMdx } from './sanitize-mdx';
import { checkEndpoints } from './check-endpoints';

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

  // Last: no page may claim an endpoint the document does not have. A generated
  // page that does is a bug in a generator above and fails the build; authored
  // prose that does is reported, because the fix there is someone's editorial
  // call, not the build's.
  const { checked, unknown } = checkEndpoints();
  const generated = unknown.filter(([f]) => f.startsWith('openapi/') || f.startsWith('start/'));
  if (generated.length) {
    for (const [f, p] of generated.slice(0, 20)) console.error(`  ${f}: ${p}`);
    throw new Error(`${generated.length} generated pages name endpoints the document does not have`);
  }
  console.log(
    `[endpoints] ${checked} mentions checked, generated pages clean, ` +
      `${unknown.length} in authored prose to reconcile`,
  );
}

await main().catch((e) => {
  console.error('Failed to run pre build script', e);
  process.exit(1);
});
