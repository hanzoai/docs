import { buildRegistry } from '@/scripts/build-registry';
import { genOpenapiPages } from './gen-openapi-pages';
import { genFlowPages } from './gen-flow-pages';
import { genMcpPages } from './gen-mcp-pages';
import { genPricingPage } from './gen-pricing-page';
import { genKeyTypes } from './gen-key-types';
import { syncCliCommands } from './sync-cli-commands';
import { syncSdkClients } from './sync-sdk-clients';
import { syncProjectDocs } from './sync-project-docs';
import { sanitizeMdx } from './sanitize-mdx';
import { syncHips } from './sync-hips';
import { checkCapabilities, report as reportCapabilities } from './check-capabilities';
import { checkEndpoints, report } from './check-endpoints';
import { checkKeys, report as reportKeys } from './check-keys';

async function main() {
  // The document first, then its projections: the reference (one page per
  // product), the six flows (each shown four ways), and the MCP reference (one
  // page per tool). Flows need the document and the CLI's command table, so that
  // sync runs first — it reads a PINNED commit, so it is still a function of
  // this one.
  //
  // The MCP tool list is NOT synced here. It is vendored
  // (openapi-specs/mcp-tools.json) and refreshed by `pnpm sync:mcp`, a commit
  // someone makes and someone reads. Calling the live door from the build made
  // the site a function of a running service instead of this commit: the door
  // gained a tool named `index`, that name is one this section spends on its own
  // landing page, and the collision gate — correctly — failed every build from
  // that moment, on commits that had already gone green hours earlier. A build
  // that cannot be reproduced from its own commit cannot be trusted when it is
  // red OR when it is green, and a tool list that changes under us should arrive
  // as a diff a human approves, which is where a name collision is cheap to see.
  await syncCliCommands();
  // The specification each capability carries, from hanzoai/hips at a pin. Read
  // by the reference below, so it is refreshed before the pages are written.
  await syncHips();
  // What the published clients call things — the SDK column says so where the
  // method it prints is not one they carry yet.
  await syncSdkClients();
  await genOpenapiPages();
  await genFlowPages();
  await genMcpPages();
  // The key types the authentication page teaches. Also from the document, and
  // BEFORE the checks below, because the check reads what it writes.
  genKeyTypes();
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

  // The capability set is one set: what the document serves, what the taxonomy
  // groups, and what has a page. Checked before the endpoint guard because it
  // is the coarser question — a capability that lost its page is a worse fact
  // than a sentence naming a route, and finding it first says so.
  const caps = checkCapabilities();
  const disagreements =
    caps.unpaged.length + caps.orphaned.length + caps.ungrouped.length + caps.unserved.length;
  if (disagreements) {
    reportCapabilities(caps);
    throw new Error(
      `${disagreements} disagreements between the document, the taxonomy and the pages`,
    );
  }
  console.log(`[capabilities] ${caps.served} served, every one grouped and paged`);

  // Then: no page may claim an endpoint the document does not have — generated
  // or authored, the same rule, because a reader running a curl cannot tell
  // which kind of page they read it on.
  const { checked, unknown } = checkEndpoints();
  if (unknown.length) {
    report(unknown);
    throw new Error(`${unknown.length} mentions name endpoints the document does not have`);
  }
  console.log(`[endpoints] ${checked} mentions checked, every one in the document`);

  // The same rule for the credential, which a reader needs one step before the
  // endpoint: no page may spell a key a way cloud does not mint, and the page
  // that teaches the key types must teach all of them.
  const keys = checkKeys();
  if (keys.unknown.length) reportKeys(keys.unknown);
  if (keys.missing.length) console.error(`   api-keys.mdx never teaches: ${keys.missing.join(', ')}`);
  if (keys.unknown.length || keys.missing.length) {
    throw new Error(
      `${keys.unknown.length} mentions spell a key prefix cloud does not mint` +
        (keys.missing.length ? `, and ${keys.missing.length} key type(s) go untaught` : ''),
    );
  }
  console.log(
    `[keys] ${keys.checked} credential literals checked against ` +
      keys.keys.map((k) => k.prefix).join(' / '),
  );
}

await main().catch((e) => {
  console.error('Failed to run pre build script', e);
  process.exit(1);
});
