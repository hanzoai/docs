'use client';

import { defaultTranslations, type Translations } from '@/i18n';
import { withEnglishFallback } from '@hanzo/docs-core/i18n';
import { useTranslations as useTranslationsBase } from '@hanzo/docs-ui/contexts/i18n';

export function useTranslations() {
  const translated = useTranslationsBase<Translations>('story');
  return withEnglishFallback(defaultTranslations, translated);
}
