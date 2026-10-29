import type { MetadataRoute } from 'next';
import { localeAlternates } from '@hanzo/docs-core/i18n';
import { i18n } from '@/lib/i18n';
import { source } from '@/lib/source';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = 'https://docs.hanzo.ai';
  const seen = new Set<string>();
  const entries: MetadataRoute.Sitemap = [
    {
      url: origin,
      alternates: {
        languages: localeAlternates({
          locales: i18n.languages,
          defaultLocale: i18n.defaultLanguage,
          pathname: '/',
          hideLocale: i18n.hideLocale,
          origin,
        }),
      },
    },
  ];

  for (const page of source.getPages(i18n.defaultLanguage)) {
    const key = page.slugs.join('/');
    if (seen.has(key)) continue;
    seen.add(key);
    const pathname = `/docs${page.slugs.length ? `/${key}` : ''}`;
    entries.push({
      url: `${origin}${pathname}`,
      alternates: {
        languages: localeAlternates({
          locales: i18n.languages,
          defaultLocale: i18n.defaultLanguage,
          pathname,
          hideLocale: i18n.hideLocale,
          origin,
        }),
      },
    });
  }

  return entries;
}
