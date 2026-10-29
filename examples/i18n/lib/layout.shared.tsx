import type { BaseLayoutProps } from '@hanzo/docs-base-ui/layouts/shared';
import { i18n } from '@/lib/i18n';

const documentation: Record<string, string> = {
  en: 'Documentation',
  es: 'Documentación',
  fr: 'Documentation',
  de: 'Dokumentation',
  it: 'Documentazione',
  'pt-BR': 'Documentação',
  ru: 'Документация',
  tr: 'Belgeler',
  ar: 'التوثيق',
  hi: 'दस्तावेज़',
  id: 'Dokumentasi',
  vi: 'Tài liệu',
  th: 'เอกสาร',
  ja: 'ドキュメント',
  ko: '문서',
  'zh-CN': '文档',
  'zh-TW': '文件',
};

export function baseOptions(locale: string): BaseLayoutProps {
  const prefix = locale === i18n.defaultLanguage ? '' : `/${locale}`;
  return {
    nav: {
      title: locale === 'en' ? 'Hanzo Docs' : `Hanzo Docs · ${documentation[locale] ?? locale}`,
      url: prefix || '/',
    },
    githubUrl: 'https://github.com/hanzoai/docs',
    links: [
      {
        type: 'main',
        text: documentation[locale] ?? 'Documentation',
        url: `${prefix}/docs`,
      },
    ],
  };
}
