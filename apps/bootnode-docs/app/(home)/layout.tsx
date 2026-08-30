import type { ReactNode } from 'react';
import { HomeLayout } from '@hanzo/docs-base-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { linkItems } from '@/lib/layout.shared';
import { Footer } from '@/components/footer';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout {...baseOptions()} links={linkItems}>
      {children}
      <Footer />
    </HomeLayout>
  );
}
