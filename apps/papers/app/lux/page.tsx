import { Nav } from '@/components/nav';
import { PaperCard } from '@/components/paper-card';
import { getOrganization } from '@/lib/papers';
import { notFound } from 'next/navigation';
import { Github } from 'lucide-react';

export const metadata = {
  title: 'Lux Network',
  description: 'Research papers from Lux Network — post-quantum blockchain, consensus, and cryptography.',
};

export default function LuxPage() {
  const org = getOrganization('lux');
  if (!org) notFound();

  return (
    <>
      <Nav activeOrg="lux" />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">
            {org.fullName}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-3">
            {org.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <span>{org.papers.length} papers</span>
            <a
              href={`https://github.com/${org.repo}`}
              className="inline-flex items-center gap-1.5 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              {org.repo}
            </a>
          </div>
        </div>

        <div className="grid gap-3">
          {org.papers.map((paper) => (
            <PaperCard key={paper.slug} paper={paper} org={org} />
          ))}
        </div>
      </main>
    </>
  );
}
