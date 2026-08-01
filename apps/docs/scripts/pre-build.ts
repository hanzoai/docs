import { buildRegistry } from '@/scripts/build-registry';
import { genOpenapiPages } from './gen-openapi-pages';
import { genFlowPages } from './gen-flow-pages';
import { genMcpPages } from './gen-mcp-pages';
import { genPricingPage } from './gen-pricing-page';
import { syncCliCommands } from './sync-cli-commands';
import { syncMcpTools } from './sync-mcp-tools';
import { syncProjectDocs } from './sync-project-docs';
import { sanitizeMdx } from './sanitize-mdx';
import { GENERATED, checkEndpoints } from './check-endpoints';

async function main() {
  // The document first, then its projections: the reference (one page per
  // product), the six flows (each shown four ways), and the MCP reference (one
  // page per tool). Flows need both the document and the CLI's command table,
  // and both flows and the MCP reference need the door's answer, so the syncs
  // run first.
  await syncCliCommands();
  await syncMcpTools();
  await genOpenapiPages();
  await genFlowPages();
  await genMcpPages();
  // The pricing page is the billing API's own answer, not the document's — it
  // reads /v1/pricing, so it neither needs nor blocks the three above.
  await genPricingPage();

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
  const generated = unknown.filter(([f]) => GENERATED.some((d) => f.startsWith(d)));
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
