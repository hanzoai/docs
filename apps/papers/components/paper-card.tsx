import { FileText, ExternalLink } from 'lucide-react';
import type { Paper, Organization } from '@/lib/papers';

export function PaperCard({
  paper,
  org,
  showOrg = false,
}: {
  paper: Paper;
  org: Organization;
  showOrg?: boolean;
}) {
  return (
    <div className="group relative rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 transition-all hover:border-neutral-400 dark:hover:border-neutral-600 hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {showOrg && (
            <span className="inline-block text-xs font-medium tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-2">
              {org.name}
            </span>
          )}
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 leading-snug mb-2">
            {paper.title}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">
            {paper.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {paper.topics.map((topic) => (
              <span
                key={topic}
                className="inline-block text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <a
            href={paper.pdf}
            className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            PDF
          </a>
          <a
            href={paper.source}
            className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            TeX
          </a>
        </div>
      </div>
    </div>
  );
}
