import Link from 'next/link';

const columns = [
  {
    title: 'Products',
    links: [
      { label: 'Cloud', href: 'https://cloud.hanzo.ai' },
      { label: 'Chat', href: 'https://hanzo.chat' },
      { label: 'Bot', href: 'https://hanzo.bot' },
      { label: 'Dev', href: 'https://dev.hanzo.ai' },
      { label: 'Flow', href: 'https://flow.hanzo.ai' },
      { label: 'Console', href: 'https://console.hanzo.ai' },
      { label: 'Platform', href: 'https://platform.hanzo.ai' },
      { label: 'Space', href: 'https://hanzo.space' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'Documentation', href: '/docs/services' },
      { label: 'API Reference', href: '/docs/openapi' },
      { label: 'SDKs', href: '/docs/sdks' },
      { label: 'GitHub', href: 'https://github.com/hanzoai' },
      { label: 'Status', href: 'https://status.hanzo.ai' },
    ],
  },
  {
    title: 'Models',
    links: [
      { label: 'Zen Models', href: '/docs/llm' },
      { label: 'Zen Coder', href: '/docs/llm' },
      { label: 'Zen Ultra', href: '/docs/llm' },
      { label: 'View All', href: '/docs/llm' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: 'https://hanzo.ai/about' },
      { label: 'Blog', href: 'https://hanzo.ai/blog' },
      { label: 'Careers', href: 'https://hanzo.ai/careers' },
      { label: 'Contact', href: 'https://hanzo.ai/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms', href: 'https://hanzo.ai/terms' },
      { label: 'Privacy', href: 'https://hanzo.ai/privacy' },
      { label: 'Security', href: 'https://hanzo.ai/security' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#262626] bg-[#0a0a0a]">
      <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-sm font-semibold text-[#fafafa]">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('http') ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-sm text-[#a3a3a3] hover:text-[#fafafa] transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-[#a3a3a3] hover:text-[#fafafa] transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#262626] pt-8 md:flex-row">
          <div className="flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              className="size-5 text-[#fd4444]"
              fill="currentColor"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-sm font-medium text-[#fafafa]">
              Hanzo AI
            </span>
          </div>
          <p className="text-xs text-[#525252]">
            &copy; {new Date().getFullYear()} Hanzo AI, Inc. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
