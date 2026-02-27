import Link from 'next/link';
import { cn } from '@/lib/cn';
import {
  CheckIcon, ArrowRightIcon, SparklesIcon, XIcon,
  HardDriveIcon, CpuIcon, ServerIcon, MessageCircleIcon,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Hanzo Visor pricing — VMs starting at $5/mo. Multi-cloud deploy across AWS, DigitalOcean, and Hetzner.',
};

const tiers = [
  {
    name: 'Nano',
    price: '$5',
    period: '/mo',
    desc: 'Lightweight workloads, dev/test, small services.',
    cta: 'Get Started',
    ctaHref: 'https://app.platform.hanzo.ai',
    features: [
      '1 vCPU (shared)',
      '1 GB RAM',
      '25 GB NVMe SSD',
      '1 TB transfer',
      'Browser terminal (SSH)',
      'Basic monitoring',
      'Snapshots included',
    ],
  },
  {
    name: 'Starter',
    price: '$6',
    period: '/mo',
    desc: 'Small apps and personal projects.',
    cta: 'Get Started',
    ctaHref: 'https://app.platform.hanzo.ai',
    features: [
      '1 vCPU (shared)',
      '2 GB RAM',
      '50 GB NVMe SSD',
      '2 TB transfer',
      'Browser terminal (SSH)',
      'Basic monitoring',
      'Snapshots included',
    ],
  },
  {
    name: 'Standard',
    price: '$12',
    period: '/mo',
    desc: 'Production web apps, APIs, databases.',
    cta: 'Start Free Trial',
    ctaHref: 'https://app.platform.hanzo.ai',
    highlight: true,
    badge: 'Most Popular',
    features: [
      '2 vCPU (shared)',
      '4 GB RAM',
      '80 GB NVMe SSD',
      '4 TB transfer',
      'Browser terminal (SSH + VNC)',
      'Full monitoring + alerts',
      'Auto-scaling rules',
      'Daily backups',
    ],
  },
  {
    name: 'Performance',
    price: '$24',
    period: '/mo',
    desc: 'High-traffic apps, CI/CD runners.',
    cta: 'Get Started',
    ctaHref: 'https://app.platform.hanzo.ai',
    features: [
      '4 vCPU (shared)',
      '8 GB RAM',
      '160 GB NVMe SSD',
      '5 TB transfer',
      'Browser terminal (SSH + VNC)',
      'Full monitoring + alerts',
      'Auto-scaling rules',
      'Daily backups',
    ],
  },
  {
    name: 'Premium',
    price: '$36',
    period: '/mo',
    desc: 'Dedicated cores for consistent performance.',
    cta: 'Get Started',
    ctaHref: 'https://app.platform.hanzo.ai',
    features: [
      '4 vCPU (dedicated)',
      '8 GB RAM',
      '200 GB NVMe SSD',
      '6 TB transfer',
      'Browser terminal (SSH + VNC)',
      'Full monitoring + alerts + auto-scaling',
      'Daily backups + point-in-time restore',
      'Private networking',
    ],
  },
  {
    name: 'Power',
    price: '$49',
    period: '/mo',
    desc: 'Compute-heavy workloads, ML inference.',
    cta: 'Get Started',
    ctaHref: 'https://app.platform.hanzo.ai',
    features: [
      '4 vCPU (dedicated)',
      '16 GB RAM',
      '320 GB NVMe SSD',
      '8 TB transfer',
      'Browser terminal (SSH + VNC)',
      'Full monitoring + alerts + auto-scaling',
      'Daily backups + point-in-time restore',
      'Private networking + VPC peering',
    ],
  },
];

/* ---- Comparison table data ---- */
type CellValue = true | false | string;

const comparisonRows: { feature: string; nano: CellValue; starter: CellValue; standard: CellValue; performance: CellValue; premium: CellValue; power: CellValue }[] = [
  { feature: 'vCPU', nano: '1 shared', starter: '1 shared', standard: '2 shared', performance: '4 shared', premium: '4 dedicated', power: '4 dedicated' },
  { feature: 'RAM', nano: '1 GB', starter: '2 GB', standard: '4 GB', performance: '8 GB', premium: '8 GB', power: '16 GB' },
  { feature: 'NVMe SSD', nano: '25 GB', starter: '50 GB', standard: '80 GB', performance: '160 GB', premium: '200 GB', power: '320 GB' },
  { feature: 'Transfer', nano: '1 TB', starter: '2 TB', standard: '4 TB', performance: '5 TB', premium: '6 TB', power: '8 TB' },
  { feature: 'Browser Terminal', nano: 'SSH', starter: 'SSH', standard: 'SSH + VNC', performance: 'SSH + VNC', premium: 'SSH + VNC', power: 'SSH + VNC' },
  { feature: 'Monitoring', nano: 'Basic', starter: 'Basic', standard: 'Full + alerts', performance: 'Full + alerts', premium: 'Full + alerts', power: 'Full + alerts' },
  { feature: 'Auto-Scaling', nano: false, starter: false, standard: true, performance: true, premium: true, power: true },
  { feature: 'Daily Backups', nano: false, starter: false, standard: true, performance: true, premium: true, power: true },
  { feature: 'Private Networking', nano: false, starter: false, standard: false, performance: false, premium: true, power: true },
  { feature: 'VPC Peering', nano: false, starter: false, standard: false, performance: false, premium: false, power: true },
];

function CellDisplay({ value }: { value: CellValue }) {
  if (value === true) return <CheckIcon className="w-4 h-4 text-brand mx-auto" />;
  if (value === false) return <XIcon className="w-4 h-4 text-fd-muted-foreground/40 mx-auto" />;
  return <span className="text-sm text-fd-muted-foreground">{value}</span>;
}

export default function PricingPage() {
  return (
    <main className="relative z-[1] max-w-[960px] mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-10 overflow-hidden">
      {/* Header */}
      <header className="text-center mb-12 animate-[fadeInUp_0.8s_ease-out]">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
          <span className="bg-gradient-to-br from-fd-foreground via-brand to-[#00e5cc] bg-[length:200%_200%] bg-clip-text text-transparent animate-[gradientShift_6s_ease_infinite]">
            VM Pricing
          </span>
        </h1>
        <p className="text-lg text-fd-muted-foreground max-w-[600px] mx-auto">
          Predictable pricing across all cloud providers. Starting at $5/mo.
        </p>
      </header>

      {/* Pricing Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16 animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
        {tiers.map((tier) => (
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
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-xs font-bold bg-brand text-white rounded-full whitespace-nowrap">
                {tier.badge}
              </span>
            )}
            <h2 className="text-xl font-bold text-fd-foreground mb-1">{tier.name}</h2>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-bold text-fd-foreground">{tier.price}</span>
              <span className="text-sm text-fd-muted-foreground">{tier.period}</span>
            </div>
            <p className="text-sm text-fd-muted-foreground mb-5">{tier.desc}</p>
            <ul className="flex flex-col gap-2.5 mb-6 flex-1">
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
      </section>

      {/* Feature Comparison Table */}
      <section className="mb-16 animate-[fadeInUp_0.8s_ease-out_0.3s_both]">
        <h2 className="text-2xl font-bold text-fd-foreground mb-8 text-center">
          Plan Comparison
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-fd-border">
                <th className="text-left p-4 text-fd-foreground font-semibold">Feature</th>
                <th className="p-4 text-center text-fd-foreground font-semibold">Nano</th>
                <th className="p-4 text-center text-fd-foreground font-semibold">Starter</th>
                <th className="p-4 text-center text-brand font-semibold">Standard</th>
                <th className="p-4 text-center text-fd-foreground font-semibold">Perf</th>
                <th className="p-4 text-center text-fd-foreground font-semibold">Premium</th>
                <th className="p-4 text-center text-fd-foreground font-semibold">Power</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="border-b border-fd-border/50 last:border-b-0 hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="p-4 text-fd-muted-foreground">{row.feature}</td>
                  <td className="p-4 text-center"><CellDisplay value={row.nano} /></td>
                  <td className="p-4 text-center"><CellDisplay value={row.starter} /></td>
                  <td className="p-4 text-center"><CellDisplay value={row.standard} /></td>
                  <td className="p-4 text-center"><CellDisplay value={row.performance} /></td>
                  <td className="p-4 text-center"><CellDisplay value={row.premium} /></td>
                  <td className="p-4 text-center"><CellDisplay value={row.power} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* GPU Pricing */}
      <section className="mb-16 animate-[fadeInUp_0.8s_ease-out_0.35s_both]">
        <h2 className="text-2xl font-bold text-fd-foreground mb-3 text-center">
          GPU Instances
        </h2>
        <p className="text-sm text-fd-muted-foreground text-center mb-8 max-w-[500px] mx-auto">
          For ML training, inference, and rendering workloads.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <CpuIcon className="w-5 h-5 text-brand" />
              <h3 className="text-sm font-bold text-fd-foreground">NVIDIA T4</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-fd-muted-foreground">16 GB VRAM</span>
                <span className="text-fd-foreground font-semibold">$0.50/hr</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-fd-muted-foreground">Monthly</span>
                <span className="text-fd-foreground font-semibold">$150/mo</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-fd-muted-foreground/70">
              Ideal for inference and light training.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <CpuIcon className="w-5 h-5 text-brand" />
              <h3 className="text-sm font-bold text-fd-foreground">NVIDIA A10G</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-fd-muted-foreground">24 GB VRAM</span>
                <span className="text-fd-foreground font-semibold">$1.00/hr</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-fd-muted-foreground">Monthly</span>
                <span className="text-fd-foreground font-semibold">$300/mo</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-fd-muted-foreground/70">
              ML training and high-throughput inference.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <CpuIcon className="w-5 h-5 text-brand" />
              <h3 className="text-sm font-bold text-fd-foreground">NVIDIA A100</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-fd-muted-foreground">80 GB VRAM</span>
                <span className="text-fd-foreground font-semibold">$3.50/hr</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-fd-muted-foreground">Monthly</span>
                <span className="text-fd-foreground font-semibold">$1,500/mo</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-fd-muted-foreground/70">
              Large-scale training and fine-tuning.
            </p>
          </div>
        </div>
      </section>

      {/* Volume Storage Pricing */}
      <section className="mb-16 animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
        <h2 className="text-2xl font-bold text-fd-foreground mb-3 text-center">
          Block Storage
        </h2>
        <p className="text-sm text-fd-muted-foreground text-center mb-8 max-w-[500px] mx-auto">
          Attach persistent volumes to any VM. Pay per GB.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <HardDriveIcon className="w-5 h-5 text-brand" />
              <h3 className="text-sm font-bold text-fd-foreground">Volume Storage</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-fd-muted-foreground">NVMe SSD</span>
                <span className="text-fd-foreground font-semibold">$0.10/GB/mo</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-fd-muted-foreground/70">
              Persistent block storage. Auto-expand available.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <HardDriveIcon className="w-5 h-5 text-brand" />
              <h3 className="text-sm font-bold text-fd-foreground">Snapshots</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-fd-muted-foreground">Per snapshot</span>
                <span className="text-fd-foreground font-semibold">$0.05/GB/mo</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-fd-muted-foreground/70">
              Point-in-time copies of volumes and VMs.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <ServerIcon className="w-5 h-5 text-brand" />
              <h3 className="text-sm font-bold text-fd-foreground">Bandwidth</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-fd-muted-foreground">Overage</span>
                <span className="text-fd-foreground font-semibold">$0.01/GB</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-fd-muted-foreground/70">
              Transfer included per plan. Overage billed at cost.
            </p>
          </div>
        </div>
        <p className="text-xs text-fd-muted-foreground text-center mt-6">
          We accept Visa, Mastercard, Amex &amp; Discover (via Square), cryptocurrency (BTC, ETH, SOL, USDC), and bank transfers.
          All payments powered by Hanzo Commerce.
        </p>
      </section>

      {/* Enterprise */}
      <section className="mb-16 animate-[fadeInUp_0.8s_ease-out_0.45s_both]">
        <div className="flex flex-col items-center gap-5 p-8 rounded-2xl border border-[rgba(0,229,204,0.3)] bg-gradient-to-br from-[rgba(0,229,204,0.05)] to-[rgba(10,15,26,0.8)] backdrop-blur-sm text-center">
          <SparklesIcon className="w-8 h-8 text-[#00e5cc]" />
          <h2 className="text-2xl font-bold text-fd-foreground">Enterprise</h2>
          <p className="text-fd-muted-foreground max-w-[500px]">
            Custom VM sizes, dedicated hosts, bare-metal servers, SLAs, volume discounts, and SSO.
            Multi-cloud orchestration for teams that need full control.
          </p>
          <a
            href="mailto:team@hanzo.ai"
            className="inline-flex items-center gap-2 px-7 py-3 font-semibold text-[#050810] bg-gradient-to-br from-[#00e5cc] to-[#14b8a6] rounded-xl no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(0,229,204,0.35)]"
          >
            <MessageCircleIcon className="w-5 h-5" />
            Contact Sales
          </a>
        </div>
      </section>

      {/* Bottom CTA */}
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
        <p className="mt-3 text-sm text-fd-muted-foreground">
          Starting at $5/mo. Scale up anytime.
        </p>
      </div>
    </main>
  );
}
