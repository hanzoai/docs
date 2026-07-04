import { type LoaderPlugin, loader } from '@hanzo/docs-core/source';
import { blog as blogPosts, docs } from 'collections/server';
import { createSource } from '@hanzo/docs-mdx/runtime/server';
import { lucideIconsPlugin } from '@hanzo/docs-core/source/lucide-icons';
import { openapi } from '@/lib/openapi';

export const source = loader(
  {
    docs: docs.toSource(),
    openapi: await openapi.staticSource({
      baseDir: 'openapi/(generated)',
      meta: {
        folderStyle: 'separator',
      },
      groupBy: 'tag',
    }),
  },
  {
    baseUrl: '/docs',
    plugins: [pageTreeCodeTitles(), lucideIconsPlugin(), openapi.loaderPlugin()],
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
