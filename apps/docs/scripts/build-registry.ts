import { compile, writeRegistry } from '@hanzo/docs-cli/build';
import { compileOptions, registry } from '@/components/registry/index.js';

export async function buildRegistry() {
  const all = await compile({
    root: registry,
    ...compileOptions,
  });
  await writeRegistry(all, {
    dir: 'public/registry',
  });
}
