import Link from 'next/link';
import { cn } from '@/lib/cn';
import {
  CheckIcon, ArrowRightIcon, MessageCircleIcon,
  DownloadIcon, SparklesIcon, XIcon,
} from 'lucide-react';
import type { Metadata } from 'next';
import { BillingFaq } from '../_components/billing-faq';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Hanzo Bot pricing — Free locally, $5/mo in the cloud. Full-blown computer-using AI agent in a box.',
};

const tiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Run on your own hardware. Full power, no limits.',
    cta: 'Download Free',
    ctaHref: '/#quickstart',
    signupHref: 'https://app.hanzo.bot/auth/signup?plan=free',
    features: [
      'Runs on Mac, Windows, Linux',
      'Bring your own API keys (OpenAI, Anthropic, etc.)',
      'All chat integrations (WhatsApp, Telegram, Discord, Slack, Signal, iMessage)',
      'Full system access (files, terminal, browser)',
      'Persistent memory & context',
      'Community skills & plugins',
      'Open source — inspect every line',
    ],
  },
  {
    name: 'Cloud',
    price: '$5',
    period: '/mo per bot',
    desc: 'Always-on Linux VM in Hanzo Cloud. No hardware needed.',
    cta: 'Start Free Trial',
    ctaHref: 'https://app.hanzo.bot/auth/signup?plan=cloud',
    signupHref: 'https://app.hanzo.bot/auth/signup?plan=cloud',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Full Linux desktop VM (Ubuntu)',
      '100+ AI models included via Hanzo LLM Gateway',
      'Always-on — never goes to sleep',
      'All chat integrations',
      'Persistent memory, files & storage',
      'Auto-updates & daily backups',
      'Web dashboard at app.hanzo.bot',
      'API access for automation',
    ],
  },
  {
    name: 'Cloud Pro',
    price: '$25',
    period: '/mo per bot',
    desc: 'Mac or Windows VM for native desktop apps.',
    cta: 'Get Started',
    ctaHref: 'https://app.hanzo.bot/auth/signup?plan=cloud-pro',
    signupHref: 'https://app.hanzo.bot/auth/signup?plan=cloud-pro',
    features: [
      'macOS or Windows desktop VM',
      'Run native desktop apps (Xcode, Figma, etc.)',
      'Priority model access & faster inference',
      'Advanced browser automation (Playwright)',
      'Team collaboration & shared bots',
      'Priority support',
      'Custom skill development',
      'SSO & enterprise auth (Hanzo IAM)',
    ],
  },
];

/* ---- Comparison table data ---- */
type CellValue = true | false | string;

const comparisonRows: { feature: string; free: CellValue; cloud: CellValue; pro: CellValue }[] = [
  { feature: 'Self-hosted (Mac/Win/Linux)', free: true, cloud: false, pro: false },
  { feature: 'Cloud VM (always-on)', free: false, cloud: 'Linux (Ubuntu)', pro: 'macOS or Windows' },
  { feature: 'AI models included', free: false, cloud: '100+ via LLM Gateway', pro: '100+ with priority access' },
  { feature: 'Bring your own API keys', free: true, cloud: true, pro: true },
  { feature: 'Chat integrations', free: 'All', cloud: 'All', pro: 'All' },
  { feature: 'Browser automation', free: true, cloud: true, pro: 'Advanced (Playwright)' },
  { feature: 'Persistent memory', free: true, cloud: true, pro: true },
  { feature: 'Storage included', free: 'Local disk', cloud: '1 GB', pro: '10 GB' },
  { feature: 'Auto-updates & backups', free: false, cloud: 'Daily', pro: 'Daily' },
  { feature: 'Web dashboard', free: false, cloud: true, pro: true },
  { feature: 'API access', free: false, cloud: true, pro: true },
  { feature: 'Team collaboration', free: false, cloud: false, pro: true },
  { feature: 'Custom skills development', free: 'Community', cloud: 'Community', pro: 'Priority' },
  { feature: 'SSO & enterprise auth', free: false, cloud: false, pro: true },
  { feature: 'Support', free: 'Community', cloud: 'Standard', pro: 'Priority' },
];

function CellDisplay({ value }: { value: CellValue }) {
  if (value === true) return <CheckIcon className="w-4 h-4 text-brand mx-auto" />;
  if (value === false) return <XIcon className="w-4 h-4 text-fd-muted-foreground/40 mx-auto" />;
  return <span className="text-sm text-fd-muted-foreground">{value}</span>;
}

export default function PricingPage() {
  return (
    <main className="relative z-[1] max-w-[860px] mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-10 overflow-hidden">
      <div className="stars" />
      <div className="nebula" />

      {/* Header */}
      <header className="text-center mb-12 animate-[fadeInUp_0.8s_ease-out]">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
          <span className="bg-gradient-to-br from-fd-foreground via-brand to-[#00e5cc] bg-[length:200%_200%] bg-clip-text text-transparent animate-[gradientShift_6s_ease_infinite]">
            Simple Pricing
          </span>
        </h1>
        <p className="text-lg text-fd-muted-foreground max-w-[600px] mx-auto">
          Get started free. Run locally forever, or deploy to Hanzo Cloud starting at $5/mo.
        </p>
      </header>

      {/* Pricing Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16 animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              'relative flex flex-col p-6 rounded-2xl border backdrop-blur-sm transition-all hover:-translate-y-1',
              tier.highlight
                ? 'border-brand bg-gradient-to-br from-[rgba(255,77,77,0.08)] to-[rgba(10,15,26,0.8)] shadow-[0_4px_24px_rgba(255,77,77,0.2)]'
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
              href={tier.signupHref}
              target={tier.signupHref.startsWith('http') ? '_blank' : undefined}
              rel={tier.signupHref.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={cn(
                'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold no-underline transition-all hover:-translate-y-0.5 text-center',
                tier.highlight
                  ? 'bg-gradient-to-br from-brand to-[#e03e3e] text-[#050810] hover:shadow-[0_8px_40px_rgba(255,77,77,0.45)] shadow-[0_4px_24px_rgba(255,77,77,0.3)]'
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
          Feature Comparison
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-fd-border">
                <th className="text-left p-4 text-fd-foreground font-semibold">Feature</th>
                <th className="p-4 text-center text-fd-foreground font-semibold">Free</th>
                <th className="p-4 text-center text-brand font-semibold">Cloud</th>
                <th className="p-4 text-center text-fd-foreground font-semibold">Cloud Pro</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="border-b border-fd-border/50 last:border-b-0 hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="p-4 text-fd-muted-foreground">{row.feature}</td>
                  <td className="p-4 text-center"><CellDisplay value={row.free} /></td>
                  <td className="p-4 text-center"><CellDisplay value={row.cloud} /></td>
                  <td className="p-4 text-center"><CellDisplay value={row.pro} /></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-fd-border">
                <td className="p-4" />
                <td className="p-4 text-center">
                  <a
                    href="https://app.hanzo.bot/auth/signup?plan=free"
                    className="text-xs font-semibold text-brand hover:text-[#00e5cc] transition-colors no-underline"
                  >
                    Sign Up Free
                  </a>
                </td>
                <td className="p-4 text-center">
                  <a
                    href="https://app.hanzo.bot/auth/signup?plan=cloud"
                    className="text-xs font-semibold text-brand hover:text-[#00e5cc] transition-colors no-underline"
                  >
                    Start Free Trial
                  </a>
                </td>
                <td className="p-4 text-center">
                  <a
                    href="https://app.hanzo.bot/auth/signup?plan=cloud-pro"
                    className="text-xs font-semibold text-brand hover:text-[#00e5cc] transition-colors no-underline"
                  >
                    Get Started
                  </a>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* Usage-Based Pricing */}
      <section className="mb-16 animate-[fadeInUp_0.8s_ease-out_0.35s_both]">
        <h2 className="text-2xl font-bold text-fd-foreground mb-3 text-center">
          Usage-Based Pricing
        </h2>
        <p className="text-sm text-fd-muted-foreground text-center mb-8 max-w-[500px] mx-auto">
          Cloud plans include generous free tiers. Pay only for what you use beyond the included limits.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Messages */}
          <div className="p-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircleIcon className="w-5 h-5 text-brand" />
              <h3 className="text-sm font-bold text-fd-foreground">Messages</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-fd-muted-foreground">First 1,000/mo</span>
                <span className="text-[#00e5cc] font-semibold">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-fd-muted-foreground">After 1,000</span>
                <span className="text-fd-foreground font-semibold">$0.001/msg</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-fd-muted-foreground/70">
              Includes messages across all chat integrations.
            </p>
          </div>

          {/* Tokens */}
          <div className="p-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <SparklesIcon className="w-5 h-5 text-brand" />
              <h3 className="text-sm font-bold text-fd-foreground">Tokens</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-fd-muted-foreground">GPT-5</span>
                <span className="text-fd-foreground font-semibold">$0.03/1K</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-fd-muted-foreground">Claude Opus</span>
                <span className="text-fd-foreground font-semibold">$0.025/1K</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-fd-muted-foreground">Open source</span>
                <span className="text-fd-foreground font-semibold">$0.002/1K</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-fd-muted-foreground/70">
              Or bring your own API keys for $0 token cost.
            </p>
          </div>

          {/* Storage */}
          <div className="p-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <DownloadIcon className="w-5 h-5 text-brand" />
              <h3 className="text-sm font-bold text-fd-foreground">Storage</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-fd-muted-foreground">First 1 GB</span>
                <span className="text-[#00e5cc] font-semibold">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-fd-muted-foreground">After 1 GB</span>
                <span className="text-fd-foreground font-semibold">$0.10/GB/mo</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-fd-muted-foreground/70">
              Files, memory, backups, and bot data.
            </p>
          </div>
        </div>
        <p className="text-xs text-fd-muted-foreground text-center mt-6">
          We accept Visa, Mastercard, Amex &amp; Discover (via Square), cryptocurrency (BTC, ETH, SOL, USDC), and wire transfers.
          All payments powered by Hanzo Commerce.
        </p>
      </section>

      {/* Enterprise */}
      <section className="mb-16 animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
        <div className="flex flex-col items-center gap-5 p-8 rounded-2xl border border-[rgba(0,229,204,0.3)] bg-gradient-to-br from-[rgba(0,229,204,0.05)] to-[rgba(10,15,26,0.8)] backdrop-blur-sm text-center">
          <SparklesIcon className="w-8 h-8 text-[#00e5cc]" />
          <h2 className="text-2xl font-bold text-fd-foreground">Enterprise</h2>
          <p className="text-fd-muted-foreground max-w-[500px]">
            Custom deployments, dedicated infrastructure, SLAs, volume licensing, and SSO.
            Built for teams that need full control.
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

      {/* Billing FAQ */}
      <section className="mb-16 animate-[fadeInUp_0.8s_ease-out_0.6s_both]">
        <BillingFaq />
      </section>

      {/* Bottom CTA */}
      <div className="text-center mb-8">
        <Link
          href="/get-started"
          className="inline-flex items-center gap-2.5 px-9 py-4 text-lg font-semibold text-[#050810] bg-gradient-to-br from-brand to-[#e03e3e] rounded-2xl no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(255,77,77,0.45)] shadow-[0_4px_24px_rgba(255,77,77,0.3)]"
        >
          <DownloadIcon className="w-5 h-5" />
          Get Started Free
        </Link>
        <p className="mt-3 text-sm text-fd-muted-foreground">
          Free locally. $5/mo in the cloud. Cancel anytime.
        </p>
      </div>
    </main>
  );
}
