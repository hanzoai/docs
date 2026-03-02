import type { ReactNode } from 'react';
import { HomeLayout } from '@hanzo/docs/ui/layouts/home';
import { baseOptions, linkItems, logo, GithubIcon } from '@/lib/layout.shared';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      {...baseOptions()}
      links={linkItems}
      nav={{
        title: (
          <>
            {logo}
            <span className="font-bold">Hanzo Visor</span>
          </>
        ),
      }}
    >
      {children}

      {/* Footer */}
      <footer className="border-t border-fd-border mt-auto py-8 px-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between text-sm text-fd-muted-foreground">
          <span>&copy; {new Date().getFullYear()} Hanzo AI, Inc.</span>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/hanzoai/visor"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fd-foreground transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon />
            </a>
          </div>
        </div>
      </footer>
    </HomeLayout>
  );
}
