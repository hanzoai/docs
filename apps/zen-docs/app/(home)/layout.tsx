import { HomeLayout } from '@hanzo/docs-base-ui/layouts/home';
import type { ReactNode } from 'react';
import { FloatingNav } from '@/components/FloatingNav';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout nav={{ component: <FloatingNav /> }}>
      {children}
    </HomeLayout>
  );
}
