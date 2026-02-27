import Link from 'next/link';
import { cn } from '@/lib/cn';
import {
  CheckIcon, ArrowRightIcon, MessageCircleIcon,
  ServerIcon, SparklesIcon, CpuIcon, ContainerIcon,
  HardDriveIcon, BoxesIcon, BrainCircuitIcon, XIcon,
} from 'lucide-react';
import type { Metadata } from 'next';
import { BillingFaq } from '../_components/billing-faq';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Hanzo Platform pricing — Cloud VMs from $5/mo, Kubernetes from $0.005/hr, 100+ AI models. Deploy anywhere.',
};

/* ---- Cloud VM Plans ---- */
const vmPlans = [
  {
    name: 'Nano',
    price: '$5',
    cpu: '1 vCPU shared',
    ram: '1 GB RAM',
    storage: '25 GB SSD',
  },
  {
    name: 'Starter',
    price: '$6',
    cpu: '1 vCPU shared',
    ram: '2 GB RAM',
    storage: '50 GB SSD',
  },
  {
    name: 'Standard',
    price: '$12',
    cpu: '2 vCPU shared',
    ram: '4 GB RAM',
    storage: '80 GB SSD',
    popular: true,
  },
  {
    name: 'Performance',
    price: '$24',
    cpu: '4 vCPU shared',
    ram: '8 GB RAM',
    storage: '160 GB SSD',
  },
  {
    name: 'Premium',
    price: '$36',
    cpu: '4 vCPU dedicated',
    ram: '8 GB RAM',
    storage: '200 GB SSD',
  },
  {
    name: 'Power',
    price: '$49',
    cpu: '4 vCPU dedicated',
    ram: '16 GB RAM',
    storage: '320 GB SSD',
  },
];

/* ---- Compute / Container Pricing ---- */
const computeItems = [
  {
    icon: BoxesIcon,
    title: 'Kubernetes Pods',
    rows: [
      { label: 'Per vCPU', value: 'from $0.005/hr' },
      { label: 'Per GB RAM', value: '$0.002/hr' },
      { label: 'Persistent Volume', value: '$0.10/GB/mo' },
    ],
    note: 'Bring your own cluster or provision through Hanzo.',
  },
  {
    icon: ContainerIcon,
    title: 'Docker Containers',
    rows: [
      { label: 'Per container', value: 'from $0.003/hr' },
      { label: 'Swarm service', value: '$0.005/hr per replica' },
      { label: 'Volume storage', value: '$0.10/GB/mo' },
    ],
    note: 'Docker Compose and Swarm deployments supported.',
  },
];

/* ---- AI Model Pricing ---- */
const aiModels = [
  { name: 'Zen 1B', input: 'Free', output: 'Free', free: true },
  { name: 'Zen 7B', input: '$0.20', output: '$0.60' },
  { name: 'Claude Sonnet', input: '$3.00', output: '$15.00' },
  { name: 'GPT-5', input: '$2.50', output: '$10.00' },
];

/* ---- Comparison table ---- */
type CellValue = true | false | string;

const comparisonRows: { feature: string; nano: CellValue; standard: CellValue; power: CellValue }[] = [
  { feature: 'vCPU', nano: '1 shared', standard: '2 shared', power: '4 dedicated' },
  { feature: 'RAM', nano: '1 GB', standard: '4 GB', power: '16 GB' },
  { feature: 'SSD Storage', nano: '25 GB', standard: '80 GB', power: '320 GB' },
  { feature: 'Root SSH access', nano: true, standard: true, power: true },
  { feature: 'Browser terminal', nano: true, standard: true, power: true },
  { feature: 'Automated backups', nano: 'Daily', standard: 'Daily', power: 'Hourly' },
  { feature: 'Monitoring & alerts', nano: true, standard: true, power: true },
  { feature: 'Custom domains & TLS', nano: true, standard: true, power: true },
  { feature: 'Kubernetes management', nano: false, standard: true, power: true },
  { feature: 'Docker Swarm', nano: true, standard: true, power: true },
  { feature: 'AI model access', nano: 'Zen 1B free', standard: '100+ models', power: '100+ with priority' },
  { feature: 'Multi-cluster fleet', nano: false, standard: 'Up to 5', power: 'Unlimited' },
  { feature: 'Team collaboration', nano: false, standard: true, power: true },
  { feature: 'RBAC & SSO', nano: false, standard: false, power: true },
  { feature: 'Support', nano: 'Community', standard: 'Standard', power: 'Priority' },
];

function CellDisplay({ value }: { value: CellValue }) {
  if (value === true) return <CheckIcon className="w-4 h-4 text-brand mx-auto" />;
  if (value === false) return <XIcon className="w-4 h-4 text-fd-muted-foreground/40 mx-auto" />;
  return <span className="text-sm text-fd-muted-foreground">{value}</span>;
}

export default function PricingPage() {
  return (
    <main className="relative z-[1] max-w-[1000px] mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-10 overflow-hidden">
      {/* Header */}
      <header className="text-center mb-12 animate-[fadeInUp_0.8s_ease-out]">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
          <span className="bg-gradient-to-br from-fd-foreground via-brand to-brand-secondary bg-[length:200%_200%] bg-clip-text text-transparent animate-[gradientShift_6s_ease_infinite]">
            Platform Pricing
          </span>
        </h1>
        <p className="text-lg text-fd-muted-foreground max-w-[640px] mx-auto">
          Cloud VMs from $5/mo. Kubernetes, Docker, and 100+ AI models.
          Pay only for what you use.
        </p>
      </header>

      {/* ============ Cloud VM Plans ============ */}
      <section className="mb-16 animate-[fadeInUp_0.8s_ease-out_0.15s_both]">
        <div className="flex items-center gap-3 mb-6">
          <ServerIcon className="w-6 h-6 text-brand" />
          <h2 className="text-2xl font-bold text-fd-foreground">Cloud VMs</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {vmPlans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative flex flex-col p-6 rounded-2xl border backdrop-blur-sm transition-all hover:-translate-y-1',
                plan.popular
                  ? 'border-brand bg-gradient-to-br from-[rgba(59,130,246,0.08)] to-[rgba(10,15,26,0.8)] shadow-[0_4px_24px_rgba(59,130,246,0.2)]'
                  : 'border-fd-border bg-[rgba(10,15,26,0.6)]',
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-xs font-bold bg-brand text-white rounded-full whitespace-nowrap">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-fd-foreground mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-fd-foreground">{plan.price}</span>
                <span className="text-sm text-fd-muted-foreground">/mo</span>
              </div>
              <div className="space-y-2 text-sm text-fd-muted-foreground flex-1">
                <div className="flex items-center gap-2">
                  <CpuIcon className="w-4 h-4 text-brand shrink-0" />
                  {plan.cpu}
                </div>
                <div className="flex items-center gap-2">
                  <ServerIcon className="w-4 h-4 text-brand shrink-0" />
                  {plan.ram}
                </div>
                <div className="flex items-center gap-2">
                  <HardDriveIcon className="w-4 h-4 text-brand shrink-0" />
                  {plan.storage}
                </div>
              </div>
              <a
                href="https://app.platform.hanzo.ai"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold no-underline transition-all hover:-translate-y-0.5 text-center',
                  plan.popular
                    ? 'bg-gradient-to-br from-brand to-brand-200 text-[#050810] hover:shadow-[0_8px_40px_rgba(59,130,246,0.45)] shadow-[0_4px_24px_rgba(59,130,246,0.3)]'
                    : 'bg-[rgba(255,255,255,0.05)] border border-fd-border text-fd-foreground hover:border-brand',
                )}
              >
                Deploy Now
                <ArrowRightIcon className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ============ Compute / Container Pricing ============ */}
      <section className="mb-16 animate-[fadeInUp_0.8s_ease-out_0.25s_both]">
        <div className="flex items-center gap-3 mb-6">
          <ContainerIcon className="w-6 h-6 text-brand" />
          <h2 className="text-2xl font-bold text-fd-foreground">Compute &amp; Containers</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {computeItems.map((item) => (
            <div key={item.title} className="p-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <item.icon className="w-5 h-5 text-brand" />
                <h3 className="text-sm font-bold text-fd-foreground">{item.title}</h3>
              </div>
              <div className="space-y-2">
                {item.rows.map((row) => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-fd-muted-foreground">{row.label}</span>
                    <span className="text-fd-foreground font-semibold">{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-fd-muted-foreground/70">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ AI Model Pricing ============ */}
      <section className="mb-16 animate-[fadeInUp_0.8s_ease-out_0.3s_both]">
        <div className="flex items-center gap-3 mb-3">
          <BrainCircuitIcon className="w-6 h-6 text-brand" />
          <h2 className="text-2xl font-bold text-fd-foreground">AI Models</h2>
        </div>
        <p className="text-sm text-fd-muted-foreground mb-6 max-w-[540px]">
          100+ models available via Hanzo LLM Gateway. Pricing per 1M tokens.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-fd-border">
                <th className="text-left p-4 text-fd-foreground font-semibold">Model</th>
                <th className="p-4 text-right text-fd-foreground font-semibold">Input / 1M tokens</th>
                <th className="p-4 text-right text-fd-foreground font-semibold">Output / 1M tokens</th>
              </tr>
            </thead>
            <tbody>
              {aiModels.map((model) => (
                <tr key={model.name} className="border-b border-fd-border/50 last:border-b-0 hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="p-4 text-fd-foreground font-medium">
                    {model.name}
                    {model.free && (
                      <span className="ml-2 text-xs font-bold text-brand-secondary bg-brand-secondary/10 rounded-full px-2 py-0.5">
                        Free
                      </span>
                    )}
                  </td>
                  <td className={cn('p-4 text-right font-semibold', model.free ? 'text-brand-secondary' : 'text-fd-foreground')}>
                    {model.input}
                  </td>
                  <td className={cn('p-4 text-right font-semibold', model.free ? 'text-brand-secondary' : 'text-fd-foreground')}>
                    {model.output}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-fd-muted-foreground mt-3">
          Or bring your own API keys for $0 token cost. Mix and match freely.
        </p>
      </section>

      {/* ============ Storage ============ */}
      <section className="mb-16 animate-[fadeInUp_0.8s_ease-out_0.35s_both]">
        <div className="flex items-center gap-3 mb-6">
          <HardDriveIcon className="w-6 h-6 text-brand" />
          <h2 className="text-2xl font-bold text-fd-foreground">Storage</h2>
        </div>
        <div className="p-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm max-w-md">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-fd-muted-foreground">Block & volume storage</span>
              <span className="text-fd-foreground font-semibold">$0.10/GB/mo</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-fd-muted-foreground">Backups & snapshots</span>
              <span className="text-fd-foreground font-semibold">$0.05/GB/mo</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-fd-muted-foreground/70">
            VM plans include SSD storage as listed. Additional volumes can be attached at any time.
          </p>
        </div>
      </section>

      {/* ============ Feature Comparison Table ============ */}
      <section className="mb-16 animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
        <h2 className="text-2xl font-bold text-fd-foreground mb-8 text-center">
          Plan Comparison
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-fd-border">
                <th className="text-left p-4 text-fd-foreground font-semibold">Feature</th>
                <th className="p-4 text-center text-fd-foreground font-semibold">Nano ($5)</th>
                <th className="p-4 text-center text-brand font-semibold">Standard ($12)</th>
                <th className="p-4 text-center text-fd-foreground font-semibold">Power ($49)</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="border-b border-fd-border/50 last:border-b-0 hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="p-4 text-fd-muted-foreground">{row.feature}</td>
                  <td className="p-4 text-center"><CellDisplay value={row.nano} /></td>
                  <td className="p-4 text-center"><CellDisplay value={row.standard} /></td>
                  <td className="p-4 text-center"><CellDisplay value={row.power} /></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-fd-border">
                <td className="p-4" />
                <td className="p-4 text-center">
                  <a
                    href="https://app.platform.hanzo.ai"
                    className="text-xs font-semibold text-brand hover:text-brand-secondary transition-colors no-underline"
                  >
                    Get Started
                  </a>
                </td>
                <td className="p-4 text-center">
                  <a
                    href="https://app.platform.hanzo.ai"
                    className="text-xs font-semibold text-brand hover:text-brand-secondary transition-colors no-underline"
                  >
                    Deploy Now
                  </a>
                </td>
                <td className="p-4 text-center">
                  <a
                    href="https://app.platform.hanzo.ai"
                    className="text-xs font-semibold text-brand hover:text-brand-secondary transition-colors no-underline"
                  >
                    Deploy Now
                  </a>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* ============ Payment Methods ============ */}
      <section className="mb-16 animate-[fadeInUp_0.8s_ease-out_0.45s_both]">
        <p className="text-sm text-fd-muted-foreground text-center max-w-[640px] mx-auto">
          We accept Visa, Mastercard, Amex &amp; Discover (via Square), cryptocurrency
          (BTC, ETH, SOL, USDC), and bank transfers. All payments powered by Hanzo Commerce.
        </p>
      </section>

      {/* ============ Enterprise ============ */}
      <section className="mb-16 animate-[fadeInUp_0.8s_ease-out_0.5s_both]">
        <div className="flex flex-col items-center gap-5 p-8 rounded-2xl border border-brand-secondary/30 bg-gradient-to-br from-[rgba(139,92,246,0.05)] to-[rgba(10,15,26,0.8)] backdrop-blur-sm text-center">
          <SparklesIcon className="w-8 h-8 text-brand-secondary" />
          <h2 className="text-2xl font-bold text-fd-foreground">Enterprise</h2>
          <p className="text-fd-muted-foreground max-w-[540px]">
            Custom deployments, dedicated infrastructure, SLAs, volume licensing,
            hybrid cloud, and SSO. Built for teams that need full control.
          </p>
          <a
            href="mailto:team@hanzo.ai"
            className="inline-flex items-center gap-2 px-7 py-3 font-semibold text-[#050810] bg-gradient-to-br from-brand-secondary to-brand rounded-xl no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(139,92,246,0.35)]"
          >
            <MessageCircleIcon className="w-5 h-5" />
            Contact Sales
          </a>
        </div>
      </section>

      {/* ============ Billing FAQ ============ */}
      <section className="mb-16 animate-[fadeInUp_0.8s_ease-out_0.6s_both]">
        <BillingFaq />
      </section>

      {/* ============ Bottom CTA ============ */}
      <div className="text-center mb-8">
        <a
          href="https://app.platform.hanzo.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-9 py-4 text-lg font-semibold text-[#050810] bg-gradient-to-br from-brand to-brand-200 rounded-2xl no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(59,130,246,0.45)] shadow-[0_4px_24px_rgba(59,130,246,0.3)]"
        >
          <ServerIcon className="w-5 h-5" />
          Start Deploying Free
        </a>
        <p className="mt-3 text-sm text-fd-muted-foreground">
          VMs from $5/mo. 14-day free trial. No credit card required.
        </p>
      </div>
    </main>
  );
}
