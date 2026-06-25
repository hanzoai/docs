import { DocsLayout } from '@hanzo/docs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: 'Hanzo Insights',
        url: '/',
      }}
      sidebar={{
        banner: (
          <div className="p-3 rounded-lg border border-fd-border bg-fd-muted text-sm">
            <strong>45+ Products</strong> — Self-hosted product analytics
          </div>
        ),
      }}
      links={[
        { text: 'GitHub', url: 'https://github.com/hanzoai/insights' },
        { text: 'Dashboard', url: 'https://insights-app.hanzo.ai' },
      ]}
    >
      {children}
    </DocsLayout>
  );
}
