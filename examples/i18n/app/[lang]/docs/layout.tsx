import { source } from '@/lib/source';
import { DocsLayout } from '@hanzo/docs-base-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default async function Layout({ params, children }: LayoutProps<'/[lang]/docs'>) {
  const { lang } = await params;

  return (
    <DocsLayout {...baseOptions(lang)} tree={source.getPageTree(lang)}>
      {children}
    </DocsLayout>
  );
}
