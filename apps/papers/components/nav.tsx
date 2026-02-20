import Link from 'next/link';
import { organizations } from '@/lib/papers';

export function Nav({ activeOrg }: { activeOrg?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
          >
            Research Papers
          </Link>
          <nav className="flex items-center gap-1">
            {organizations.map((org) => (
              <Link
                key={org.id}
                href={`/${org.id}`}
                className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
                  activeOrg === org.id
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                {org.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
