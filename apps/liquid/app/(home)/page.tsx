import Link from 'next/link';
import { ArrowRightIcon, ArrowUpRightIcon } from 'lucide-react';

export default function Page() {
  return (
    <main className="text-fd-foreground">
      {/* HERO — full-bleed, mono, type-driven */}
      <section className="relative overflow-hidden border-b border-fd-border">
        <div className="bg-grid-pattern absolute inset-0 text-fd-foreground/40" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at top, color-mix(in srgb, var(--color-brand) 6%, transparent) 0%, transparent 60%)',
          }}
        />
        <div className="relative mx-auto max-w-page px-6 pt-24 pb-32 md:pt-32 md:pb-40">
          <div className="inline-flex items-center gap-2 rounded-full border border-fd-border px-3 py-1 text-xs font-medium tracking-wide uppercase">
            <span className="size-1.5 rounded-full bg-fd-foreground" />
            Lending on Lux
          </div>
          <h1 className="mt-8 max-w-4xl text-5xl font-semibold tracking-[-0.025em] leading-[1.05] md:text-7xl">
            Borrow against yield.
            <br />
            <span className="text-fd-muted-foreground">The yield repays the loan.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-fd-muted-foreground leading-relaxed">
            Liquid is a self-repaying lending engine on Lux. Deposit a yield-bearing
            asset, mint synthetic <span className="font-mono text-fd-foreground">LETH</span>,
            and let the collateral&apos;s yield retire the debt — no liquidation spirals,
            no manual repayments.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/docs"
              className="group inline-flex items-center gap-2 bg-fd-foreground text-fd-background px-6 py-3 rounded-full font-medium text-sm transition-colors hover:bg-fd-foreground/90"
            >
              Read the docs
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="https://github.com/luxfi/liquid"
              className="inline-flex items-center gap-2 border border-fd-border px-6 py-3 rounded-full font-medium text-sm transition-colors hover:bg-fd-accent"
            >
              View on GitHub
              <ArrowUpRightIcon className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — three steps, ascii-flow vibes */}
      <section className="border-b border-fd-border">
        <div className="mx-auto max-w-page px-6 py-24">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              How it works
            </h2>
            <Link
              href="/docs/user/concepts/self-repaying-loans"
              className="text-sm text-fd-muted-foreground hover:text-fd-foreground"
            >
              Full mechanics →
            </Link>
          </div>
          <ol className="grid gap-8 md:grid-cols-3">
            {[
              {
                n: '01',
                t: 'Deposit',
                b: 'Lock yield-bearing collateral (wstETH, sfrxETH, weETH, sDAI, …) and receive an ERC-721 position NFT.',
              },
              {
                n: '02',
                t: 'Mint',
                b: 'Borrow synthetic LETH up to the collateralization floor. LETH is transferable and 1:1-pegged.',
              },
              {
                n: '03',
                t: 'Self-repay',
                b: 'Yield from your collateral is harvested into the Transmuter, burning your debt over time.',
              },
            ].map(({ n, t, b }) => (
              <li
                key={n}
                className="border-l border-fd-border pl-6 py-2"
              >
                <div className="font-mono text-xs text-fd-muted-foreground tracking-widest">
                  {n}
                </div>
                <div className="mt-3 text-xl font-medium">{t}</div>
                <p className="mt-2 text-sm text-fd-muted-foreground leading-relaxed">
                  {b}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CONTRACTS — monospaced ledger */}
      <section className="border-b border-fd-border">
        <div className="mx-auto max-w-page px-6 py-24">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Canonical contracts
          </h2>
          <p className="mt-3 text-fd-muted-foreground">
            Lux mainnet (chain id 96369).
          </p>
          <div className="mt-10 border border-fd-border rounded-lg overflow-hidden">
            {[
              { sym: 'LETH', addr: '0x60E0a8167FC13dE89348978860466C9ceC24B9ba', label: 'Synthetic ETH' },
              { sym: 'WLUX', addr: '0x4888E4a2Ee0F03051c72D2BD3ACf755eD3498B3E', label: 'Wrapped LUX' },
              { sym: 'LBTC', addr: '0x1E48D32a4F5e9f08DB9aE4959163300FaF8A6C8e', label: 'Liquid BTC' },
            ].map(({ sym, addr, label }, i, a) => (
              <div
                key={sym}
                className={`flex items-center justify-between px-6 py-4 ${
                  i < a.length - 1 ? 'border-b border-fd-border' : ''
                }`}
              >
                <div>
                  <div className="font-mono text-sm font-medium">{sym}</div>
                  <div className="text-xs text-fd-muted-foreground">{label}</div>
                </div>
                <code className="font-mono text-xs text-fd-muted-foreground select-all">
                  {addr}
                </code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCS GRID */}
      <section>
        <div className="mx-auto max-w-page px-6 py-24">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl mb-12">
            Documentation
          </h2>
          <div className="grid gap-px bg-fd-border md:grid-cols-2 lg:grid-cols-4 border border-fd-border rounded-lg overflow-hidden">
            {[
              { t: 'For users', d: 'Deposit, borrow, redeem.', h: '/docs/user' },
              { t: 'For developers', d: 'Contracts and integration.', h: '/docs/dev' },
              { t: 'Governance', d: 'DAO process and the gauge.', h: '/docs/governance' },
              { t: 'Partners', d: 'Friendly forks and integrations.', h: '/docs/projects' },
            ].map(({ t, d, h }) => (
              <Link
                key={h}
                href={h}
                className="group bg-fd-background hover:bg-fd-accent transition-colors p-8 flex flex-col"
              >
                <div className="text-lg font-medium">{t}</div>
                <div className="mt-2 text-sm text-fd-muted-foreground flex-1">{d}</div>
                <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                  Read <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-fd-border">
        <div className="mx-auto max-w-page px-6 py-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium">Liquid</span>
            <span className="text-fd-muted-foreground">on Lux Network</span>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm text-fd-muted-foreground">
            <Link href="/docs" className="hover:text-fd-foreground">Docs</Link>
            <Link href="https://github.com/luxfi/liquid" className="hover:text-fd-foreground">GitHub</Link>
            <Link href="https://github.com/luxfi/liquid/tree/main/audits" className="hover:text-fd-foreground">Audits</Link>
            <Link href="https://lux.network" className="hover:text-fd-foreground">Lux Network</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
