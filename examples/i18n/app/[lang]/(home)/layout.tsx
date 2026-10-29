import { HomeLayout } from '@hanzo/docs-base-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

export default async function Layout({ params, children }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;

  return <HomeLayout {...baseOptions(lang)}>{children}</HomeLayout>;
}
