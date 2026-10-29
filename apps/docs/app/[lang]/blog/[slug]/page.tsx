import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import path from 'node:path';
import type { TOCItemType } from '@hanzo/docs-core/toc';
import { InlineTOC } from '@hanzo/docs-base-ui/components/inline-toc';
import { blog } from '@/lib/source';
import { createMetadata } from '@/lib/metadata';
import { buttonVariants } from '@hanzo/docs-base-ui/components/ui/button';
import { ShareButton } from '@/app/(home)/blog/[slug]/page.client';
import { getMDXComponents } from '@/components/mdx';
import { cn } from '@/lib/cn';
import { i18n } from '@/lib/i18n';
import { alternatesForBlog } from '@/lib/locale-seo';
import { chrome } from '@/lib/chrome';

export const dynamicParams = false;

export default async function Page(props: PageProps<'/[lang]/blog/[slug]'>) {
  const { lang, slug } = await props.params;
  if (!i18n.languages.includes(lang) || lang === i18n.defaultLanguage) notFound();
  const page = blog.getPage([slug], lang);
  if (!page) notFound();

  const rawData = page.data as unknown as {
    author: string;
    date?: string;
    title: string;
    description?: string;
    load: () => Promise<{ body: React.ComponentType<{ components: object }>; toc: TOCItemType[] }>;
  };
  const { body: Mdx, toc } = await rawData.load();
  const text = chrome(lang);

  return (
    <article className="flex flex-col mx-auto w-full max-w-[800px] px-4 py-8">
      <div className="flex flex-row gap-4 text-sm mb-8">
        <div>
          <p className="mb-1 text-fd-muted-foreground">{rawData.author}</p>
        </div>
        <div>
          <p className="font-medium">
            {new Date(rawData.date ?? path.basename(page.path, path.extname(page.path))).toDateString()}
          </p>
        </div>
      </div>
      <h1 className="text-3xl font-semibold mb-4">{rawData.title}</h1>
      <p className="text-fd-muted-foreground mb-8">{rawData.description}</p>
      <div className="prose min-w-0 flex-1">
        <div className="flex flex-row items-center gap-2 mb-8 not-prose">
          <ShareButton url={page.url} />
          <Link href="/blog" className={cn(buttonVariants({ size: 'sm', variant: 'secondary' }))}>
            {text.returnHome}
          </Link>
        </div>
        <InlineTOC items={toc} />
        <Mdx components={getMDXComponents()} />
      </div>
    </article>
  );
}

export async function generateMetadata(
  props: PageProps<'/[lang]/blog/[slug]'>,
): Promise<Metadata> {
  const { lang, slug } = await props.params;
  const page = blog.getPage([slug], lang);
  if (!page) notFound();
  return createMetadata({
    title: page.data.title,
    description: page.data.description,
    alternates: { languages: alternatesForBlog(slug) },
  });
}

export function generateStaticParams() {
  return i18n.languages
    .filter((lang) => lang !== i18n.defaultLanguage)
    .flatMap((lang) =>
      blog.getPages(lang).map((page) => ({
        lang,
        slug: page.slugs[0] ?? '',
      })),
    );
}
