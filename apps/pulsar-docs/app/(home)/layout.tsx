import { HomeLayout } from '@fumadocs/base-ui/layouts/home';
import type { ReactNode } from 'react';

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
    </HomeLayout>
  );
}
