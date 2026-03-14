import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { baseUrl } from '@/lib/metadata';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, baseUrl).toString();

  return [
    {
      url: url('/'),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: url('/docs'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...source.getPages().map((page) => ({
      url: url(page.url),
      lastModified: page.data.lastModified
        ? new Date(page.data.lastModified)
        : undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
