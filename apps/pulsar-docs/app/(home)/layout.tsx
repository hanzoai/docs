import { HomeLayout } from '@hanzo/docs-base-ui/layouts/home';
import type { ReactNode } from 'react';
import { Footer } from '@/components/footer';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      nav={{
        title: 'Pulsar',
        url: '/',
      }}
      links={[
        { text: 'Docs', url: '/docs' },
        { text: 'GitHub', url: 'https://github.com/luxfi/pulsar' },
      ]}
    >
      {children}
      <Footer />
    </HomeLayout>
  );
}
