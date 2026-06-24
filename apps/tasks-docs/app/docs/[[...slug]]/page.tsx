import type { Metadata } from 'next';
import { type ComponentProps, type FC, type ReactNode } from 'react';
import { Callout } from '@fumadocs/base-ui/components/callout';
import { TypeTable } from '@fumadocs/base-ui/components/type-table';
import { createMetadata } from '@/lib/metadata';
import { source } from '@/lib/source';
import { Card, Cards } from '@fumadocs/base-ui/components/card';
import Link from 'fumadocs-core/link';
import { findSiblings } from 'fumadocs-core/page-tree';
import { DocsBody, DocsPage, PageLastUpdate } from '@fumadocs/base-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';

interface DocsPageProps {
  params: Promise<{ slug?: string[] }>;
}

export const revalidate = false;

export default async function Page(props: DocsPageProps) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  const { body: Mdx, toc, lastModified } = await page.data.load();

  return (
    <DocsPage
      toc={toc}
      tableOfContent={{
        style: 'clerk',
      }}
    >
      <h1 className="text-[1.75em] font-semibold">{page.data.title}</h1>
      <p className="text-lg text-fd-muted-foreground mb-6">{page.data.description}</p>
      <div className="prose flex-1 text-fd-foreground/90">
        <Mdx
          components={getMDXComponents({
            a: (props) => <Link {...props} />,
            blockquote: Callout as unknown as FC<ComponentProps<'blockquote'>>,
            TypeTable,
            DocsCategory: ({ url }) => {
              return <DocsCategory url={url ?? page.url} />;
            },
          })}
        />
        {page.data.index ? <DocsCategory url={page.url} /> : null}
      </div>
      {lastModified && <PageLastUpdate date={lastModified} />}
    </DocsPage>
  );
}

function DocsCategory({ url }: { url: string }) {
  return (
    <Cards>
      {findSiblings(source.getPageTree(), url).map((item) => {
        if (item.type === 'separator') return;
        if (item.type === 'folder') {
          if (!item.index) return;
          item = item.index;
        }

        return (
          <Card key={item.url} title={item.name} href={item.url}>
            {item.description}
          </Card>
        );
      })}
    </Cards>
  );
}

export async function generateMetadata(props: DocsPageProps): Promise<Metadata> {
  const { slug = [] } = await props.params;
  const page = source.getPage(slug);
  if (!page)
    return createMetadata({
      title: 'Not Found',
    });

  const description = page.data.description ?? 'Hanzo Tasks Documentation';

  return createMetadata({
    title: page.data.title,
    description,
    openGraph: {
      url: `/docs/${page.slugs.join('/')}`,
    },
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
