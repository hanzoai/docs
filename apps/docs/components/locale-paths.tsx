'use client';

import { createContext, use, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { i18nProvider } from '@hanzo/docs-base-ui/i18n';
import { i18n, localeOf, stripLocale, translations } from '@/lib/i18n';

const TranslatedPaths = createContext<Set<string>>(new Set());

export function useTranslatedPaths() {
  return use(TranslatedPaths);
}

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path || '/';
}

export function localeCatalog(pathname: string) {
  const locale = localeOf(pathname);
  return i18nProvider(
    translations,
    i18n.languages.includes(locale) ? locale : i18n.defaultLanguage,
  );
}

export function LocalePaths({ paths, children }: { paths: string[]; children: ReactNode }) {
  return <TranslatedPaths value={new Set(paths.map(normalizePath))}>{children}</TranslatedPaths>;
}

export function useLocaleSwitch() {
  const pathname = usePathname();
  const router = useRouter();
  const translated = useTranslatedPaths();

  return (next: string) => {
    const bare = normalizePath(stripLocale(pathname));
    if (next === i18n.defaultLanguage) {
      router.push(bare);
      return;
    }
    const target = normalizePath(`/${next}${bare === '/' ? '' : bare}`);
    router.push(translated.has(target) ? target : `/${next}/docs`);
  };
}
