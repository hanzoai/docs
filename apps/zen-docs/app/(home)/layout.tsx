import { HomeLayout } from '@hanzo/docs-base-ui/layouts/home';
import type { ReactNode } from 'react';
import type { BaseLayoutProps, LinkItemType } from '@hanzo/docs-base-ui/layouts/shared';

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
        <>
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
            <path d="M32 8 C32 8 27 22 27 34 C27 39 29 44 32 48 C35 44 37 39 37 34 C37 22 32 8 32 8Z" fill="#A855F7"/>
            <path d="M32 48 C29 44 22 40 17 38 C12 36 7 37 4 40 C7 47 14 52 21 52 C27 52 31 50 32 48Z" fill="#C084FC" opacity="0.9"/>
            <path d="M32 48 C35 44 42 40 47 38 C52 36 57 37 60 40 C57 47 50 52 43 52 C37 52 33 50 32 48Z" fill="#C084FC" opacity="0.9"/>
            <path d="M10 55 C18 52 26 50 32 50 C38 50 46 52 54 55" stroke="#9333EA" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </svg>
          <span className="text-lg font-bold">Zen LM</span>
        </>
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
    <HomeLayout {...baseOptions()} themeSwitch={{ enabled: false }}>
      {children}
    </HomeLayout>
  );
}
