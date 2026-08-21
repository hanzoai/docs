import type { MetadataRoute } from 'next';
import { baseUrl } from '@/lib/metadata';
import { source } from '@/lib/source';

export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string): string => new URL(path, baseUrl).toString();
  const items = await Promise.all(
    source.getPages().map(async (page) => {
      // Every page, with no type excluded. This skipped `openapi` pages, which
      // was correct while a second source mounted the reference as its own page
      // type -- and it is what kept the whole API reference out of the sitemap.
      // There is one source now, so the filter could only ever remove pages that
      // should be listed.
      const { lastModified } = await page.data.load();

      return {
        url: url(page.url),
        lastModified: lastModified ? new Date(lastModified) : undefined,
        changeFrequency: 'weekly',
        priority: 0.5,
      } as MetadataRoute.Sitemap[number];
    }),
  );

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
    },
    ...items.filter((v) => v !== undefined),
  ];
}
