import Link from 'next/link';
import { cn } from '@/lib/cn';
import {
  CheckIcon, ArrowRightIcon, DownloadIcon, CloudIcon,
  CrownIcon, LogInIcon, ExternalLinkIcon,
} from 'lucide-react';
import type { Metadata } from 'next';
import { BillingFaq } from '../_components/billing-faq';

export const metadata: Metadata = {
  title: 'Get Started',
  description: 'Get started with Hanzo Bot — download free or deploy to Hanzo Cloud in minutes.',
};

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    icon: DownloadIcon,
    desc: 'Download and run on your own Mac, Windows, or Linux machine. Bring your own API keys.',
    cta: 'Download Now',
    ctaHref: '/#quickstart',
    external: false,
    features: [
      'Full system access — files, terminal, browser',
      'All chat integrations included',
      'Bring your own API keys (OpenAI, Anthropic, etc.)',
      'Open source — inspect every line',
    ],
    steps: [
      'Install with one command (see below)',
      'Add your API key (OpenAI, Anthropic, etc.)',
      'Connect your chat apps',
      'Start chatting with your bot',
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud',
    price: '$5',
    period: '/mo per bot',
    icon: CloudIcon,
    desc: 'Always-on Linux VM in Hanzo Cloud. 100+ AI models included. No hardware needed.',
    cta: 'Start Free Trial',
    ctaHref: 'https://app.hanzo.bot/auth/signup?plan=cloud',
    external: true,
    highlight: true,
    badge: '14-day free trial',
    features: [
      'Full Linux desktop VM (Ubuntu)',
      '100+ AI models via Hanzo LLM Gateway',
      'Always-on with daily backups',
      'Web dashboard at app.hanzo.bot',
    ],
    steps: [
      'Create your account (no credit card needed)',
      'Choose your bot name and personality',
      'Connect your chat apps',
      'Your bot is live — 24/7',
    ],
  },
  {
    id: 'cloud-pro',
    name: 'Cloud Pro',
    price: '$25',
    period: '/mo per bot',
    icon: CrownIcon,
    desc: 'macOS or Windows VM for native desktop apps. Priority access and team collaboration.',
    cta: 'Get Cloud Pro',
    ctaHref: 'https://app.hanzo.bot/auth/signup?plan=cloud-pro',
    external: true,
    features: [
      'macOS or Windows desktop VM',
      'Run native apps (Xcode, Figma, etc.)',
      'Priority model access & faster inference',
      'Team collaboration & SSO',
    ],
    steps: [
      'Create your account',
      'Choose macOS or Windows VM',
      'Configure team access and SSO',
      'Deploy your pro bot',
    ],
  },
];

export default function GetStartedPage() {
  return (
    <main className="relative z-[1] max-w-[860px] mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-10 overflow-hidden">
      <div className="stars" />
      <div className="nebula" />

      {/* Header */}
      <header className="text-center mb-12 animate-[fadeInUp_0.8s_ease-out]">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
          <span className="bg-gradient-to-br from-fd-foreground via-brand to-[#00e5cc] bg-[length:200%_200%] bg-clip-text text-transparent animate-[gradientShift_6s_ease_infinite]">
            Get Started
          </span>
        </h1>
        <p className="text-lg text-fd-muted-foreground max-w-[600px] mx-auto">
          Choose your path. Run free on your own machine, or deploy to Hanzo Cloud in under a minute.
        </p>
      </header>

      {/* Step 1: Choose Plan */}
      <section className="mb-14 animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand text-[#050810] text-sm font-bold shrink-0">1</span>
          <h2 className="text-2xl font-bold text-fd-foreground">Choose Your Plan</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={cn(
                  'relative flex flex-col p-6 rounded-2xl border backdrop-blur-sm transition-all hover:-translate-y-1',
                  plan.highlight
                    ? 'border-brand bg-gradient-to-br from-[rgba(255,77,77,0.08)] to-[rgba(10,15,26,0.8)] shadow-[0_4px_24px_rgba(255,77,77,0.2)]'
                    : 'border-fd-border bg-[rgba(10,15,26,0.6)]',
                )}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-xs font-bold bg-brand text-white rounded-full whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-5 h-5 text-brand" />
                  <h3 className="text-lg font-bold text-fd-foreground">{plan.name}</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-fd-foreground">{plan.price}</span>
                  <span className="text-sm text-fd-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-fd-muted-foreground mb-4">{plan.desc}</p>
                <ul className="flex flex-col gap-2 mb-6 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm text-fd-muted-foreground">
                      <CheckIcon className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.ctaHref}
                  target={plan.external ? '_blank' : undefined}
                  rel={plan.external ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold no-underline transition-all hover:-translate-y-0.5 text-center',
                    plan.highlight
                      ? 'bg-gradient-to-br from-brand to-[#e03e3e] text-[#050810] hover:shadow-[0_8px_40px_rgba(255,77,77,0.45)] shadow-[0_4px_24px_rgba(255,77,77,0.3)]'
                      : 'bg-[rgba(255,255,255,0.05)] border border-fd-border text-fd-foreground hover:border-brand',
                  )}
                >
                  {plan.cta}
                  {plan.external
                    ? <ExternalLinkIcon className="w-4 h-4" />
                    : <ArrowRightIcon className="w-4 h-4" />
                  }
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* Step 2: How It Works */}
      <section className="mb-14 animate-[fadeInUp_0.8s_ease-out_0.35s_both]">
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand text-[#050810] text-sm font-bold shrink-0">2</span>
          <h2 className="text-2xl font-bold text-fd-foreground">Set Up in Minutes</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="p-5 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm"
            >
              <h3 className="text-sm font-bold text-fd-foreground mb-3">{plan.name}</h3>
              <ol className="flex flex-col gap-3">
                {plan.steps.map((step, i) => (
                  <li key={step} className="flex items-start gap-2.5 text-sm text-fd-muted-foreground">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(255,77,77,0.15)] text-brand text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Install (for Free tier) */}
      <section className="mb-14 animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[rgba(0,229,204,0.2)] text-[#00e5cc] text-sm font-bold shrink-0">?</span>
          <h2 className="text-2xl font-bold text-fd-foreground">Quick Install (Free)</h2>
        </div>
        <div className="p-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm">
          <p className="text-sm text-fd-muted-foreground mb-4">
            One command to install. Works on macOS, Windows, and Linux.
          </p>
          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-brand uppercase tracking-wider">macOS / Linux</span>
              <pre className="mt-1 p-3 rounded-lg bg-[rgba(0,0,0,0.4)] text-sm text-fd-foreground font-mono overflow-x-auto">
                <code>curl -fsSL https://hanzo.bot/install | bash</code>
              </pre>
            </div>
            <div>
              <span className="text-xs font-semibold text-brand uppercase tracking-wider">Windows (PowerShell)</span>
              <pre className="mt-1 p-3 rounded-lg bg-[rgba(0,0,0,0.4)] text-sm text-fd-foreground font-mono overflow-x-auto">
                <code>irm https://hanzo.bot/install.ps1 | iex</code>
              </pre>
            </div>
            <div>
              <span className="text-xs font-semibold text-brand uppercase tracking-wider">Docker</span>
              <pre className="mt-1 p-3 rounded-lg bg-[rgba(0,0,0,0.4)] text-sm text-fd-foreground font-mono overflow-x-auto">
                <code>docker run -d --name bot ghcr.io/hanzoai/bot</code>
              </pre>
            </div>
          </div>
          <p className="mt-4 text-xs text-fd-muted-foreground">
            See the{' '}
            <Link href="/docs" className="text-brand hover:text-[#00e5cc] transition-colors no-underline">
              full documentation
            </Link>{' '}
            for detailed setup instructions.
          </p>
        </div>
      </section>

      {/* Already have an account */}
      <section className="mb-14 animate-[fadeInUp_0.8s_ease-out_0.45s_both]">
        <div className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm text-center">
          <LogInIcon className="w-6 h-6 text-fd-muted-foreground" />
          <p className="text-fd-muted-foreground">
            Already have an account?
          </p>
          <a
            href="https://app.hanzo.bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 font-semibold text-fd-foreground bg-[rgba(255,255,255,0.05)] border border-fd-border rounded-xl no-underline transition-all hover:-translate-y-0.5 hover:border-brand"
          >
            <LogInIcon className="w-4 h-4" />
            Sign in to app.hanzo.bot
            <ExternalLinkIcon className="w-3.5 h-3.5 text-fd-muted-foreground" />
          </a>
        </div>
      </section>

      {/* Billing FAQ */}
      <section className="mb-14 animate-[fadeInUp_0.8s_ease-out_0.5s_both]">
        <BillingFaq />
      </section>

      {/* Bottom CTA */}
      <div className="text-center mb-8">
        <a
          href="https://app.hanzo.bot/auth/signup?plan=cloud"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-9 py-4 text-lg font-semibold text-[#050810] bg-gradient-to-br from-brand to-[#e03e3e] rounded-2xl no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(255,77,77,0.45)] shadow-[0_4px_24px_rgba(255,77,77,0.3)]"
        >
          Start Free Trial
          <ArrowRightIcon className="w-5 h-5" />
        </a>
        <p className="mt-3 text-sm text-fd-muted-foreground">
          14-day free trial. No credit card required.
        </p>
      </div>
    </main>
  );
}
