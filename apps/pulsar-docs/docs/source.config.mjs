// source.config.ts
import { applyMdxPreset, defineConfig, defineDocs, frontmatterSchema, metaSchema } from "fumadocs-mdx/config";
var docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: frontmatterSchema,
    async mdxOptions(environment) {
      const { default: remarkMath } = await import("remark-math");
      const { default: rehypeKatex } = await import("rehype-katex");
      return applyMdxPreset({
        remarkPlugins: (v) => [remarkMath, ...v],
        rehypePlugins: (v) => [rehypeKatex, ...v]
      })(environment);
    }
  },
  meta: {
    schema: metaSchema
  }
});
var source_config_default = defineConfig();
export {
  source_config_default as default,
  docs
};
