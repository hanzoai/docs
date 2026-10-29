import { localeAlternates } from '@hanzo/docs-core/i18n';
import { baseUrl } from '@/lib/metadata';
import { i18n, isNativeTranslation } from '@/lib/i18n';
import { blog, source } from '@/lib/source';

function pathnameFor(base: string, slugs: string[]): string {
  return slugs.length === 0 ? base : `${base}/${slugs.join('/')}`;
}

function localesFor(
  slugs: string[],
  loader: {
    getPage: (
      slugs: string[],
      locale?: string,
    ) => { locale?: string; absolutePath?: string } | undefined;
  },
): string[] {
  const locales = [i18n.defaultLanguage];
  for (const lang of i18n.languages) {
    if (lang === i18n.defaultLanguage) continue;
    const page = loader.getPage(slugs, lang);
    if (page && isNativeTranslation(page)) locales.push(lang);
  }
  return locales;
}

export function alternatesForDocs(slugs: string[] = []): Record<string, string> {
  return localeAlternates({
    locales: localesFor(slugs, source),
    defaultLocale: i18n.defaultLanguage,
    pathname: pathnameFor('/docs', slugs),
    hideLocale: i18n.hideLocale,
    origin: baseUrl.origin,
    trailingSlash: true,
  });
}

export function alternatesForBlog(slug: string): Record<string, string> {
  return localeAlternates({
    locales: localesFor([slug], blog),
    defaultLocale: i18n.defaultLanguage,
    pathname: `/blog/${slug}`,
    hideLocale: i18n.hideLocale,
    origin: baseUrl.origin,
    trailingSlash: true,
  });
}

/** Localized URLs that are real translations, used by the language switcher. */
export function translatedPathnames(): string[] {
  const paths: string[] = [];
  for (const lang of i18n.languages) {
    if (lang === i18n.defaultLanguage) continue;
    for (const page of source.getPages(lang)) paths.push(page.url);
    for (const page of blog.getPages(lang)) paths.push(page.url);
  }
  return paths;
}
