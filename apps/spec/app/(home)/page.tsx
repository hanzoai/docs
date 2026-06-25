import Link from 'next/link';
import { cn } from '@/lib/cn';
import { cva } from 'class-variance-authority';
import { FileTextIcon, GitBranchIcon, ShieldCheckIcon } from 'lucide-react';

const headingVariants = cva('font-medium tracking-tight', {
  variants: {
    variant: {
      h1: 'text-4xl lg:text-5xl xl:text-6xl',
      h2: 'text-3xl lg:text-4xl',
      h3: 'text-xl lg:text-2xl',
    },
  },
});

const buttonVariants = cva(
  'inline-flex justify-center px-5 py-3 rounded-full font-medium tracking-tight transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-brand text-brand-foreground hover:bg-brand-200',
        secondary: 'border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent',
      },
    },
    defaultVariants: { variant: 'primary' },
  },
);

const cardVariants = cva('rounded-2xl text-sm p-6 bg-origin-border shadow-lg border bg-fd-card');

const HanzoMark = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" aria-label="Hanzo">
    <path d="M2.5 2.5h3v6.25h9V2.5h3v15h-3V11.25h-9V17.5h-3z" />
  </svg>
);

const year = new Date().getFullYear();

export default function Page() {
  return (
    <>
      <main className="text-landing-foreground pt-4 pb-6 dark:text-landing-foreground-dark md:pb-12">
        <div className="relative flex min-h-[480px] h-[56vh] max-h-[760px] border rounded-2xl overflow-hidden mx-auto w-full max-w-[1400px] bg-gradient-to-br from-brand/10 via-transparent to-brand-secondary/10">
          <div className="flex flex-col z-2 px-4 size-full md:p-12 max-md:items-center max-md:text-center">
            <div className="flex items-center gap-2 mt-12 text-xs text-brand font-medium rounded-full p-2 border border-brand/50 w-fit">
              <HanzoMark size={14} />
              Hanzo Standards · HIPs
            </div>
            <h1 className={cn(headingVariants({ variant: 'h1' }), 'my-8 leading-tight')}>
              <span className="text-brand">One source</span> of truth
              <br />
              for the ecosystem
            </h1>
            <p className="text-lg text-fd-muted-foreground max-w-2xl mb-8">
              The binding standards for Hanzo, Lux, and Zoo — protocol, interface,
              infrastructure, and process. Rendered verbatim from the canonical{' '}
              <a href="https://github.com/hanzoai/hips" className="text-brand underline underline-offset-2">hanzoai/hips</a>{' '}
              repository. This site renders them; it does not own them.
            </p>
            <div className="flex flex-row items-center justify-center gap-4 flex-wrap w-fit">
              <Link href="/docs" className={cn(buttonVariants(), 'max-sm:text-sm')}>Browse HIPs</Link>
              <a
                href="https://github.com/hanzoai/hips"
                target="_blank"
                rel="noreferrer noopener"
                className={cn(buttonVariants({ variant: 'secondary' }), 'max-sm:text-sm')}
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-12 px-6 mx-auto w-full max-w-[1400px] md:px-12 lg:grid-cols-3">
          <div className={cn(cardVariants())}>
            <FileTextIcon className="size-8 text-brand mb-4" />
            <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-3' }))}>Single source</h3>
            <p className="text-fd-muted-foreground">Every standard is authored once in <code>hanzoai/hips</code> and synced here at build time. No hand-copies to drift.</p>
          </div>
          <div className={cn(cardVariants())}>
            <ShieldCheckIcon className="size-8 text-brand mb-4" />
            <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-3' }))}>Binding</h3>
            <p className="text-fd-muted-foreground">HIPs are the normative standards — conformance is defined, not suggested. Product docs link here; they don&apos;t restate the rules.</p>
          </div>
          <div className={cn(cardVariants())}>
            <GitBranchIcon className="size-8 text-brand mb-4" />
            <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-3' }))}>Versioned</h3>
            <p className="text-fd-muted-foreground">Each proposal carries its status and lineage. The repo is the history; this is the reading room.</p>
          </div>
        </div>
      </main>

      <footer className="border-t py-10 px-6 mx-auto w-full max-w-[1400px] md:px-12">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <HanzoMark size={20} />
            <span className="font-semibold text-sm">Hanzo Standards</span>
          </div>
          <p className="text-xs text-fd-muted-foreground max-w-xs">
            Hanzo Improvement Proposals, rendered from{' '}
            <a href="https://github.com/hanzoai/hips" target="_blank" rel="noreferrer noopener" className="underline underline-offset-2 hover:text-fd-foreground transition-colors">hanzoai/hips</a>.
          </p>
          <p className="text-xs text-fd-muted-foreground">© {year} Hanzo AI, Inc. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
