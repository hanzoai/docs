import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: 'Pulsar',
        url: '/',
      }}
      links={[
        { text: 'GitHub', url: 'https://github.com/luxfi/pulsar' },
        { text: 'Spec PDF', url: 'https://github.com/luxfi/pulsar/blob/main/spec/pulsar.pdf' },
      ]}
    >
      {children}
    </DocsLayout>
  );
}
