import { defineCollections, defineConfig, defineDocs, frontmatterSchema, metaSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: frontmatterSchema.extend({
    author: z.string().default('Zen LM Team'),
    date: z.string(),
    tags: z.array(z.string()).optional(),
  }),
  async: true,
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
