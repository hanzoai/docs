import '@hanzo/docs-base-ui/style.css';
import { RootProvider } from '@hanzo/docs-base-ui/provider/next';
import { Zen } from '@hanzo/font';
import { notFound } from 'next/navigation';
import { directionOf, htmlLang } from '@hanzo/docs-core/i18n';
import { i18nProvider } from '@hanzo/docs-base-ui/i18n';
import { i18n, translations } from '@/lib/i18n';

export default async function Layout({ params, children }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!i18n.languages.includes(lang)) notFound();

  return (
    <html
      lang={htmlLang(lang)}
      dir={directionOf(lang)}
      className={Zen.className}
      suppressHydrationWarning
    >
      <body
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <RootProvider i18n={i18nProvider(translations, lang)}>{children}</RootProvider>
      </body>
    </html>
  );
}
