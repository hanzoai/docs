import type { ReactNode } from 'react';
import { baseOptions } from '@/lib/layout.shared';
import { HomeLayout } from '@hanzo/docs/ui/layouts/home';

export default function Layout({ children }: { children: ReactNode }) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
