import { HomeLayout } from '@hanzo/docs-base-ui/layouts/home';
import type { ReactNode } from 'react';
import { FloatingNav } from '@/components/FloatingNav';
import { Footer } from '@/components/footer';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout nav={{ component: <FloatingNav /> }}>
      {children}
      <Footer />
    </HomeLayout>
  );
}
