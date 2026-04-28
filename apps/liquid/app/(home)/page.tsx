import Link from 'next/link';
import { cn } from '@/lib/cn';
import { cva } from 'class-variance-authority';
import {
  DropletIcon,
  CoinsIcon,
  ShieldCheckIcon,
  GitBranchIcon,
  BookOpenIcon,
  ArrowRightIcon,
} from 'lucide-react';

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
  'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-medium tracking-tight transition-colors',
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

const cardVariants = cva('rounded-2xl text-sm p-6 bg-origin-border shadow-lg', {
  variants: {
    variant: {
      secondary: 'bg-brand-secondary text-brand-secondary-foreground',
      default: 'border bg-fd-card',
    },
  },
  defaultVariants: { variant: 'default' },
});

export default function Page() {
  return (
    <main className="text-landing-foreground pt-4 pb-6 dark:text-landing-foreground-dark md:pb-12">
      <div className="relative flex min-h-[600px] h-[70vh] max-h-[900px] border rounded-2xl overflow-hidden mx-auto w-full max-w-[1400px] bg-gradient-to-br from-brand/10 via-transparent to-brand-secondary/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="flex flex-col z-2 px-4 size-full md:p-12 max-md:items-center max-md:text-center">
          <div className="flex items-center gap-2 mt-12 text-xs text-brand font-medium rounded-full p-2 border border-brand/50 w-fit">
            <DropletIcon className="size-4" />
            Self-repaying loans on Lux
          </div>
          <h1 className={cn(headingVariants({ variant: 'h1' }), 'mt-6 max-w-3xl')}>
            Borrow against yield. The yield repays the loan.
          </h1>
          <p className="mt-6 max-w-2xl text-fd-muted-foreground">
            Liquid is a lending engine on Lux. Deposit a yield-bearing asset, mint
            synthetic LETH up to the collateralization floor, and let the
            collateral&apos;s yield retire the debt. No liquidation spirals, no manual
            repayments — the position pays itself off.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/docs" className={buttonVariants({ variant: 'primary' })}>
              Read the docs <ArrowRightIcon className="size-4" />
            </Link>
            <Link
              href="https://github.com/luxfi/liquid"
              className={buttonVariants({ variant: 'secondary' })}
            >
              View on GitHub
            </Link>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1400px] px-4 mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: DropletIcon,
            title: 'Self-repaying',
            body: 'Yield from your collateral burns the synthetic debt against your position over time.',
          },
          {
            icon: CoinsIcon,
            title: 'Synthetic LETH',
            body: 'A transferable, fungible 1:1-pegged debt token. Mint at deposit, redeem via the Transmuter.',
          },
          {
            icon: ShieldCheckIcon,
            title: 'Curated risk',
            body: 'VaultV2 routing through risk-classified strategy adapters: Aave, Lido, Pendle, Morpho, EtherFi, more.',
          },
          {
            icon: GitBranchIcon,
            title: 'On-chain governance',
            body: 'LIQUID-token-weighted gauge votes set per-strategy weights each epoch.',
          },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className={cardVariants({ variant: 'default' })}>
            <Icon className="size-6 text-brand" />
            <h3 className={cn(headingVariants({ variant: 'h3' }), 'mt-4')}>{title}</h3>
            <p className="mt-2 text-fd-muted-foreground">{body}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-[1400px] px-4 mt-20 grid gap-8 lg:grid-cols-2">
        <div className={cardVariants({ variant: 'secondary' })}>
          <BookOpenIcon className="size-6" />
          <h3 className={cn(headingVariants({ variant: 'h3' }), 'mt-4')}>Build on Liquid</h3>
          <p className="mt-2">
            Open a position, mint LETH, integrate the Transmuter, or ship a new
            strategy adapter. Walkthroughs and contract reference live in the
            developer guide.
          </p>
          <Link
            href="/docs/dev"
            className="mt-6 inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline"
          >
            Developer guide <ArrowRightIcon className="size-4" />
          </Link>
        </div>
        <div className={cardVariants({ variant: 'default' })}>
          <h3 className={cn(headingVariants({ variant: 'h3' }))}>Canonical contracts</h3>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-xs font-mono">
            <dt className="text-fd-muted-foreground">LETH</dt>
            <dd>0x60E0a8167FC13dE89348978860466C9ceC24B9ba</dd>
            <dt className="text-fd-muted-foreground">WLUX</dt>
            <dd>0x4888E4a2Ee0F03051c72D2BD3ACf755eD3498B3E</dd>
            <dt className="text-fd-muted-foreground">LBTC</dt>
            <dd>0x1E48D32a4F5e9f08DB9aE4959163300FaF8A6C8e</dd>
          </dl>
          <Link
            href="/docs/user/quick-start"
            className="mt-6 inline-flex items-center gap-2 font-medium text-brand"
          >
            Get started <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
