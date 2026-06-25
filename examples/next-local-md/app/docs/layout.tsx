import { getSource } from '@/lib/source';
import { DocsLayout } from '@hanzo/docs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default async function Layout({ children }: LayoutProps<'/docs'>) {
  const docs = await getSource();
  return (
    <DocsLayout tree={docs.getPageTree()} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
