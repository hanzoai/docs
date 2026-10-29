import type { MetadataRoute } from 'next';
import { baseUrl } from '@/lib/metadata';
import { i18n, isNativeTranslation } from '@/lib/i18n';
import { alternatesForBlog, alternatesForDocs } from '@/lib/locale-seo';
import { blog, englishPages, englishPosts, source } from '@/lib/source';

export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string): string => new URL(path, baseUrl).toString();
  const items = await Promise.all(
    englishPages().map(async (page) => {
      const { lastModified } = await page.data.load();

      return {
        url: url(page.url),
        lastModified: lastModified ? new Date(lastModified) : undefined,
        changeFrequency: 'weekly',
        priority: 0.5,
        alternates: { languages: alternatesForDocs(page.slugs) },
      } as MetadataRoute.Sitemap[number];
    }),
  );

  const posts = englishPosts().map((page) => {
    const data = page.data as { date?: string };
    return {
      url: url(page.url),
      lastModified: data.date ? new Date(data.date) : undefined,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
      alternates: { languages: alternatesForBlog(page.slugs[0] ?? '') },
    };
  });

  const translations: MetadataRoute.Sitemap = [];
  for (const lang of i18n.languages) {
    if (lang === i18n.defaultLanguage) continue;
    for (const page of source.getPages(lang)) {
      if (!isNativeTranslation(page)) continue;
      const { lastModified } = await page.data.load();
      translations.push({
        url: url(page.url),
        lastModified: lastModified ? new Date(lastModified) : undefined,
        changeFrequency: 'weekly',
        priority: 0.4,
        alternates: { languages: alternatesForDocs(page.slugs) },
      });
    }
    for (const page of blog.getPages(lang)) {
      if (!isNativeTranslation(page)) continue;
      translations.push({
        url: url(page.url),
        changeFrequency: 'monthly',
        priority: 0.3,
        alternates: { languages: alternatesForBlog(page.slugs[0] ?? '') },
      });
    }
  }

  return [
    {
      url: url('/'),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: url('/docs'),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages: alternatesForDocs([]) },
    },
    ...items.filter((entry) => entry !== undefined),
    ...posts,
    ...translations,
  ];
}
