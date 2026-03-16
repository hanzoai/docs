import type { BaseLayoutProps } from '@hanzo/docs-ui/layouts/shared';

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    nav: {
      title: 'Waku',
      url: `/${locale}`,
    },
    LanguageSwitch: true,
  };
}
