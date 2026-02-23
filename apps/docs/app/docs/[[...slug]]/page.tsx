import type { Metadata } from 'next';
import { type ComponentProps, type FC, type ReactNode } from 'react';
import * as Twoslash from '@hanzo/docs-twoslash/ui';
import { Callout } from '@hanzo/docs-base-ui/components/callout';
import { TypeTable } from '@hanzo/docs-base-ui/components/type-table';
import * as Preview from '@/components/preview';
import { createMetadata, getPageImage } from '@/lib/metadata';
import { source } from '@/lib/source';
import { Wrapper } from '@/components/preview/wrapper';
import { Mermaid } from '@/components/mdx/mermaid';
import { PageFeedback, PageFeedbackBlock } from '@/components/feedback';
import { owner, repo } from '@/lib/github';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import Link from '@hanzo/docs-core/link';
import { findSiblings } from '@hanzo/docs-core/page-tree';
import { Card, Cards } from '@hanzo/docs-base-ui/components/card';
import { getMDXComponents } from '@/mdx-components';
import { LLMCopyButton, ViewOptions } from '@/components/ai/page-actions';
import { Banner } from '@hanzo/docs-base-ui/components/banner';
import { Installation } from '@/components/preview/installation';
import { Customisation } from '@/components/preview/customisation';
import { DocsBody, DocsPage, PageLastUpdate } from '@hanzo/docs-base-ui/layouts/docs/page';
import { NotFound } from '@/components/layouts/not-found';
import { MdxErrorBoundary } from '@/components/mdx-error-boundary';
import { getSuggestions } from './suggestions';
import { PathUtils } from '@hanzo/docs-core/source';

function PreviewRenderer({ preview }: { preview: string }): ReactNode {
  if (preview && preview in Preview) {
    const Comp = Preview[preview as keyof typeof Preview];
    return <Comp />;
  }

  return null;
}

export const revalidate = false;

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page)
    return (
      <NotFound
        getSuggestions={async () => (params.slug ? getSuggestions(params.slug.join(' ')) : [])}
      />
    );

  if (page.data.type === 'openapi') {
    const { APIPage } = await import('@/components/api-page');
    if (!APIPage) {
      return (
        <DocsPage full>
          <h1 className="text-[1.75em] font-semibold">{page.data.title}</h1>
          <DocsBody>
            <p className="text-fd-muted-foreground">API reference is not available during static export.</p>
          </DocsBody>
        </DocsPage>
      );
    }
    return (
      <DocsPage full>
        <h1 className="text-[1.75em] font-semibold">{page.data.title}</h1>

        <DocsBody>
          <APIPage {...page.data.getAPIPageProps()} />
        </DocsBody>
      </DocsPage>
    );
  }

  const { body: Mdx, toc, lastModified } = await page.data.load();

  return (
    <DocsPage
      toc={toc}
      tableOfContent={{
        style: 'clerk',
      }}
    >
      <h1 className="text-[1.75em] font-semibold">{page.data.title}</h1>
      <p className="text-lg text-fd-muted-foreground mb-2">{page.data.description}</p>
      <div className="flex flex-row flex-wrap gap-2 items-center border-b pb-6">
        <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
        <ViewOptions
          markdownUrl={`${page.url}.mdx`}
          githubUrl={`https://github.com/${owner}/${repo}/blob/dev/apps/docs/content/docs/${page.path}`}
        />
      </div>
      <div className="prose flex-1 text-fd-foreground/90">
        {page.data.preview && <PreviewRenderer preview={page.data.preview} />}
        <MdxErrorBoundary>
          <Mdx
            components={getMDXComponents({
              ...Twoslash,
              a: ({ href, ...props }) => {
                const found = source.getPageByHref(href ?? '', {
                  dir: PathUtils.dirname(page.path),
                });

                if (!found) return <Link href={href} {...props} />;

                return (
                  <HoverCard>
                    <HoverCardTrigger
                      href={found.hash ? `${found.page.url}#${found.hash}` : found.page.url}
                      {...props}
                    >
                      {props.children}
                    </HoverCardTrigger>
                    <HoverCardContent className="text-sm">
                      <p className="font-medium">{found.page.data.title}</p>
                      <p className="text-fd-muted-foreground">{found.page.data.description}</p>
                    </HoverCardContent>
                  </HoverCard>
                );
              },
              FeedbackBlock: ({ children, ...props }) => (
                <PageFeedbackBlock {...props}>
                  {children}
                </PageFeedbackBlock>
              ),
              Banner,
              Mermaid,
              TypeTable,
              Wrapper,
              blockquote: Callout as unknown as FC<ComponentProps<'blockquote'>>,
              DocsCategory: ({ url }) => {
                return <DocsCategory url={url ?? page.url} />;
              },
              Installation,
              Customisation,
            })}
          />
        </MdxErrorBoundary>
        {page.data.index ? <DocsCategory url={page.url} /> : null}
      </div>
      <PageFeedback />
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

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const { slug = [] } = await props.params;
  const page = source.getPage(slug);
  if (!page)
    return createMetadata({
      title: 'Not Found',
    });

  const description = page.data.description ?? 'The library for building documentation sites';

  const image = {
    url: getPageImage(page).url,
    width: 1200,
    height: 630,
  };

  return createMetadata({
    title: page.data.title,
    description,
    openGraph: {
      url: `/docs/${page.slugs.join('/')}`,
      images: [image],
    },
    twitter: {
      images: [image],
    },
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
