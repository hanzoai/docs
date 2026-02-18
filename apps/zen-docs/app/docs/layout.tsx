import { DocsLayout } from '@hanzo/docs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: '⚡ Zen LM',
        url: '/',
      }}
      sidebar={{
        banner: (
          <div className="p-3 rounded-lg bg-primary/10 text-sm">
            <strong>zen-coder-flash</strong> - 59.2% SWE-bench
          </div>
        ),
      }}
      links={[
        { text: 'HuggingFace', url: 'https://huggingface.co/zenlm' },
        { text: 'GitHub', url: 'https://github.com/zenlm' },
      ]}
    >
      {children}
    </DocsLayout>
  );
}
