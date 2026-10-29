'use client';
import { createContext, type ReactNode, use, useMemo, useRef } from 'react';
import { usePathname, useRouter } from '@hanzo/docs-core/framework';
import {
  renderTranslation,
  withEnglishFallback,
  type HideLocale,
  type TranslationObject,
  type TranslationValue,
} from '@hanzo/docs-core/i18n';
import { defaultTranslations, type Translations } from '@/i18n';

interface LocaleItem {
  name: string;
  locale: string;
}

interface I18nContextType {
  text: Translations & Record<string, string | Record<string, string>>;
  locale?: string;
  onChange?: (v: string) => void;
  locales?: LocaleItem[];
}

const I18nContext = createContext<I18nContextType>({
  text: defaultTranslations,
});

export function I18nLabel<K extends keyof Translations = keyof Translations>({
  label,
  params,
}: {
  label: K;
  params?: Translations[K] extends TranslationValue<infer Params> ? Record<Params, string> : never;
}): string {
  const t = useTranslations();
  return renderTranslation(t[label], params!);
}

export function useI18n(): I18nContextType {
  return use(I18nContext);
}

export function useTranslations<Obj extends TranslationObject = Translations>(
  namespace?: string,
): Obj {
  const { text } = use(I18nContext);
  return (namespace ? text[namespace] : text) as unknown as Obj;
}

export interface I18nProviderProps {
  /**
   * Current locale
   */
  locale?: string;

  /**
   * Handle changes to the locale, redirect user when not specified.
   */
  onLocaleChange?: (v: string) => void;

  /**
   * Translations of current locale
   */
  translations?: Partial<I18nContextType['text']>;

  /**
   * Available languages
   */
  locales?: LocaleItem[];

  /**
   * When the default locale is hidden from the URL, switching back to it
   * removes the prefix instead of navigating to `/${defaultLocale}/...`.
   */
  hideLocale?: HideLocale;
  defaultLocale?: string;

  children?: ReactNode;
}

function mergeCatalog(translations?: Partial<I18nContextType['text']>): I18nContextType['text'] {
  const flat: Partial<Translations> = {};
  const nested: Record<string, string | Record<string, string>> = {};

  if (translations) {
    for (const [key, value] of Object.entries(translations)) {
      if (typeof value === 'string') flat[key as keyof Translations] = value as never;
      else if (value && typeof value === 'object') nested[key] = value;
    }
  }

  return {
    ...withEnglishFallback(defaultTranslations, flat),
    ...nested,
  };
}

export function I18nProvider({
  locales = [],
  locale,
  onLocaleChange,
  children,
  translations,
  hideLocale,
  defaultLocale,
}: I18nProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const onChange = (value: string) => {
    if (onLocaleChange) {
      return onLocaleChange(value);
    }
    const segments = pathname.split('/').filter((v) => v.length > 0);

    // If locale prefix hidden
    if (segments.length === 0 || segments[0] !== locale) {
      segments.unshift(value);
    } else {
      segments[0] = value;
    }

    const hidePrefix =
      hideLocale === 'always' || (hideLocale === 'default-locale' && value === defaultLocale);
    if (hidePrefix && segments[0] === value) segments.shift();

    const next = `/${segments.join('/')}`;
    router.push(next === '/' ? '/' : next);
  };
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  return (
    <I18nContext
      value={useMemo(
        () => ({
          locale,
          locales,
          text: mergeCatalog(translations),
          onChange: (v) => onChangeRef.current(v),
        }),
        [locale, locales, translations],
      )}
    >
      {children}
    </I18nContext>
  );
}
