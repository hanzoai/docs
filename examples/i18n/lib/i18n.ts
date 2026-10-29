import { defineI18n } from '@hanzo/docs-core/i18n';
import { applyLanguagePresets, supportedLocales } from '@hanzo/docs-language/presets';
import { uiTranslations } from '@hanzo/docs-base-ui/i18n';

export const i18n = defineI18n({
  defaultLanguage: 'en',
  languages: [...supportedLocales],
  hideLocale: 'default-locale',
  fallbackLanguage: 'en',
});

// UI chrome is enough for this example. OpenAPI and story packs stay staged
// until a site calls `.extend(openapiTranslations())` / `storyTranslations()`.
export const translations = applyLanguagePresets(i18n.translations().extend(uiTranslations()));
