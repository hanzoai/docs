// source.config.ts
import { defineCollections, defineConfig, defineDocs, frontmatterSchema, metaSchema } from "fumadocs-mdx/config";
import { z } from "zod";
var docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: frontmatterSchema
  },
  meta: {
    schema: metaSchema
  }
});
var blog = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: frontmatterSchema.extend({
    author: z.string().default("Zen LM Team"),
    date: z.string(),
    tags: z.array(z.string()).optional()
  }),
  async: true
});
var source_config_default = defineConfig({
  mdxOptions: {
    // MDX options
  }
});
export {
  blog,
  source_config_default as default,
  docs
};
