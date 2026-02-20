import Link from 'next/link';
import { ChevronRight, FileText } from 'lucide-react';
import type { Organization } from '@/lib/papers';

export function OrgCard({ org }: { org: Organization }) {
  return (
    <Link
      href={`/${org.id}`}
      className="group block rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 transition-all hover:border-neutral-400 dark:hover:border-neutral-600 hover:shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {org.name}
        </h2>
        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors" />
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
        {org.description}
      </p>
      <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-500">
        <span className="inline-flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          {org.papers.length} papers
        </span>
        <span className="text-neutral-300 dark:text-neutral-700">|</span>
        <span>{org.repo}</span>
      </div>
    </Link>
  );
}
