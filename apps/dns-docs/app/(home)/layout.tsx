import type { ReactNode } from 'react';
import { HomeLayout } from '@hanzo/docs/ui/layouts/home';
import { baseOptions, linkItems, logo } from '@/lib/layout.shared';
import { Footer } from '@/components/footer';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      {...baseOptions()}
      links={linkItems}
      nav={{
        title: (
          <>
            {logo}
            <span className="font-bold">Hanzo DNS</span>
          </>
        ),
      }}
    >
      {children}
      <Footer />
    </HomeLayout>
  );
}
