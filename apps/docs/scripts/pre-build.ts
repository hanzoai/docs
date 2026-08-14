import { buildRegistry } from '@/scripts/build-registry';
import { genOpenapiPages } from './gen-openapi-pages';
import { genFlowPages } from './gen-flow-pages';
import { genMcpPages } from './gen-mcp-pages';
import { genPricingPage } from './gen-pricing-page';
import { syncCliCommands } from './sync-cli-commands';
import { syncMcpTools } from './sync-mcp-tools';
import { syncSdkClients } from './sync-sdk-clients';
import { syncProjectDocs } from './sync-project-docs';
import { sanitizeMdx } from './sanitize-mdx';
import { checkEndpoints, report } from './check-endpoints';

async function main() {
  // The document first, then its projections: the reference (one page per
  // product), the six flows (each shown four ways), and the MCP reference (one
  // page per tool). Flows need both the document and the CLI's command table,
  // and both flows and the MCP reference need the door's answer, so the syncs
  // run first.
  await syncCliCommands();
  await syncMcpTools();
  // What the published clients call things — the SDK column says so where the
  // method it prints is not one they carry yet.
  await syncSdkClients();
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

  // Last: no page may claim an endpoint the document does not have — generated
  // or authored, the same rule, because a reader running a curl cannot tell
  // which kind of page they read it on.
  const { checked, unknown } = checkEndpoints();
  if (unknown.length) {
    report(unknown);
    throw new Error(`${unknown.length} mentions name endpoints the document does not have`);
  }
  console.log(`[endpoints] ${checked} mentions checked, every one in the document`);
}

await main().catch((e) => {
  console.error('Failed to run pre build script', e);
  process.exit(1);
});
