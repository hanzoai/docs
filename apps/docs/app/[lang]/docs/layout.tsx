import { notFound } from 'next/navigation';
import { Docs } from '@/components/layouts/docs';
import { Footer } from '@/components/footer';
import { i18n } from '@/lib/i18n';

export default async function Layout({ params, children }: LayoutProps<'/[lang]/docs'>) {
  const { lang } = await params;
  if (!i18n.languages.includes(lang) || lang === i18n.defaultLanguage) notFound();

  return (
    <>
      <Docs locale={lang}>{children}</Docs>
      <div className="pt-16 md:pt-24">
        <Footer />
      </div>
    </>
  );
}
