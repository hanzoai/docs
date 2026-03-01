import { HomeLayout } from '@hanzo/docs-base-ui/layouts/home';
import type { ReactNode } from 'react';
import type { BaseLayoutProps, LinkItemType } from '@hanzo/docs-base-ui/layouts/shared';
import { ZenEnso } from '@/components/ZenEnso';

const linkItems: LinkItemType[] = [
  {
    text: 'Models',
    url: '/docs/models',
    active: 'nested-url',
  },
  {
    text: 'API',
    url: '/docs/api',
    active: 'nested-url',
  },
  {
    text: 'Pricing',
    url: '/docs/api/pricing',
  },
  {
    text: 'Training',
    url: '/docs/training',
    active: 'nested-url',
  },
  {
    type: 'icon',
    url: 'https://huggingface.co/zenlm',
    label: 'HuggingFace',
    text: 'HuggingFace',
    icon: (
      <svg role="img" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.163 5.04c.687 0 1.244.558 1.244 1.244 0 .687-.557 1.244-1.244 1.244a1.244 1.244 0 1 1 0-2.488zm2.326 0c.687 0 1.244.558 1.244 1.244 0 .687-.557 1.244-1.244 1.244a1.244 1.244 0 1 1 0-2.488zM7.2 8.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zm9.6 0a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zm-8.16 5.04c.168-.024.336.072.408.24.696 1.608 2.04 2.52 3.72 2.52s3.024-.912 3.72-2.52a.39.39 0 0 1 .504-.216.39.39 0 0 1 .216.504C16.44 15.84 14.856 16.92 12.768 16.92c-2.088 0-3.672-1.08-4.44-2.952a.39.39 0 0 1 .312-.528z" />
      </svg>
    ),
    external: true,
  },
  {
    type: 'icon',
    url: 'https://github.com/zenlm',
    label: 'GitHub',
    text: 'GitHub',
    icon: (
      <svg role="img" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
    external: true,
  },
];

function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2">
          <ZenEnso size={28} animate={false} />
          <span className="text-lg font-bold">Zen LM</span>
        </span>
      ),
      url: '/',
    },
    links: [
      ...linkItems,
      {
        text: 'Login',
        url: 'https://hanzo.id',
        external: true,
      },
      {
        type: 'button',
        text: 'Try Zen',
        url: 'https://hanzo.chat',
        external: true,
      },
    ],
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout {...baseOptions()}>
      {children}
    </HomeLayout>
  );
}
