import { Nav } from '@/components/nav';
import { OrgCard } from '@/components/org-card';
import { organizations } from '@/lib/papers';
import { FileText, Github } from 'lucide-react';

export default function HomePage() {
  const totalPapers = organizations.reduce(
    (sum, org) => sum + org.papers.length,
    0,
  );

  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-3">
            Research Papers
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl">
            {totalPapers} open-access papers across AI infrastructure, blockchain
            consensus, decentralized science, and frontier language models.
          </p>
        </div>

        <div className="grid gap-4 mb-12">
          {organizations.map((org) => (
            <OrgCard key={org.id} org={org} />
          ))}
        </div>

        <div className="flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-500">
          <span className="inline-flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            All papers are open access under CC BY 4.0
          </span>
          <a
            href="https://github.com/hanzoai"
            className="inline-flex items-center gap-1.5 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>
      </main>
    </>
  );
}
