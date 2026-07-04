import { applyMdxPreset, defineCollections, defineConfig, defineDocs } from '@hanzo/docs-mdx/config';
import { z } from 'zod';
import type { ElementContent } from 'hast';
import jsonSchema from '@hanzo/docs-mdx/plugins/json-schema';
import lastModified from '@hanzo/docs-mdx/plugins/last-modified';
import type { ShikiTransformer } from 'shiki';
import type { RemarkAutoTypeTableOptions } from '@hanzo/docs-typescript';
import { shikiConfig } from './lib/shiki';
import { metaSchema, pageSchema } from '@hanzo/docs-core/source/schema';
import { visit } from 'unist-util-visit';
import type { Transformer } from 'unified';
import type { Root } from 'mdast';

const isLint = process.env.LINT === '1';

const isExport = process.env.NEXT_EXPORT === '1';

// One unified build. The whole doc set — core pages, every service (incl. iam,
// kms, platform) and every synced OSS project — is compiled in a single pass and
// deployed to a single CF Pages project (`hanzo-docs`). The previous federated
// layout (one Pages project per DOCS_SECTION, stitched by an edge worker) is
// retired: it left stale `*.pages.dev` origins that 530'd whole sections.
// Foreign MDX from ported upstream docs is neutralised by next.config's
// ProjectDocsFallback plugin + remarkPassthroughUnknownJsx (both cover
// content/docs/projects/** and content/docs/services/**), so a single build is
// safe. meta.json files are always included so the sidebar tree is complete.
function getDocsFiles(): string[] {
  return ['**/*.mdx'];
}

export const docs = defineDocs({
  docs: {
    ...(getDocsFiles() ? { files: getDocsFiles() } : {}),
    schema: pageSchema.extend({
      preview: z.string().optional(),
      index: z.boolean().default(false),
      /**
       * API routes only
       */
      method: z.string().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
      extractLinkReferences: true,
      valueToExport: ['elementIds'],
    },
    async: true,
    async mdxOptions(environment) {
      const { rehypeCodeDefaultOptions } = await import('@hanzo/docs-core/mdx-plugins/rehype-code');
      const { remarkSteps } = await import('@hanzo/docs-core/mdx-plugins/remark-steps');
      const { remarkFeedbackBlock } =
        await import('@hanzo/docs-core/mdx-plugins/remark-feedback-block');
      const { remarkBlockId } = await import('@hanzo/docs-core/mdx-plugins/remark-block-id');
      const { transformerTwoslash } = await import('@hanzo/docs-twoslash');
      const { createFileSystemTypesCache } = await import('@hanzo/docs-twoslash/cache-fs');
      const { default: remarkMath } = await import('remark-math');
      const { remarkTypeScriptToJavaScript } = await import('@hanzo/docs-docgen/remark-ts2js');
      const { default: rehypeKatex } = await import('rehype-katex');
      const { remarkAutoTypeTable, createGenerator, createFileSystemGeneratorCache } =
        await import('@hanzo/docs-typescript');

      const typeTableOptions: RemarkAutoTypeTableOptions = {
        generator: createGenerator({
          cache: createFileSystemGeneratorCache('.next/@hanzo/docs-typescript'),
        }),
        shiki: shikiConfig,
      };
      return applyMdxPreset({
        remarkImageOptions: {
          // Imported upstream docs may reference images that don't exist in
          // this monorepo. Log a warning instead of failing the build.
          onError: 'ignore',
        },
        rehypeCodeOptions: isLint
          ? false
          : {
              inline: 'tailing-curly-colon',
              themes: {
                light: 'catppuccin-latte',
                dark: 'catppuccin-mocha',
              },
              transformers: [
                ...(rehypeCodeDefaultOptions.transformers ?? []),
                transformerTwoslash({
                  typesCache: createFileSystemTypesCache(),
                  twoslashOptions: {
                    compilerOptions: {
                      types: ['@types/node'],
                    },
                  },
                }),
                transformerEscape(),
              ],
            },
        remarkCodeTabOptions: {
          parseMdx: true,
        },
        remarkStructureOptions: {
          stringify: {
            filterElement(node) {
              switch (node.type) {
                case 'mdxJsxFlowElement':
                case 'mdxJsxTextElement':
                  switch (node.name) {
                    case 'File':
                    case 'TypeTable':
                    case 'Callout':
                    case 'Card':
                    case 'Custom':
                      return true;
                  }
                  return 'children-only';
              }

              return true;
            },
          },
        },
        remarkImageOptions: isLint ? false : undefined,
        remarkNpmOptions: {
          persist: {
            id: 'package-manager',
          },
        },
        remarkPlugins: isLint
          ? [remarkElementIds]
          : [
              remarkPassthroughUnknownJsx,
              remarkSteps,
              remarkMath,
              [remarkBlockId, { addDataAttribute: 'feedback' }],
              [remarkAutoTypeTable, typeTableOptions],
              remarkTypeScriptToJavaScript,
            ],
        rehypePlugins: (v) => [rehypeKatex, ...v],
      })(environment);
    },
  },
  meta: {
    schema: metaSchema.extend({
      description: z.string().optional(),
    }),
    // Only pick up actual meta files — the default **/*.{json,yaml} pattern
    // also matches data files (openapi.json, package.json, etc.) which then
    // get processed through the MDX loader and corrupt the build.
    files: ['**/meta.json', '**/meta.yaml'],
  },
});

export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: pageSchema.extend({
    author: z.string(),
    date: z.iso.date().or(z.date()),
  }),
  async: true,
  async mdxOptions(environment) {
    const { rehypeCodeDefaultOptions } = await import('@hanzo/docs-core/mdx-plugins/rehype-code');
    const { remarkSteps } = await import('@hanzo/docs-core/mdx-plugins/remark-steps');

    return applyMdxPreset({
      rehypeCodeOptions: isLint
        ? false
        : {
            inline: 'tailing-curly-colon',
            themes: {
              light: 'catppuccin-latte',
              dark: 'catppuccin-mocha',
            },
            transformers: [...(rehypeCodeDefaultOptions.transformers ?? []), transformerEscape()],
          },
      remarkCodeTabOptions: {
        parseMdx: true,
      },
      remarkImageOptions: isLint ? false : undefined,
      remarkNpmOptions: {
        persist: {
          id: 'package-manager',
        },
      },
      remarkPlugins: isLint ? [remarkElementIds] : [remarkSteps],
    })(environment);
  },
});

function transformerEscape(): ShikiTransformer {
  return {
    name: '@shikijs/transformers:remove-notation-escape',
    code(hast) {
      function replace(node: ElementContent) {
        if (node.type === 'text') {
          node.value = node.value.replace('[\\!code', '[!code');
        } else if ('children' in node) {
          for (const child of node.children) {
            replace(child);
          }
        }
      }

      replace(hast);
      return hast;
    },
  };
}

/**
 * Remark plugin that converts unknown JSX components (from upstream doc
 * platforms like Mintlify, Docusaurus, GitBook, etc.) into JSX fragments
 * so MDX doesn't generate _missingMdxReference checks that crash SSG.
 *
 * Only applies to files inside content/docs/projects/.
 */
function remarkPassthroughUnknownJsx(): Transformer<Root, Root> {
  return (tree, file) => {
    // Only transform upstream project docs — leave first-party docs alone
    // so unknown components still surface as errors during development.
    const filePath = file.path ?? file.history[0] ?? '';
    if (!filePath.includes('content/docs/projects/') &&
        !filePath.includes('content\\docs\\projects\\') &&
        !filePath.includes('content/docs/services/') &&
        !filePath.includes('content\\docs\\services\\')) {
      return;
    }

    // Convert ALL PascalCase JSX elements to fragments in project docs.
    // Upstream docs use components from various platforms (Mintlify, Docusaurus,
    // GitBook, etc.) with incompatible APIs. Rather than maintaining a
    // whitelist and risking API mismatches (e.g. Mintlify <Tab title="..."> vs
    // Hanzo Docs <Tab value="...">), we strip all custom components and render
    // just their children. First-party docs are unaffected by this plugin.
    visit(tree, ['mdxJsxFlowElement', 'mdxJsxTextElement'], (node: any) => {
      if (!node.name) return; // already a fragment
      // Only target PascalCase names (custom components), not lowercase HTML
      if (!/^[A-Z]/.test(node.name)) return;

      // Convert to JSX fragment: strips the unknown tag but keeps children
      node.name = null;
      node.attributes = [];
    });

    // Convert stray {expression} nodes to literal text. Upstream docs use
    // template-style placeholders like {region} which MDX evaluates as JS.
    visit(tree, ['mdxFlowExpression', 'mdxTextExpression'], (node: any, index, parent) => {
      if (index == null || !parent) return;
      // Skip expressions that look like actual JS (contain operators, calls, etc.)
      const expr = (node.value || '').trim();
      if (!expr || /[()=><+\-*/!&|?:,;{}[\]`'"]/.test(expr)) return;
      // Simple identifier like {region} — convert to literal text
      parent.children.splice(index, 1, {
        type: 'text',
        value: `{${expr}}`,
      });
    });
  };
}

function remarkElementIds(): Transformer<Root, Root> {
  return (tree, file) => {
    file.data ??= {};
    file.data.elementIds ??= [];

    visit(tree, 'mdxJsxFlowElement', (element) => {
      if (!element.name || !element.attributes) return;

      const idAttr = element.attributes.find(
        (attr) => attr.type === 'mdxJsxAttribute' && attr.name === 'id',
      );

      if (idAttr && typeof idAttr.value === 'string') {
        (file.data.elementIds as string[]).push(idAttr.value);
      }
    });
  };
}

export default defineConfig({
  plugins: [
    jsonSchema({
      insert: true,
    }),
    lastModified(),
  ],
});
