import { defineConfig, defineDocs } from '@hanzo/docs-mdx/config';
import { metaSchema, pageSchema } from '@hanzo/docs-core/source/schema';

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://docs.hanzo.ai/docs/mdx/collections
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
