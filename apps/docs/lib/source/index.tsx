import {
  type InferMetaType,
  type InferPageType,
  type LoaderPlugin,
  loader,
  multiple,
} from '@hanzo/docs/core/source';
import { openapiPlugin, openapiSource } from '@hanzo/docs/openapi/server';
import { blog as blogPosts, docs } from '@hanzo/mdx:collections/server';
import { createSource } from '@hanzo/docs/mdx/runtime/server';
import { lucideIconsPlugin } from '@hanzo/docs/core/source/lucide-icons';
import { openapi, hasSpecs } from '@/lib/openapi';

const sources: Record<string, any> = {
  docs: docs.toSource(),
};

// Only load OpenAPI source when specs exist (skipped during static export)
if (hasSpecs) {
  sources.openapi = await openapiSource(openapi, {
    baseDir: 'openapi/(generated)',
  });
}

export const source = loader(multiple(sources), {
  baseUrl: '/docs',
  plugins: [
    pageTreeCodeTitles(),
    lucideIconsPlugin(),
    ...(hasSpecs ? [openapiPlugin()] : []),
  ],
});

function pageTreeCodeTitles(): LoaderPlugin {
  return {
    transformPageTree: {
      file(node) {
        if (
          typeof node.name === 'string' &&
          (node.name.endsWith('()') || node.name.match(/^<\w+ \/>$/))
        ) {
          return {
            ...node,
            name: (
              <code key="0" className="text-[0.8125rem]">
                {node.name}
              </code>
            ),
          };
        }
        return node;
      },
    },
  };
}

export const blog = loader({
  source: createSource(blogPosts, []),
  baseUrl: '/blog',
});

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
