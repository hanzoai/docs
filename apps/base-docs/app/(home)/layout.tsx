import { HomeLayout } from '@hanzo/docs/ui/layouts/home';
import { baseOptions, linkItems } from '@/lib/layout.shared';
import type { ReactNode } from 'react';
import { Footer } from '@/components/footer';

export default function Layout({ children }: { children: ReactNode }) {
  const base = baseOptions();

  return (
    <HomeLayout
      {...base}
      links={linkItems}
    >
      {children}
      <Footer />
    </HomeLayout>
  );
}
