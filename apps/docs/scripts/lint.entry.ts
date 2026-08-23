import { postInstall } from '@hanzo/docs-mdx/next';
import mdx from '@hanzo/docs-mdx/rolldown';
import { unrun } from 'unrun';
import { collectionsAliasAbsolute } from '../lib/collections-alias';

process.env.LINT = '1';
await postInstall();
await unrun({
  path: './scripts/lint.ts',
  inputOptions: {
    plugins: [mdx(await import('../source.config.ts'))],
    // lint.ts reaches lib/source, which imports the generated collections.
    // rolldown never reads next.config.ts, so it needs the same map.
    resolve: { alias: collectionsAliasAbsolute },
  },
});
