import {
  applyMdxPreset,
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from '@hanzo/docs-mdx/config';
import { z } from 'zod';
import lastModified from '@hanzo/docs-mdx/plugins/last-modified';

export const docs = defineDocs({
  docs: {
    schema: frontmatterSchema.extend({
      index: z.boolean().default(false),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
      extractLinkReferences: true,
    },
    async: true,
    async mdxOptions(environment) {
      const { rehypeCodeDefaultOptions } = await import('@hanzo/docs-core/mdx-plugins/rehype-code');
      const { remarkStructureDefaultOptions } =
        await import('@hanzo/docs-core/mdx-plugins/remark-structure');
      const { remarkSteps } = await import('@hanzo/docs-core/mdx-plugins/remark-steps');

      return applyMdxPreset({
        remarkStructureOptions: {
          types: [...remarkStructureDefaultOptions.types, 'code'],
        },
        rehypeCodeOptions: {
          langs: ['ts', 'tsx', 'js', 'jsx', 'css', 'go', 'bash', 'json', 'yaml', 'shell', 'typescript', 'javascript', 'markdown', 'prisma'],
          inline: 'tailing-curly-colon',
          themes: {
            light: 'github-light',
            dark: 'github-dark',
          },
          transformers: [
            ...(rehypeCodeDefaultOptions.transformers ?? []),
          ],
        },
        remarkCodeTabOptions: {
          parseMdx: true,
        },
        remarkNpmOptions: {
          persist: {
            id: 'package-manager',
          },
        },
        remarkPlugins: [remarkSteps],
      })(environment);
    },
  },
  meta: {
    schema: metaSchema.extend({
      description: z.string().optional(),
    }),
  },
});

export default defineConfig({
  plugins: [
    lastModified(),
  ],
});
