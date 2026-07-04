import { type LoaderPlugin, loader } from '@hanzo/docs-core/source';
import { blog as blogPosts, docs } from 'collections/server';
import { createSource } from '@hanzo/docs-mdx/runtime/server';
import { lucideIconsPlugin } from '@hanzo/docs-core/source/lucide-icons';
import { openapi, hasSpecs } from '@/lib/openapi';

// In static-export mode `openapi` is intentionally null (lib/openapi skips the
// dotted/deeply-nested API slugs that break Next export), so only wire the
// OpenAPI source + loader plugin when specs are actually present.
const openapiSource = hasSpecs
  ? await openapi.staticSource({
      baseDir: 'openapi/(generated)',
      meta: {
        folderStyle: 'separator',
      },
      groupBy: 'tag',
    })
  : undefined;

export const source = loader(
  {
    docs: docs.toSource(),
    ...(openapiSource ? { openapi: openapiSource } : {}),
  },
  {
    baseUrl: '/docs',
    plugins: [
      pageTreeCodeTitles(),
      lucideIconsPlugin(),
      ...(hasSpecs ? [openapi.loaderPlugin()] : []),
    ],
  },
);

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

export const blog = loader(createSource(blogPosts, []), {
  baseUrl: '/blog',
});

export type Page = (typeof source)['$inferPage'];
export type Meta = (typeof source)['$inferMeta'];
