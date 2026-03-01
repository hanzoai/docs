import { HomeLayout } from '@hanzo/docs-base-ui/layouts/home';
import type { LinkItemType } from '@hanzo/docs-base-ui/layouts/shared';
import type { ReactNode } from 'react';

// ── Logo (matches zenlm.org exactly) ──────────────────────────────────────
const ZenLogo: ReactNode = (
  <>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
      <path d="M32 8 C32 8 27 22 27 34 C27 39 29 44 32 48 C35 44 37 39 37 34 C37 22 32 8 32 8Z" fill="#A855F7"/>
      <path d="M32 48 C29 44 22 40 17 38 C12 36 7 37 4 40 C7 47 14 52 21 52 C27 52 31 50 32 48Z" fill="#C084FC" opacity="0.9"/>
      <path d="M32 48 C35 44 42 40 47 38 C52 36 57 37 60 40 C57 47 50 52 43 52 C37 52 33 50 32 48Z" fill="#C084FC" opacity="0.9"/>
      <path d="M10 55 C18 52 26 50 32 50 C38 50 46 52 54 55" stroke="#9333EA" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
    <span className="text-lg font-bold">Zen LM</span>
  </>
);

const GitHubIcon = (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const links: LinkItemType[] = [
  { text: 'Models', url: 'https://zenlm.org/docs/models', external: true },
  { text: 'API', url: 'https://zenlm.org/docs/api', external: true },
  { text: 'Pricing', url: 'https://zenlm.org/docs/api/pricing', external: true },
  {
    type: 'icon',
    url: 'https://github.com/zenlm',
    label: 'GitHub',
    text: 'GitHub',
    icon: GitHubIcon,
    external: true,
  },
  { text: 'Login', url: 'https://hanzo.id', external: true },
  { type: 'button', text: 'Try Zen', url: 'https://hanzo.chat', external: true },
];

// ── Paper data ─────────────────────────────────────────────────────────────
const papers = [
  {
    id: 'family-overview',
    title: 'The Zen AI Model Family',
    subtitle: 'Democratizing AI Through Efficient Architecture',
    abstract: 'Technical overview of the full Zen model family and architecture whitepaper covering 600M to 1T+ parameters.',
    pdfUrl: 'https://github.com/zenlm/papers/raw/main/pdfs/zen_family_overview.pdf',
    githubUrl: 'https://github.com/zenlm/papers',
    date: '2025-01-15',
    tags: ['Overview', 'Architecture', 'Model Family'],
    relatedLinks: [
      { label: 'Model Hub', url: 'https://huggingface.co/zenlm' },
      { label: 'Documentation', url: 'https://zenlm.org' },
    ],
  },
  {
    id: 'coder',
    title: 'Zen Coder: Agentic Code Generation',
    subtitle: '4B–1T Parameter Code Generation',
    abstract: 'Code generation models with agentic capabilities across parameter scales from 4B to 1T.',
    pdfUrl: 'https://github.com/zenlm/papers/raw/main/pdfs/zen-coder_whitepaper.pdf',
    githubUrl: 'https://github.com/zenlm/papers',
    date: '2025-01-20',
    tags: ['Coder', 'Code Generation', 'Agentic'],
  },
  {
    id: 'omni',
    title: 'Zen-Omni: Multimodal Text Model',
    subtitle: 'Multimodal Text Understanding and Generation',
    abstract: 'Multimodal text understanding and generation across modalities in a unified architecture.',
    pdfUrl: 'https://github.com/zenlm/papers/raw/main/pdfs/zen-omni_whitepaper.pdf',
    githubUrl: 'https://github.com/zenlm/papers',
    date: '2025-01-22',
    tags: ['Omni', 'Multimodal', 'Text'],
  },
  {
    id: 'next',
    title: 'Zen-Next: Flagship Model',
    subtitle: 'Next-Generation Frontier Model',
    abstract: 'Flagship model technical report covering architecture innovations and benchmark results.',
    pdfUrl: 'https://github.com/zenlm/papers/raw/main/pdfs/zen-next_whitepaper.pdf',
    githubUrl: 'https://github.com/zenlm/papers',
    date: '2025-02-01',
    tags: ['Flagship', 'Next-Gen', 'Model'],
  },
  {
    id: 'nano',
    title: 'Zen-Nano: Mobile and IoT Intelligence',
    subtitle: 'Ultra-Efficient Models for Edge Deployment',
    abstract: 'Ultra-efficient models for mobile and IoT deployment with minimal resource requirements.',
    pdfUrl: 'https://github.com/zenlm/papers/raw/main/pdfs/zen-nano_whitepaper.pdf',
    githubUrl: 'https://github.com/zenlm/papers',
    date: '2025-01-25',
    tags: ['Nano', 'Mobile', 'Edge'],
  },
  {
    id: 'eco',
    title: 'Zen-Eco: Consumer Hardware Models',
    subtitle: 'Optimized for Consumer-Grade Hardware',
    abstract: 'Models optimized for consumer-grade hardware with excellent quality-to-compute ratio.',
    pdfUrl: 'https://github.com/zenlm/papers/raw/main/pdfs/zen-eco_whitepaper.pdf',
    githubUrl: 'https://github.com/zenlm/papers',
    date: '2025-01-25',
    tags: ['Eco', 'Consumer', 'Efficient'],
  },
  {
    id: 'artist',
    title: 'Zen-Artist: Text-to-Image Generation',
    subtitle: 'High-Quality Image Synthesis',
    abstract: 'Text-to-image generation model with high-quality synthesis and fine-grained artistic control.',
    pdfUrl: 'https://github.com/zenlm/papers/raw/main/pdfs/zen-artist_whitepaper.pdf',
    githubUrl: 'https://github.com/zenlm/papers',
    date: '2025-01-28',
    tags: ['Artist', 'Text-to-Image', 'Generation'],
  },
  {
    id: 'artist-edit',
    title: 'Zen-Artist-Edit: Image Editing',
    subtitle: 'Instruction-Following Image Editing and Inpainting',
    abstract: 'Image editing and inpainting with instruction-following for precise, controllable modifications.',
    pdfUrl: 'https://github.com/zenlm/papers/raw/main/pdfs/zen-artist-edit_whitepaper.pdf',
    githubUrl: 'https://github.com/zenlm/papers',
    date: '2025-01-28',
    tags: ['Artist', 'Image Editing', 'Inpainting'],
  },
  {
    id: 'designer-instruct',
    title: 'Zen-Designer: Design Generation',
    subtitle: 'Instruction-Following Design Model',
    abstract: 'Instruction-following design generation for professional creative workflows.',
    pdfUrl: 'https://github.com/zenlm/papers/raw/main/pdfs/zen-designer-instruct_whitepaper.pdf',
    githubUrl: 'https://github.com/zenlm/papers',
    date: '2025-01-30',
    tags: ['Designer', 'Instruct', 'Design'],
  },
  {
    id: 'designer-thinking',
    title: 'Zen-Designer-Thinking: Visual Reasoning',
    subtitle: 'Visual Reasoning and Design Analysis',
    abstract: 'Visual reasoning and analysis for design tasks with chain-of-thought design understanding.',
    pdfUrl: 'https://github.com/zenlm/papers/raw/main/pdfs/zen-designer-thinking_whitepaper.pdf',
    githubUrl: 'https://github.com/zenlm/papers',
    date: '2025-01-30',
    tags: ['Designer', 'Visual Reasoning', 'Analysis'],
  },
  {
    id: 'scribe',
    title: 'Zen-Scribe: Speech Recognition',
    subtitle: 'Multi-Language Speech-to-Text',
    abstract: 'Speech recognition and transcription with multi-language support and high accuracy.',
    pdfUrl: 'https://github.com/zenlm/papers/raw/main/pdfs/zen-scribe_whitepaper.pdf',
    githubUrl: 'https://github.com/zenlm/papers',
    date: '2025-02-01',
    tags: ['Scribe', 'Speech', 'Transcription'],
  },
  {
    id: 'guard',
    title: 'Zen-Guard: Safety Moderation',
    subtitle: 'Multilingual AI Safety and Content Moderation',
    abstract: 'Safety and content moderation across languages for responsible AI deployment.',
    pdfUrl: 'https://github.com/zenlm/papers/raw/main/pdfs/zen-guard_whitepaper.pdf',
    githubUrl: 'https://github.com/zenlm/papers',
    date: '2025-02-05',
    tags: ['Guard', 'Safety', 'Moderation'],
  },
  {
    id: 'reranker',
    title: 'Zen-Reranker: 7680-Dim Embeddings',
    subtitle: 'Semantic Optimization with BitDelta Compression',
    abstract: 'High-dimensional embeddings with BitDelta compression for semantic search and retrieval.',
    pdfUrl: 'https://github.com/zenlm/papers/raw/main/pdfs/zen-reranker.pdf',
    githubUrl: 'https://github.com/zenlm/papers',
    date: '2025-02-10',
    tags: ['Reranker', 'Embeddings', 'BitDelta'],
  },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function PaperCard({ paper }: { paper: typeof papers[0] }) {
  return (
    <div className="group flex flex-col rounded-xl border border-fd-border bg-fd-card overflow-hidden transition-colors hover:border-fd-primary/50">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-violet-400" />

      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Date */}
        <p className="text-xs text-fd-muted-foreground">{formatDate(paper.date)}</p>

        {/* Title + subtitle */}
        <div>
          <h3 className="text-base font-semibold leading-snug text-fd-foreground group-hover:text-fd-primary transition-colors">
            {paper.title}
          </h3>
          <p className="text-sm text-fd-muted-foreground mt-0.5">{paper.subtitle}</p>
        </div>

        {/* Abstract */}
        <p className="text-sm text-fd-muted-foreground leading-relaxed flex-1">{paper.abstract}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {paper.tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-md bg-fd-accent/60 px-2 py-0.5 text-xs font-medium text-fd-accent-foreground"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <a
            href={paper.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            Read PDF
          </a>
          <a
            href={paper.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-fd-border bg-fd-muted px-4 py-2 text-sm font-medium text-fd-foreground hover:border-fd-primary/50 hover:text-fd-primary transition-colors"
          >
            GitHub
          </a>
        </div>

        {/* Related links */}
        {'relatedLinks' in paper && paper.relatedLinks && paper.relatedLinks.length > 0 && (
          <div className="pt-1 border-t border-fd-border">
            <p className="text-xs text-fd-muted-foreground mb-1">Related:</p>
            <div className="flex flex-col gap-0.5">
              {paper.relatedLinks.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-fd-primary hover:underline"
                >
                  {l.label} →
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <HomeLayout
      nav={{ title: ZenLogo, url: 'https://zenlm.org' }}
      links={links}
      themeSwitch={{ enabled: false }}
    >
      <div className="container max-w-[1200px] mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold tracking-tight text-fd-foreground sm:text-5xl">
            Research Papers
          </h1>
          <p className="mt-4 text-lg text-fd-muted-foreground max-w-2xl mx-auto">
            Technical whitepapers for the Zen model family — frontier AI from 600M to 1T+ parameters,
            co-developed by Hanzo AI and Zoo Labs.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            <a
              href="https://github.com/zenlm/papers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-muted px-4 py-2 text-sm font-medium text-fd-foreground hover:border-fd-primary/50 hover:text-fd-primary transition-colors"
            >
              {GitHubIcon && (
                <span className="h-4 w-4 [&>svg]:h-4 [&>svg]:w-4 flex items-center">{GitHubIcon}</span>
              )}
              zenlm/papers
            </a>
            <a
              href="https://huggingface.co/zenlm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 transition-colors"
            >
              Model Hub →
            </a>
          </div>
        </div>

        {/* Papers grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {papers.map((p) => (
            <PaperCard key={p.id} paper={p} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center border-t border-fd-border pt-8">
          <p className="text-sm text-fd-muted-foreground">
            All papers © Hanzo AI Inc and Zoo Labs Foundation.{' '}
            <a href="https://zenlm.org" className="text-fd-primary hover:underline">
              zenlm.org
            </a>
          </p>
        </div>
      </div>
    </HomeLayout>
  );
}
