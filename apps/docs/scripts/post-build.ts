import env from '@next/env';
import { updateSearchIndexes } from './update-hanzo-index';

env.loadEnvConfig(process.cwd());

// Push the freshly-built page set into Hanzo Search.
//
// This used to `await import('./update-orama-index.ts')`, which has thrown
// MODULE_NOT_FOUND on every build since Orama was replaced by Hanzo Search and
// lib/orama was deleted. The throw landed in the catch below, so the build went
// green and the index quietly stopped being updated. One indexer, imported
// statically — a missing one is now a type error, not a runtime surprise.
async function main() {
  await updateSearchIndexes();
}

// Indexing is downstream of the export: a search outage must not stop a deploy.
await main().catch((e) => {
  console.error('Failed to run post build script', e);
});
