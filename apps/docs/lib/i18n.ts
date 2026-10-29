import { defineI18n, localeFromPathname } from '@hanzo/docs-core/i18n';
import { applyLanguagePresets, supportedLocales } from '@hanzo/docs-language/presets';
import { uiTranslations } from '@hanzo/docs-base-ui/i18n';
import { openapiTranslations } from '@hanzo/docs-openapi/i18n';
import { storyTranslations } from '@hanzo/docs-story/i18n';

export const i18n = defineI18n({
  defaultLanguage: 'en',
  languages: [...supportedLocales],
  hideLocale: 'default-locale',
  // Untranslated pages stay English at the unprefixed URL. A locale tree only
  // contains pages that actually have a translation, so the build does not
  // compile the corpus once per language.
  fallbackLanguage: null,
  parser: 'dot',
});

export const translations = applyLanguagePresets(
  i18n
    .translations()
    .extend(uiTranslations())
    .extend(openapiTranslations())
    .extend(storyTranslations()),
);

export function localeOf(pathname: string): string {
  return localeFromPathname(pathname, i18n.languages, i18n.defaultLanguage);
}

/** Path with a non-default locale prefix removed. */
export function stripLocale(pathname: string): string {
  const parts = pathname.split('/').filter((part) => part.length > 0);
  if (parts[0] && parts[0] !== i18n.defaultLanguage && i18n.languages.includes(parts[0])) {
    parts.shift();
  }
  if (parts.length === 0) return '/';
  return `/${parts.join('/')}`;
}

export function isNativeTranslation(page: { locale?: string; absolutePath?: string }): boolean {
  if (!page.locale || page.locale === i18n.defaultLanguage) return true;
  return (page.absolutePath ?? '').includes(`.${page.locale}.`);
}

const KNOWN = JSON.stringify(i18n.languages.filter((locale) => locale !== i18n.defaultLanguage));
const RTL = JSON.stringify(['ar', 'fa', 'he', 'ur', 'ps', 'dv', 'yi']);

/** Runs before paint so `<html lang>` and `dir` match the URL on static pages. */
export const localeBootScript = `(function(){var known=${KNOWN};var rtl=${RTL};var seg=(location.pathname.split('/').filter(Boolean)[0]||'');if(known.indexOf(seg)<0)return;document.documentElement.lang=seg;var base=seg.split('-')[0];document.documentElement.dir=rtl.indexOf(base)<0?'ltr':'rtl';})();`;
