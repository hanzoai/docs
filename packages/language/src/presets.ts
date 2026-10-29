import type { TranslationPreset } from '@hanzo/docs-core/i18n';
import { ar } from './ar';
import { de } from './de';
import { es } from './es';
import { fr } from './fr';
import { hi } from './hi';
import { id } from './id';
import { it } from './it';
import { ja } from './ja';
import { ko } from './ko';
import { ptBR } from './pt-br';
import { ru } from './ru';
import { th } from './th';
import { tr } from './tr';
import { vi } from './vi';
import { zhCN } from './zh-cn';
import { zhTW } from './zh-tw';

/**
 * Locale code → pack. English is the default catalog in each package and has
 * no preset. Codes match the `languages` array of `defineI18n`.
 */
export const languagePacks = {
  es,
  fr,
  de,
  it,
  'pt-BR': ptBR,
  ru,
  tr,
  ar,
  hi,
  id,
  vi,
  th,
  ja,
  ko,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
} as const;

export type LanguagePackCode = keyof typeof languagePacks;

/** English plus every shipped pack. English stays the default. */
export const supportedLocales = ['en', ...Object.keys(languagePacks)] as const;

type PresetApi = {
  config: { languages: readonly string[] };
  preset: (lang: never, pack: TranslationPreset) => PresetApi;
};

/**
 * Apply every shipped pack whose code is in `api.config.languages`.
 * Unknown codes are left on the English defaults from `extend()`.
 * Call this after `extend(uiTranslations())` (and openapi / story, if used)
 * so a missing key still resolves to English.
 */
export function applyLanguagePresets<Api extends PresetApi>(api: Api): Api {
  let current: PresetApi = api;
  for (const lang of api.config.languages) {
    const load = languagePacks[lang as LanguagePackCode];
    if (load) current = current.preset(lang as never, load());
  }
  return current as Api;
}
