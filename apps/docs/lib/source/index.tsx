import { type LoaderPlugin, loader } from '@hanzo/docs-core/source';
import { blog as blogPosts, docs } from 'collections/server';
import { createSource } from '@hanzo/docs-mdx/runtime/server';
import { lucideIconsPlugin } from '@hanzo/docs-core/source/lucide-icons';

// ONE REFERENCE.
//
// `openapi.staticSource({ baseDir: 'openapi/(generated)', groupBy: 'tag' })`
// mounted a SECOND set of pages at the same URLs as the generated MDX. The
// folder group `(generated)` is stripped from a slug, so its page for the
// `search` operation under the `search` tag resolved to `openapi/search/search`
// -- the address of the MDX page for the same operation -- and the build threw
// `Duplicated slugs` rather than choosing between them.
//
// The MDX is what ships: the site is a static export, which disables this loader
// entirely (lib/openapi/index.ts), so the interactive pages only ever existed in
// dev and CI. Two page sets at one address, one of which production never
// serves, is the drift a reference exists to prevent -- and the interactive one
// cannot state a HIP, a price or a CLI command, which is most of what a
// capability page is now.
//
// `createOpenAPI` stays for /reference, which is its own route and renders the
// same pinned document.

export const source = loader(
  {
    docs: docs.toSource(),
  },
  {
    baseUrl: '/docs',
    plugins: [
      pageTreeCodeTitles(),
      lucideIconsPlugin(),
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
