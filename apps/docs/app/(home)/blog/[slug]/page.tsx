import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { TOCItemType } from 'fumadocs-core/toc';
import { InlineTOC } from '@hanzo/docs/ui/components/inline-toc';
import { blog } from '@/lib/source';
import { createMetadata } from '@/lib/metadata';
import { buttonVariants } from '@/components/ui/button';
import { ShareButton } from '@/app/(home)/blog/[slug]/page.client';
import { getMDXComponents } from '@/components/mdx';
import path from 'node:path';
import { cn } from '@/lib/cn';

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

// Force static generation for GitHub Pages export
export const dynamic = 'force-static';

export default async function Page(props: BlogPageProps) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);
  const components = getMDXComponents();

  if (!page) notFound();

  // Create a clean copy of data to avoid proxy trap issues during static generation
  // The proxy wrapping by Next.js can cause ownKeys invariant violations
  const rawData = page.data as unknown as { author: string; date?: string; title: string; description?: string; load: () => Promise<{ body: React.ComponentType<{ components: object }>; toc: TOCItemType[] }> };
  const author = rawData.author;
  const date = rawData.date;
  const pageTitle = rawData.title;
  const pageDescription = rawData.description;
  const loadFn = rawData.load;
  const { body: Mdx, toc } = await loadFn();

  return (
    <article className="flex flex-col mx-auto w-full max-w-[800px] px-4 py-8">
      <div className="flex flex-row gap-4 text-sm mb-8">
        <div>
          <p className="mb-1 text-fd-muted-foreground">Written by</p>
          <p className="font-medium">{author}</p>
        </div>
        <div>
          <p className="mb-1 text-sm text-fd-muted-foreground">At</p>
          <p className="font-medium">
            {new Date(
              date ?? path.basename(page.path, path.extname(page.path)),
            ).toDateString()}
          </p>
        </div>
      </div>

      <h1 className="text-3xl font-semibold mb-4">{pageTitle}</h1>
      <p className="text-fd-muted-foreground mb-8">{pageDescription}</p>

      <div className="prose min-w-0 flex-1">
        <div className="flex flex-row items-center gap-2 mb-8 not-prose">
          <ShareButton url={page.url} />
          <Link
            href="/blog"
            className={cn(
              buttonVariants({
                size: 'sm',
                variant: 'secondary',
              }),
            )}
          >
            Back
          </Link>
        </div>

        <InlineTOC items={toc} />
        <Mdx components={components} />
      </div>
    </article>
  );
}

export async function generateMetadata(props: BlogPageProps): Promise<Metadata> {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  return createMetadata({
    title: page.data.title,
    description: page.data.description ?? 'The library for building documentation sites',
  });
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}
