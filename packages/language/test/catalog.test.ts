import { describe, expect, test } from 'vitest';
import { defineI18n, withEnglishFallback } from '@hanzo/docs-core/i18n';
import { defaultTranslations as openapiDefaults } from '@hanzo/docs-openapi/i18n';
import { defaultTranslations as storyDefaults } from '@hanzo/docs-story/i18n';
import { defaultTranslations, uiTranslations } from '@hanzo/docs-ui/i18n';
import { applyLanguagePresets, languagePacks, supportedLocales } from '../src/presets';

const packs = Object.entries(languagePacks);

describe('shipped language packs', () => {
  test('covers every target locale and keeps English as the default', () => {
    expect(supportedLocales).toEqual([
      'en',
      'es',
      'fr',
      'de',
      'it',
      'pt-BR',
      'ru',
      'tr',
      'ar',
      'hi',
      'id',
      'vi',
      'th',
      'ja',
      'ko',
      'zh-CN',
      'zh-TW',
    ]);
  });

  test.each(packs)('%s translates every UI, OpenAPI, and story key', (code, load) => {
    const pack = load().value;
    expect(pack.ui && Object.keys(pack.ui).sort()).toEqual(Object.keys(defaultTranslations).sort());
    expect(pack.openapi && Object.keys(pack.openapi).sort()).toEqual(
      Object.keys(openapiDefaults).sort(),
    );
    expect(pack.story && Object.keys(pack.story).sort()).toEqual(Object.keys(storyDefaults).sort());
    expect(pack.ui!.displayName).not.toBe('English');
    expect(pack.ui!.displayName).not.toBe(code);
    expect(pack.ui!.pageActionsOpenInLLMPrompt).toContain('{url}');
    expect(pack.ui!.pageActionsEditInLLMPrompt).toContain('{url}');
    expect(pack.ui!.pageActionsEditInLLMPrompt).not.toBe(pack.ui!.pageActionsOpenInLLMPrompt);
    expect(pack.openapi!.useTypeInTypeScript).toContain('{name}');
    expect(pack.openapi!.responseTabName).toContain('{key}');
    expect(pack.openapi!.statusBinaryBody).toContain('{length}');
    expect(pack.openapi!.authBearerTokenExample).toBe('Bearer <token>');
  });
});

describe('missing keys fall back to English', () => {
  test('a partial preset keeps the English string for keys it omits', () => {
    const i18n = defineI18n({
      defaultLanguage: 'en',
      languages: ['en', 'es'],
    });
    const api = i18n
      .translations()
      .extend(uiTranslations())
      .preset('es', {
        name: 'es',
        value: { ui: { search: 'Buscar' } },
      });

    expect(api.get('es').ui.search).toBe('Buscar');
    expect(api.get('es').ui.toc).toBe(defaultTranslations.toc);
    expect(withEnglishFallback(defaultTranslations, { search: 'Buscar', toc: ' ' }).toc).toBe(
      defaultTranslations.toc,
    );
  });

  test('applyLanguagePresets fills configured locales and leaves unknown ones in English', () => {
    const i18n = defineI18n({
      defaultLanguage: 'en',
      languages: ['en', 'es', 'xx'],
    });
    const api = applyLanguagePresets(i18n.translations().extend(uiTranslations()));

    expect(api.get('es').ui.search).not.toBe(defaultTranslations.search);
    expect(api.get('xx').ui.search).toBe(defaultTranslations.search);
    expect(api.get('en').ui.displayName).toBe('English');
  });
});
