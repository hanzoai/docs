import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocsArticle } from '@/app/docs/[[...slug]]/page';
import { createMetadata } from '@/lib/metadata';
import { i18n } from '@/lib/i18n';
import { alternatesForDocs } from '@/lib/locale-seo';
import { source } from '@/lib/source';

export const dynamicParams = false;

export default async function Page(props: PageProps<'/[lang]/docs/[[...slug]]'>) {
  const { lang, slug = [] } = await props.params;
  if (!i18n.languages.includes(lang) || lang === i18n.defaultLanguage) notFound();
  return <DocsArticle slug={slug} locale={lang} />;
}

export async function generateMetadata(
  props: PageProps<'/[lang]/docs/[[...slug]]'>,
): Promise<Metadata> {
  const { lang, slug = [] } = await props.params;
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  return createMetadata({
    title: page.data.title,
    description: page.data.description ?? 'Hanzo AI Cloud documentation',
    alternates: { languages: alternatesForDocs(slug) },
    openGraph: {
      url: page.url,
    },
  });
}

export function generateStaticParams() {
  return i18n.languages
    .filter((lang) => lang !== i18n.defaultLanguage)
    .flatMap((lang) =>
      source.getPages(lang).map((page) => ({
        lang,
        slug: page.slugs,
      })),
    );
}
