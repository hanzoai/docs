// source.config.ts
import { applyMdxPreset, defineCollections, defineConfig, defineDocs } from "@hanzo/docs-mdx/config";
import { z } from "zod";
import jsonSchema from "@hanzo/docs-mdx/plugins/json-schema";
import lastModified from "@hanzo/docs-mdx/plugins/last-modified";

// lib/shiki.ts
import { configDefault } from "@hanzo/docs-core/highlight";
var shikiConfig = {
  ...configDefault,
  defaultThemes: {
    themes: {
      light: "github-light",
      dark: "vesper"
    }
  }
};

// source.config.ts
import { metaSchema, pageSchema } from "@hanzo/docs-core/source/schema";
import { visit } from "unist-util-visit";
var isLint = process.env.LINT === "1";
var docs = defineDocs({
  docs: {
    schema: pageSchema.extend({
      preview: z.string().optional(),
      index: z.boolean().default(false),
      /**
       * API routes only
       */
      method: z.string().optional()
    }),
    postprocess: {
      includeProcessedMarkdown: true,
      extractLinkReferences: true,
      valueToExport: ["elementIds"]
    },
    async: true,
    async mdxOptions(environment) {
      const { rehypeCodeDefaultOptions } = await import("@hanzo/docs-core/mdx-plugins/rehype-code");
      const { remarkStructureDefaultOptions } = await import("@hanzo/docs-core/mdx-plugins/remark-structure");
      const { remarkSteps } = await import("@hanzo/docs-core/mdx-plugins/remark-steps");
      const { remarkFeedbackBlock } = await import("@hanzo/docs-core/mdx-plugins/remark-feedback-block");
      const { transformerTwoslash } = await import("@hanzo/docs-twoslash");
      const { createFileSystemTypesCache } = await import("@hanzo/docs-twoslash/cache-fs");
      const { default: remarkMath } = await import("remark-math");
      const { remarkTypeScriptToJavaScript } = await import("@hanzo/docs-docgen/remark-ts2js");
      const { default: rehypeKatex } = await import("rehype-katex");
      const { remarkAutoTypeTable, createGenerator, createFileSystemGeneratorCache } = await import("@hanzo/docs-typescript");
      const feedbackOptions = {
        resolve(node) {
          if (node.type === "mdxJsxFlowElement") return "skip";
          return node.type === "paragraph" || node.type === "image" || node.type === "list";
        }
      };
      const typeTableOptions = {
        generator: createGenerator({
          cache: createFileSystemGeneratorCache(".next/@hanzo/docs-typescript")
        }),
        shiki: shikiConfig
      };
      return applyMdxPreset({
        remarkImageOptions: {
          // Imported upstream docs may reference images that don't exist in
          // this monorepo. Log a warning instead of failing the build.
          onError: "ignore"
        },
        rehypeCodeOptions: isLint ? false : {
          langs: ["ts", "js", "html", "tsx", "mdx"],
          inline: "tailing-curly-colon",
          themes: {
            light: "catppuccin-latte",
            dark: "catppuccin-mocha"
          },
          transformers: [
            ...rehypeCodeDefaultOptions.transformers ?? [],
            transformerTwoslash({
              typesCache: createFileSystemTypesCache()
            }),
            transformerEscape()
          ]
        },
        remarkCodeTabOptions: {
          parseMdx: true
        },
        remarkNpmOptions: {
          persist: {
            id: "package-manager"
          }
        },
        remarkPlugins: isLint ? [remarkElementIds] : [
          remarkSteps,
          remarkMath,
          [remarkFeedbackBlock, feedbackOptions],
          [remarkAutoTypeTable, typeTableOptions],
          remarkTypeScriptToJavaScript
        ],
        rehypePlugins: (v) => [rehypeKatex, ...v]
      })(environment);
    }
  },
  meta: {
    schema: metaSchema.extend({
      description: z.string().optional()
    })
  }
});
var blog = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: pageSchema.extend({
    author: z.string(),
    date: z.iso.date().or(z.date())
  }),
  async: true,
  async mdxOptions(environment) {
    const { rehypeCodeDefaultOptions } = await import("@hanzo/docs-core/mdx-plugins/rehype-code");
    const { remarkSteps } = await import("@hanzo/docs-core/mdx-plugins/remark-steps");
    return applyMdxPreset({
      rehypeCodeOptions: isLint ? false : {
        inline: "tailing-curly-colon",
        themes: {
          light: "catppuccin-latte",
          dark: "catppuccin-mocha"
        },
        transformers: [...rehypeCodeDefaultOptions.transformers ?? [], transformerEscape()]
      },
      remarkCodeTabOptions: {
        parseMdx: true
      },
      remarkNpmOptions: {
        persist: {
          id: "package-manager"
        }
      },
      remarkPlugins: isLint ? [remarkElementIds] : [remarkSteps]
    })(environment);
  }
});
function transformerEscape() {
  return {
    name: "@shikijs/transformers:remove-notation-escape",
    code(hast) {
      function replace(node) {
        if (node.type === "text") {
          node.value = node.value.replace("[\\!code", "[!code");
        } else if ("children" in node) {
          for (const child of node.children) {
            replace(child);
          }
        }
      }
      replace(hast);
      return hast;
    }
  };
}
function remarkElementIds() {
  return (tree, file) => {
    file.data ??= {};
    file.data.elementIds ??= [];
    visit(tree, "mdxJsxFlowElement", (element) => {
      if (!element.name || !element.attributes) return;
      const idAttr = element.attributes.find(
        (attr) => attr.type === "mdxJsxAttribute" && attr.name === "id"
      );
      if (idAttr && typeof idAttr.value === "string") {
        file.data.elementIds.push(idAttr.value);
      }
    });
  };
}
var source_config_default = defineConfig({
  plugins: [
    jsonSchema({
      insert: true
    }),
    lastModified()
  ]
});
export {
  blog,
  source_config_default as default,
  docs
};
