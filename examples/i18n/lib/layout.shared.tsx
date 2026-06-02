import type { BaseLayoutProps } from '@hanzo/docs/ui/layouts/shared';
import { i18n } from '@/lib/i18n';
import { defineI18nUI } from '@hanzo/docs-ui/i18n';

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .preset('cn', zhTW())
  .add('ui', {
    cn: {
      displayName: 'Chinese',
    },
  });

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    nav: {
      title: locale === 'cn' ? 'Chinese Docs' : 'English Docs',
      url: `/${locale}`,
    },
    githubUrl: 'https://github.com',
    links: [
      {
        type: 'main',
        text: locale === 'cn' ? '文檔' : 'Documentation',
        url: `/${locale}/docs`,
      },
    ],
  };
}
