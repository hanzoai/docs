import { buildRegistry } from '@/scripts/build-registry';
import { syncProjectDocs } from './sync-project-docs';

async function main() {
  const tasks = [buildRegistry()];
  if (process.env.HANZO_DOCS_SYNC !== '0') {
    tasks.push(syncProjectDocs());
  }
  await Promise.all(tasks);
}

await main().catch((e) => {
  console.error('Failed to run pre build script', e);
  process.exit(1);
});
