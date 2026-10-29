'use client';
import { defaultTranslations, type Translations } from '@/i18n';
import {
  renderTranslation,
  withEnglishFallback,
  type TranslationValue,
} from '@hanzo/docs-core/i18n';
import { useTranslations as useTranslationsBase } from '@hanzo/docs-ui/contexts/i18n';

export function useTranslations(): Translations {
  const translated = useTranslationsBase('openapi') as Partial<Translations> | undefined;
  return withEnglishFallback(defaultTranslations, translated);
}

/**
 * Renders a translated string. Use in server components so the label is resolved on the client from the current locale.
 */
export function I18nLabel<K extends keyof Translations>({
  label,
  replacements,
}: {
  label: K;
  replacements?: Translations[K] extends TranslationValue<infer Params>
    ? Record<Params, string>
    : never;
}): string {
  const text = useTranslations();
  return renderTranslation(text[label] as TranslationValue<never>, replacements!);
}
