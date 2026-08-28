import '@hanzo/docs-ui/style.css';
import { RootProvider } from '@hanzo/docs-ui/provider/next';
import { Zen } from '@hanzo/font/sans';
import { ZenMono } from '@hanzo/font/mono';
import { translations } from '@/lib/layout.shared';
import { i18nProvider } from '@hanzo/docs-ui/i18n';

export default async function Layout({ params, children }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  return (
    <html lang={lang} className={Zen.className} suppressHydrationWarning>
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
