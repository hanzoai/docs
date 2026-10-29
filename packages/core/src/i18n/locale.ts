/**
 * Locales written right to left. Matched on the BCP 47 primary language subtag,
 * so `ar` and `ar-SA` both resolve to RTL.
 */
export const RTL_LOCALES = ['ar', 'fa', 'he', 'ur', 'ps', 'dv', 'yi'] as const;

export type HideLocale = 'always' | 'default-locale' | 'never';

export function directionOf(locale?: string | null): 'ltr' | 'rtl' {
  if (!locale) return 'ltr';
  const base = locale.toLowerCase().split('-')[0] ?? '';
  return (RTL_LOCALES as readonly string[]).includes(base) ? 'rtl' : 'ltr';
}

/** BCP 47 tag for `<html lang>`. Locale codes in this framework are already BCP 47. */
export function htmlLang(locale?: string | null): string {
  if (!locale) return 'en';
  return locale;
}

export function localeFromPathname(
  pathname: string,
  languages: readonly string[],
  defaultLanguage: string,
): string {
  const segment = pathname.split('/').filter((part) => part.length > 0)[0];
  if (segment && languages.includes(segment)) return segment;
  return defaultLanguage;
}

export function localePath(
  locale: string,
  pathname: string,
  options: {
    defaultLocale: string;
    hideLocale?: HideLocale;
    trailingSlash?: boolean;
  },
): string {
  const hide =
    options.hideLocale === 'always' ||
    (options.hideLocale === 'default-locale' && locale === options.defaultLocale);
  const bare = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const prefixed = hide ? bare : `/${locale}${bare === '/' ? '' : bare}`;
  let path = prefixed.replaceAll(/\/{2,}/g, '/') || '/';
  if (options.trailingSlash && path !== '/' && !path.endsWith('/')) path += '/';
  if (!options.trailingSlash && path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  return path;
}

/**
 * `hreflang` map for `<link rel="alternate">` and sitemap `alternates.languages`.
 * `pathname` is the path without a locale prefix (`/docs/quickstart`).
 */
export function localeAlternates(options: {
  locales: readonly string[];
  defaultLocale: string;
  pathname: string;
  hideLocale?: HideLocale;
  origin?: string;
  trailingSlash?: boolean;
}): Record<string, string> {
  const origin = (options.origin ?? '').replace(/\/$/, '');
  const languages: Record<string, string> = {};

  for (const locale of options.locales) {
    const path = localePath(locale, options.pathname, options);
    languages[locale] = `${origin}${path}`;
  }

  const fallback = languages[options.defaultLocale];
  if (fallback) languages['x-default'] = fallback;
  return languages;
}

/**
 * Fill gaps in a locale catalog from the English source.
 * Empty strings count as missing so a half-written pack cannot blank a label.
 */
export function withEnglishFallback<T extends Record<string, string>>(
  defaults: T,
  translated?: Partial<T> | null,
): T {
  if (!translated) return { ...defaults };
  const out = { ...defaults };

  for (const key of Object.keys(defaults)) {
    const value = translated[key];
    if (typeof value === 'string' && value.trim() !== '') {
      out[key as keyof T] = value as T[keyof T];
    }
  }

  return out;
}
