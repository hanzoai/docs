// source.config.ts
import { defineConfig, defineDocs } from "@hanzo/docs-mdx/config";
import { metaSchema, pageSchema } from "@hanzo/docs-core/source/schema";
var docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true
    }
  },
  meta: {
    schema: metaSchema
  }
});
var source_config_default = defineConfig({
  mdxOptions: {
    // MDX options
  }
});
export {
  source_config_default as default,
  docs
};
