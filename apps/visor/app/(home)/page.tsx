import Link from 'next/link';
import { cn } from '@/lib/cn';
import { cva } from 'class-variance-authority';
import {
  CloudIcon, TerminalIcon, HardDriveIcon, ImageIcon,
  ActivityIcon, BarChart3Icon, CheckIcon, ArrowRightIcon,
  SparklesIcon, ServerIcon, MonitorIcon, BookOpenIcon,
  CreditCardIcon, BitcoinIcon, BuildingIcon,
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

const providers = [
  { name: 'AWS', desc: 'EC2, EBS, VPC' },
  { name: 'DigitalOcean', desc: 'Droplets, Volumes' },
  { name: 'Hetzner', desc: 'Cloud, Dedicated' },
];

const features = [
  { icon: CloudIcon, title: 'Multi-Cloud Deploy', desc: 'Launch on AWS, DigitalOcean, or Hetzner from one API. Unified billing, unified dashboard.' },
  { icon: TerminalIcon, title: 'Browser Terminal', desc: 'Full SSH access via browser. Powered by Apache Guacamole. No client install needed.' },
  { icon: HardDriveIcon, title: 'Block Storage', desc: 'Attach and manage volumes, snapshots, and backups. Auto-expand, auto-mount.' },
  { icon: ImageIcon, title: 'One-Click Images', desc: 'Ubuntu, Debian, Fedora, Alpine, or upload custom ISOs. Pre-configured for your stack.' },
  { icon: ActivityIcon, title: 'Auto-Scaling', desc: 'Scale up or down based on CPU, memory, or network thresholds. Set rules, forget the rest.' },
  { icon: BarChart3Icon, title: 'Real-Time Monitoring', desc: 'CPU, RAM, disk, and network dashboards. Alerting via webhook, email, or Slack.' },
];

const pricingTiers = [
  {
    name: 'Nano',
    price: '$5',
    period: '/mo',
    desc: '1 vCPU shared, 1 GB RAM, 25 GB SSD.',
    cta: 'Get Started',
    ctaHref: 'https://app.platform.hanzo.ai',
    features: [
      '1 vCPU (shared)',
      '1 GB RAM',
      '25 GB NVMe SSD',
      '1 TB transfer',
      'Browser terminal',
      'Basic monitoring',
    ],
  },
  {
    name: 'Standard',
    price: '$12',
    period: '/mo',
    desc: '2 vCPU shared, 4 GB RAM, 80 GB SSD.',
    cta: 'Start Free Trial',
    ctaHref: 'https://app.platform.hanzo.ai',
    highlight: true,
    badge: 'Popular',
    features: [
      '2 vCPU (shared)',
      '4 GB RAM',
      '80 GB NVMe SSD',
      '4 TB transfer',
      'Browser terminal',
      'Full monitoring + alerts',
    ],
  },
  {
    name: 'Power',
    price: '$49',
    period: '/mo',
    desc: '4 vCPU dedicated, 16 GB RAM, 320 GB SSD.',
    cta: 'Get Started',
    ctaHref: 'https://app.platform.hanzo.ai',
    features: [
      '4 vCPU (dedicated)',
      '16 GB RAM',
      '320 GB NVMe SSD',
      '8 TB transfer',
      'Browser terminal + VNC',
      'Full monitoring + auto-scaling',
    ],
  },
];

export default function Page() {
  return (
    <main className="relative z-[1] max-w-[860px] mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-10 overflow-hidden">
      {/* Hero */}
      <header className="text-center mb-16 animate-[fadeInUp_0.8s_ease-out]">
        <div className="flex items-center justify-center mb-6">
          <ServerIcon className="w-16 h-16 text-brand animate-[float_3s_ease-in-out_infinite]" />
        </div>

        <h1 className={cn(headingVariants({ variant: 'h1' }), 'font-bold mb-4 leading-[1.1]')}>
          <span className="bg-gradient-to-br from-fd-foreground via-brand to-[#00e5cc] bg-[length:200%_200%] bg-clip-text text-transparent animate-[gradientShift_6s_ease_infinite]">
            Launch VMs
          </span>
          <br />
          <span className="text-fd-foreground">Anywhere.</span>
        </h1>

        <p className="text-brand text-sm font-medium tracking-[0.15em] uppercase mb-6 animate-[fadeInUp_0.8s_ease-out_0.15s_both]">
          Multi-cloud virtual machine management
        </p>

        <p className="text-base sm:text-lg text-fd-muted-foreground max-w-[680px] mx-auto leading-relaxed animate-[fadeInUp_0.8s_ease-out_0.3s_both]">
          Deploy virtual machines across AWS, DigitalOcean, and Hetzner from one dashboard.
          Browser terminal, block storage, and monitoring included.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-[fadeInUp_0.8s_ease-out_0.45s_both]">
          <a
            href="https://app.platform.hanzo.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-semibold text-[#050810] bg-gradient-to-br from-brand to-[#2563eb] rounded-xl no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(59,130,246,0.45)] shadow-[0_4px_24px_rgba(59,130,246,0.3)]"
          >
            <SparklesIcon className="w-5 h-5" />
            Get Started Free
          </a>
          <Link
            href="/docs"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-semibold text-fd-foreground bg-[rgba(255,255,255,0.05)] border border-fd-border rounded-xl no-underline transition-all hover:-translate-y-0.5 hover:bg-[rgba(0,229,204,0.08)] hover:border-[#00e5cc] hover:shadow-[0_8px_40px_rgba(0,229,204,0.2)]"
          >
            <BookOpenIcon className="w-5 h-5" />
            Read Docs
          </Link>
        </div>
      </header>

      {/* Providers Strip */}
      <section className="mb-14 animate-[fadeInUp_0.8s_ease-out_0.5s_both]">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-5">
          <span className="text-brand font-bold">&#x27E9;</span> Cloud Providers
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {providers.map((p) => (
            <div
              key={p.name}
              className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-brand"
            >
              <CloudIcon className="w-8 h-8 text-brand" />
              <h3 className="text-sm font-bold text-fd-foreground">{p.name}</h3>
              <p className="text-xs text-fd-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-5">
          <span className="text-brand font-bold">&#x27E9;</span> Features
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="block p-5 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-brand hover:shadow-[0_12px_40px_rgba(59,130,246,0.2)]"
              >
                <div className="flex items-center justify-center mb-3">
                  <Icon className="w-7 h-7 text-brand" />
                </div>
                <h3 className="text-sm font-semibold text-fd-foreground mb-1.5">{f.title}</h3>
                <p className="text-xs text-fd-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Visor */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-5">
          <span className="text-brand font-bold">&#x27E9;</span> Why Hanzo Visor
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'No Vendor Lock-In', desc: 'Same API across AWS, DO, and Hetzner. Migrate between clouds in minutes.' },
            { title: 'Developer-First', desc: 'Full REST API, CLI, and browser dashboard. Infrastructure as code out of the box.' },
            { title: 'Cost Transparent', desc: 'Unified billing across all providers. See exactly what you spend, where.' },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center gap-3 p-5 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-brand">
              <h3 className="text-sm font-bold text-fd-foreground">{item.title}</h3>
              <p className="text-xs text-fd-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="mb-14" id="pricing">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-2">
          <span className="text-brand font-bold">&#x27E9;</span> Simple Pricing
        </h2>
        <p className="text-sm text-fd-muted-foreground mb-6">
          Pay only for what you use. No surprise fees.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                'relative flex flex-col p-6 rounded-2xl border backdrop-blur-sm transition-all hover:-translate-y-1',
                tier.highlight
                  ? 'border-brand bg-gradient-to-br from-[rgba(59,130,246,0.08)] to-[rgba(10,15,26,0.8)] shadow-[0_4px_24px_rgba(59,130,246,0.2)]'
                  : 'border-fd-border bg-[rgba(10,15,26,0.6)]',
              )}
            >
              {tier.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-xs font-bold bg-brand text-white rounded-full">
                  {tier.badge}
                </span>
              )}
              <h3 className="text-lg font-bold text-fd-foreground mb-1">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold text-fd-foreground">{tier.price}</span>
                <span className="text-sm text-fd-muted-foreground">{tier.period}</span>
              </div>
              <p className="text-sm text-fd-muted-foreground mb-4">{tier.desc}</p>
              <ul className="flex flex-col gap-2 mb-6 flex-1">
                {tier.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm text-fd-muted-foreground">
                    <CheckIcon className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    {feat}
                  </li>
                ))}
              </ul>
              <a
                href={tier.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold no-underline transition-all hover:-translate-y-0.5 text-center',
                  tier.highlight
                    ? 'bg-gradient-to-br from-brand to-[#2563eb] text-[#050810] hover:shadow-[0_8px_40px_rgba(59,130,246,0.45)] shadow-[0_4px_24px_rgba(59,130,246,0.3)]'
                    : 'bg-[rgba(255,255,255,0.05)] border border-fd-border text-fd-foreground hover:border-brand',
                )}
              >
                {tier.cta}
                <ArrowRightIcon className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/pricing" className="text-sm text-brand font-medium hover:text-[#00e5cc] transition-colors no-underline">
            View full pricing &amp; plans &rarr;
          </Link>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="mb-14">
        <div className="p-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm text-center">
          <div className="flex items-center justify-center gap-6 mb-4">
            <CreditCardIcon className="w-6 h-6 text-fd-muted-foreground" />
            <BitcoinIcon className="w-6 h-6 text-fd-muted-foreground" />
            <BuildingIcon className="w-6 h-6 text-fd-muted-foreground" />
          </div>
          <p className="text-sm text-fd-muted-foreground">
            We accept Visa, Mastercard, Amex &amp; Discover (via Square), cryptocurrency (BTC, ETH, SOL, USDC),
            and bank transfers. All payments powered by Hanzo Commerce.
          </p>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-5">
          <span className="text-brand font-bold">&#x27E9;</span> The Hanzo Ecosystem
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { name: 'Platform', desc: 'Full PaaS for containers', href: 'https://platform.hanzo.ai' },
            { name: 'LLM Gateway', desc: '200+ AI models, one API', href: 'https://docs.hanzo.ai/docs/llm' },
            { name: 'Bot', desc: 'AI agent in a box', href: 'https://docs.hanzo.bot' },
            { name: 'MCP', desc: '260+ tools for agents', href: 'https://docs.hanzo.ai/docs/mcp' },
            { name: 'Commerce', desc: 'Payments and billing', href: 'https://docs.hanzo.ai/docs/commerce' },
            { name: 'IAM', desc: 'Identity and access', href: 'https://docs.hanzo.ai/docs/iam' },
          ].map((product) => (
            <a
              key={product.name}
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1 p-4 rounded-xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm no-underline text-inherit transition-all hover:border-[#00e5cc] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,229,204,0.15)]"
            >
              <span className="text-sm font-semibold text-fd-foreground">{product.name}</span>
              <span className="text-xs text-fd-muted-foreground">{product.desc}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Primary CTA */}
      <div className="text-center mb-8">
        <a
          href="https://app.platform.hanzo.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-9 py-4 text-lg font-semibold text-[#050810] bg-gradient-to-br from-brand to-[#2563eb] rounded-2xl no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(59,130,246,0.45)] shadow-[0_4px_24px_rgba(59,130,246,0.3)]"
        >
          <SparklesIcon className="w-5 h-5" />
          Launch Your First VM
        </a>
        <p className="mt-3 text-sm text-fd-muted-foreground">Starting at $5/mo. No credit card required to explore.</p>
      </div>

      {/* CTA Grid */}
      <nav className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
        {[
          { href: 'https://app.platform.hanzo.ai', icon: MonitorIcon, label: 'Dashboard', sub: 'Launch console', className: 'border-[rgba(59,130,246,0.25)] bg-[rgba(59,130,246,0.06)] hover:border-brand hover:shadow-[0_12px_40px_rgba(59,130,246,0.25)]' },
          { href: 'https://discord.gg/hanzo', icon: ServerIcon, label: 'Discord', sub: 'Join community', className: 'hover:border-[#5865F2] hover:shadow-[0_12px_40px_rgba(88,101,242,0.2)]' },
          { href: 'https://github.com/hanzoai/visor', icon: CloudIcon, label: 'GitHub', sub: 'View source', className: 'hover:border-fd-foreground hover:shadow-[0_12px_40px_rgba(240,244,255,0.1)]' },
          { href: '/docs', icon: BookOpenIcon, label: 'Docs', sub: 'Get started', className: 'hover:border-[#00e5cc] hover:shadow-[0_12px_40px_rgba(0,229,204,0.15)]' },
        ].map((cta) => {
          const Icon = cta.icon;
          const isExternal = cta.href.startsWith('http');
          const El = isExternal ? 'a' : Link;
          const props = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};
          return (
            <El
              key={cta.label}
              href={cta.href}
              {...props}
              className={cn(
                'flex flex-col items-center gap-2 px-4 py-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm no-underline text-fd-foreground transition-all hover:-translate-y-1',
                cta.className,
              )}
            >
              <Icon className="w-7 h-7 text-brand transition-transform hover:scale-110" />
              <span className="font-semibold">{cta.label}</span>
              <span className="text-xs text-fd-muted-foreground">{cta.sub}</span>
            </El>
          );
        })}
      </nav>
    </main>
  );
}
