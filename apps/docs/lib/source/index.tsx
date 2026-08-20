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

// Where a page's markdown twin lives. Its own namespace rather than
// `${page.url}.mdx`, because a dotted suffix on the docs route is not a route
// this app can express — which is why the Copy Markdown and View Markdown
// buttons shipped pointing at 404s. A trailing `content.md` segment IS
// expressible, so the route below prerenders under `output: 'export'`.
export const docsContentRoute = '/llms.mdx/docs';

export function getPageMarkdownUrl(page: Page) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: `${docsContentRoute}/${segments.join('/')}` };
}
