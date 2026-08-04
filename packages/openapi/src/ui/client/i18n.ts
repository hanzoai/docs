'use client';
import { defaultTranslations, type Translations } from '@/i18n';
import { renderTranslation, type TranslationValue } from '@hanzo/docs-core/i18n';
import { useTranslations as useTranslationsBase } from '@hanzo/docs-ui/contexts/i18n';

export function useTranslations(): Translations {
  return (useTranslationsBase('openapi') as unknown as Translations | undefined) ?? defaultTranslations;
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
