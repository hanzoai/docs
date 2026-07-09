// source.config.ts
import { applyMdxPreset, defineCollections, defineConfig, defineDocs } from "@hanzo/docs-mdx/config";
import { z } from "zod";
import jsonSchema from "@hanzo/docs-mdx/plugins/json-schema";
import lastModified from "@hanzo/docs-mdx/plugins/last-modified";

// lib/shiki.ts
var defaultShikiOptions = {
  themes: {
    light: "github-light",
    dark: "vesper"
  }
};
var shikiConfig = defaultShikiOptions;

// source.config.ts
import { metaSchema, pageSchema } from "@hanzo/docs-core/source/schema";
import { visit as visit2 } from "unist-util-visit";

// lib/remark-fix-links.ts
import fs from "node:fs";
import path from "node:path";
import { visit } from "unist-util-visit";
var CONTENT_DIR = path.resolve("content/docs");
var REDIRECTS = path.resolve("public/_redirects");
function urlFromContentPath(p) {
  let rel = path.relative(CONTENT_DIR, p);
  if (rel.endsWith(".mdx")) rel = rel.slice(0, -4);
  const parts = rel.split(path.sep).filter((seg) => !(seg.startsWith("(") && seg.endsWith(")")));
  if (parts.length && parts[parts.length - 1] === "index") parts.pop();
  return "/docs" + (parts.length ? "/" + parts.join("/") : "");
}
var VALID = null;
function validUrls() {
  if (VALID) return VALID;
  const set = /* @__PURE__ */ new Set();
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const fp = path.join(dir, e.name);
      if (e.isDirectory()) walk(fp);
      else if (e.name.endsWith(".mdx")) set.add(urlFromContentPath(fp));
    }
  };
  if (fs.existsSync(CONTENT_DIR)) walk(CONTENT_DIR);
  set.add("/docs");
  if (fs.existsSync(REDIRECTS)) {
    for (const line of fs.readFileSync(REDIRECTS, "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const src = t.split(/\s+/)[0];
      if (src && src.startsWith("/") && !src.includes("*")) set.add(src.replace(/\/$/, ""));
    }
  }
  VALID = set;
  return set;
}
function sectionRoot(fileUrl) {
  const p = fileUrl.split("/");
  if (p[1] === "docs" && p[2] === "services" && p[3]) return `/docs/services/${p[3]}`;
  if (p[1] === "docs" && p[2] === "projects" && p[3] && p[4])
    return `/docs/projects/${p[3]}/${p[4]}`;
  if (p[1] === "docs" && p[2]) return `/docs/${p[2]}`;
  return "/docs";
}
function normalize(u) {
  if (u.length > 1 && u.endsWith("/")) u = u.slice(0, -1);
  return u;
}
function resolveRelative(pageUrl, rel) {
  const base = pageUrl.split("/").slice(0, -1);
  for (const seg of rel.split("/")) {
    if (seg === "" || seg === ".") continue;
    if (seg === "..") base.pop();
    else base.push(seg);
  }
  return normalize(base.join("/") || "/");
}
function fixOne(url, pageUrl, root, valid) {
  if (!url) return url;
  if (/^([a-z][a-z0-9+.-]*:|\/\/|#|mailto:|tel:)/i.test(url)) return url;
  if (url.startsWith("{")) return url;
  const hashIdx = url.search(/[#?]/);
  const suffix = hashIdx >= 0 ? url.slice(hashIdx) : "";
  let p = hashIdx >= 0 ? url.slice(0, hashIdx) : url;
  if (p === "") return url;
  let cand;
  if (p === "/docs" || p.startsWith("/docs/")) cand = normalize(p);
  else if (p.startsWith("/")) cand = normalize(root + p);
  else cand = resolveRelative(pageUrl, p);
  let target;
  if (valid.has(cand)) target = cand;
  else if (valid.has(normalize(p))) target = normalize(p);
  else target = root;
  return target + suffix;
}
function remarkFixInternalLinks() {
  return (tree, file) => {
    const filePath = file.path ?? file.history?.[0] ?? "";
    if (!filePath.includes(`content${path.sep}docs`) && !filePath.includes("content/docs"))
      return;
    const valid = validUrls();
    const pageUrl = urlFromContentPath(filePath);
    const root = sectionRoot(pageUrl);
    visit(tree, (node) => {
      if (node.type === "link" && typeof node.url === "string") {
        node.url = fixOne(node.url, pageUrl, root, valid);
      } else if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") {
        for (const attr of node.attributes ?? []) {
          if (attr.type === "mdxJsxAttribute" && (attr.name === "href" || attr.name === "url") && typeof attr.value === "string") {
            attr.value = fixOne(attr.value, pageUrl, root, valid);
          }
        }
      }
    });
  };
}

// source.config.ts
var isLint = process.env.LINT === "1";
var isExport = process.env.NEXT_EXPORT === "1";
function getDocsFiles() {
  return ["**/*.mdx"];
}
var docs = defineDocs({
  docs: {
    ...getDocsFiles() ? { files: getDocsFiles() } : {},
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
      const { remarkSteps } = await import("@hanzo/docs-core/mdx-plugins/remark-steps");
      const { remarkFeedbackBlock } = await import("@hanzo/docs-core/mdx-plugins/remark-feedback-block");
      const { remarkBlockId } = await import("@hanzo/docs-core/mdx-plugins/remark-block-id");
      const { transformerTwoslash } = await import("@hanzo/docs-twoslash");
      const { createFileSystemTypesCache } = await import("@hanzo/docs-twoslash/cache-fs");
      const { default: remarkMath } = await import("remark-math");
      const { remarkTypeScriptToJavaScript } = await import("@hanzo/docs-docgen/remark-ts2js");
      const { default: rehypeKatex } = await import("rehype-katex");
      const { remarkAutoTypeTable, createGenerator, createFileSystemGeneratorCache } = await import("@hanzo/docs-typescript");
      const typeTableOptions = {
        generator: createGenerator({
          cache: createFileSystemGeneratorCache(".next/@hanzo/docs-typescript")
        }),
        shiki: shikiConfig
      };
      return applyMdxPreset({
        rehypeCodeOptions: isLint ? false : {
          inline: "tailing-curly-colon",
          themes: {
            light: "catppuccin-latte",
            dark: "catppuccin-mocha"
          },
          transformers: [
            ...rehypeCodeDefaultOptions.transformers ?? [],
            transformerTwoslash({
              typesCache: createFileSystemTypesCache(),
              twoslashOptions: {
                compilerOptions: {
                  types: ["@types/node"]
                }
              }
            }),
            transformerEscape()
          ]
        },
        remarkCodeTabOptions: {
          parseMdx: true
        },
        remarkStructureOptions: {
          stringify: {
            filterElement(node) {
              switch (node.type) {
                case "mdxJsxFlowElement":
                case "mdxJsxTextElement":
                  switch (node.name) {
                    case "File":
                    case "TypeTable":
                    case "Callout":
                    case "Card":
                    case "Custom":
                      return true;
                  }
                  return "children-only";
              }
              return true;
            }
          }
        },
        // Ported upstream docs reference images that don't exist in this
        // monorepo. `onError: 'ignore'` logs a warning instead of failing the
        // page — WITHOUT it, a single missing image skips the whole page and it
        // 404s. (Previously a duplicate remarkImageOptions key silently discarded
        // this, skipping 400+ pages.)
        remarkImageOptions: isLint ? false : { onError: "ignore" },
        remarkNpmOptions: {
          persist: {
            id: "package-manager"
          }
        },
        remarkPlugins: isLint ? [remarkElementIds] : [
          remarkFixInternalLinks,
          remarkPassthroughUnknownJsx,
          remarkSteps,
          remarkMath,
          [remarkBlockId, { addDataAttribute: "feedback" }],
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
    }),
    // Only pick up actual meta files — the default **/*.{json,yaml} pattern
    // also matches data files (openapi.json, package.json, etc.) which then
    // get processed through the MDX loader and corrupt the build.
    files: ["**/meta.json", "**/meta.yaml"]
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
      remarkImageOptions: isLint ? false : void 0,
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
function remarkPassthroughUnknownJsx() {
  return (tree, file) => {
    const filePath = file.path ?? file.history[0] ?? "";
    if (!filePath.includes("content/docs/projects/") && !filePath.includes("content\\docs\\projects\\") && !filePath.includes("content/docs/services/") && !filePath.includes("content\\docs\\services\\")) {
      return;
    }
    visit2(tree, ["mdxJsxFlowElement", "mdxJsxTextElement"], (node) => {
      if (!node.name) return;
      if (!/^[A-Z]/.test(node.name)) return;
      node.name = null;
      node.attributes = [];
    });
    visit2(tree, ["mdxFlowExpression", "mdxTextExpression"], (node, index, parent) => {
      if (index == null || !parent) return;
      const expr = (node.value || "").trim();
      if (!expr || /[()=><+\-*/!&|?:,;{}[\]`'"]/.test(expr)) return;
      parent.children.splice(index, 1, {
        type: "text",
        value: `{${expr}}`
      });
    });
  };
}
function remarkElementIds() {
  return (tree, file) => {
    file.data ??= {};
    file.data.elementIds ??= [];
    visit2(tree, "mdxJsxFlowElement", (element) => {
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
