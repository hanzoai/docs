import { describe, expect, test } from 'vitest';
import {
  directionOf,
  htmlLang,
  localeAlternates,
  localeFromPathname,
  localePath,
  withEnglishFallback,
} from '../src/i18n';

describe('locale direction and html lang', () => {
  test('Arabic is RTL, including regional variants', () => {
    expect(directionOf('ar')).toBe('rtl');
    expect(directionOf('ar-SA')).toBe('rtl');
    expect(directionOf('fa')).toBe('rtl');
  });

  test('the target LTR locales stay LTR', () => {
    for (const locale of ['en', 'es', 'fr', 'de', 'pt-BR', 'zh-CN', 'ja', 'ko']) {
      expect(directionOf(locale)).toBe('ltr');
    }
    expect(directionOf(undefined)).toBe('ltr');
  });

  test('html lang keeps the BCP 47 tag', () => {
    expect(htmlLang('pt-BR')).toBe('pt-BR');
    expect(htmlLang('zh-TW')).toBe('zh-TW');
    expect(htmlLang(null)).toBe('en');
  });
});

describe('locale paths and hreflang', () => {
  const languages = ['en', 'es', 'ar'] as const;

  test('reads the locale from the first path segment', () => {
    expect(localeFromPathname('/es/docs/quickstart', languages, 'en')).toBe('es');
    expect(localeFromPathname('/docs/quickstart', languages, 'en')).toBe('en');
    expect(localeFromPathname('/ar/', languages, 'en')).toBe('ar');
  });

  test('hides the default locale and keeps the others', () => {
    expect(localePath('en', '/docs', { defaultLocale: 'en', hideLocale: 'default-locale' })).toBe(
      '/docs',
    );
    expect(localePath('es', '/docs', { defaultLocale: 'en', hideLocale: 'default-locale' })).toBe(
      '/es/docs',
    );
    expect(
      localePath('ar', '/docs/quickstart', {
        defaultLocale: 'en',
        hideLocale: 'default-locale',
        trailingSlash: true,
      }),
    ).toBe('/ar/docs/quickstart/');
  });

  test('alternate links include x-default', () => {
    const links = localeAlternates({
      locales: languages,
      defaultLocale: 'en',
      pathname: '/docs',
      hideLocale: 'default-locale',
      origin: 'https://docs.hanzo.ai',
    });

    expect(links.en).toBe('https://docs.hanzo.ai/docs');
    expect(links.es).toBe('https://docs.hanzo.ai/es/docs');
    expect(links.ar).toBe('https://docs.hanzo.ai/ar/docs');
    expect(links['x-default']).toBe(links.en);
  });
});

describe('English fallback for missing keys', () => {
  const english = { search: 'Search', toc: 'On this page', empty: 'Empty' };

  test('keeps translated keys and fills the rest from English', () => {
    expect(withEnglishFallback(english, { search: 'Buscar', toc: '' })).toEqual({
      search: 'Buscar',
      toc: 'On this page',
      empty: 'Empty',
    });
  });

  test('a missing catalog is the English catalog', () => {
    expect(withEnglishFallback(english, undefined)).toEqual(english);
  });
});
