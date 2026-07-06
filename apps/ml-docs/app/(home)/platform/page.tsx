import Link from 'next/link';
import { cn } from '@/lib/cn';
import {
  ArrowRightIcon, BrainIcon, CheckIcon, CloudIcon,
  DownloadIcon, MonitorIcon, NetworkIcon, PuzzleIcon,
  RocketIcon, SparklesIcon, UsersIcon, WrenchIcon,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Platform',
  description: 'The AI Workforce Platform — Deploy autonomous AI teams with 100+ models, 600+ integrations, computer use, and team management.',
};

/* ---- Data ---- */

const steps = [
  {
    num: '01',
    icon: DownloadIcon,
    title: 'Install or Launch',
    desc: 'Run locally with a single command or launch instantly in Hanzo Cloud.',
    code: 'curl -fsSL https://hanzo.bot/install.sh | sh',
    alt: 'Or launch at app.hanzo.bot',
  },
  {
    num: '02',
    icon: WrenchIcon,
    title: 'Configure Your Team',
    desc: 'Assign roles, connect chat channels, define skills and permissions for each agent.',
  },
  {
    num: '03',
    icon: RocketIcon,
    title: 'Deploy and Scale',
    desc: '24/7 autonomous operation. Add agents as you grow, upgrade tiers on demand.',
  },
];

const archLayers = [
  {
    label: 'Channels',
    color: 'text-[#00e5cc]',
    borderColor: 'border-[rgba(0,229,204,0.25)]',
    bgColor: 'bg-[rgba(0,229,204,0.04)]',
    items: ['WhatsApp', 'Slack', 'Discord', 'Email', 'Web', 'SMS', 'Telegram', 'iMessage'],
  },
  {
    label: 'Gateway',
    color: 'text-brand',
    borderColor: 'border-[rgba(255,77,77,0.25)]',
    bgColor: 'bg-[rgba(255,77,77,0.04)]',
    items: ['Routing', 'Auth', 'Rate Limiting', 'Load Balancing', 'Webhooks'],
  },
  {
    label: 'Agents',
    color: 'text-[#a78bfa]',
    borderColor: 'border-[rgba(167,139,250,0.25)]',
    bgColor: 'bg-[rgba(167,139,250,0.04)]',
    items: ['Support', 'Sales', 'Engineering', 'Marketing', 'Operations', 'Custom'],
  },
  {
    label: 'Runtime',
    color: 'text-[#f59e0b]',
    borderColor: 'border-[rgba(245,158,11,0.25)]',
    bgColor: 'bg-[rgba(245,158,11,0.04)]',
    items: ['Linux VM', 'macOS VM', 'Browser', 'Terminal', 'File System', 'Memory'],
  },
  {
    label: 'AI',
    color: 'text-[#ec4899]',
    borderColor: 'border-[rgba(236,72,153,0.25)]',
    bgColor: 'bg-[rgba(236,72,153,0.04)]',
    items: ['Claude', 'GPT', 'Gemini', 'Qwen', 'Llama', '+100 models'],
  },
  {
    label: 'Infra',
    color: 'text-[#38bdf8]',
    borderColor: 'border-[rgba(56,189,248,0.25)]',
    bgColor: 'bg-[rgba(56,189,248,0.04)]',
    items: ['K8s', 'Docker', 'MCP', 'Skills', 'Integrations', 'Storage'],
  },
];

const capabilities = [
  {
    icon: SparklesIcon,
    title: '100+ AI Models',
    desc: 'Access Claude, GPT, Gemini, Qwen, Llama and more through a unified LLM Gateway API. Swap models per-agent or per-task.',
  },
  {
    icon: NetworkIcon,
    title: '600+ Integrations',
    desc: 'WhatsApp, Slack, Discord, GitHub, Jira, Salesforce, and hundreds more. Connect any channel or service your team uses.',
  },
  {
    icon: MonitorIcon,
    title: 'Computer Use',
    desc: 'Each agent gets a full VM with desktop, browser, and terminal. They can click, type, browse, and run native apps.',
  },
  {
    icon: BrainIcon,
    title: 'Memory & Context',
    desc: 'Persistent memory across conversations and tasks. Agents remember preferences, past decisions, and project context.',
  },
  {
    icon: PuzzleIcon,
    title: 'Skills Marketplace',
    desc: 'Pre-built skills for common workflows or create your own. Agents can even author and share skills autonomously.',
  },
  {
    icon: UsersIcon,
    title: 'Team Management',
    desc: 'Organize bots into teams with roles, permissions, and monitoring. Full dashboard at app.hanzo.bot.',
  },
];

const solutions = [
  { label: 'Customer Support', href: '/solutions/customer-support' },
  { label: 'Sales', href: '/solutions/sales' },
  { label: 'Engineering', href: '/solutions/engineering' },
  { label: 'Marketing', href: '/solutions/marketing' },
  { label: 'Operations', href: '/solutions/operations' },
];

/* ---- Page ---- */

export default function PlatformPage() {
  return (
    <main className="relative z-[1] max-w-[860px] mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-10 overflow-hidden">
      <div className="stars" />
      <div className="nebula" />

      {/* Hero */}
      <header className="text-center mb-16 animate-[fadeInUp_0.8s_ease-out]">
        <p className="font-mono text-xs uppercase tracking-wider text-fd-muted-foreground mb-4">
          Platform
        </p>

        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 leading-[1.1]">
          <span className="bg-gradient-to-br from-fd-foreground via-brand to-[#00e5cc] bg-[length:200%_200%] bg-clip-text text-transparent animate-[gradientShift_6s_ease_infinite]">
            The AI Workforce
          </span>
          <br />
          <span className="text-fd-foreground">Platform</span>
        </h1>

        <p className="text-base sm:text-lg text-fd-muted-foreground max-w-[640px] mx-auto leading-relaxed">
          Deploy autonomous AI teams with 100+ models, 600+ integrations,
          full computer use, and team management. Run locally or scale
          to thousands of agents in Hanzo Cloud.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/get-started"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-semibold text-[#050810] bg-gradient-to-br from-brand to-[#e03e3e] rounded-xl no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(255,77,77,0.45)] shadow-[0_4px_24px_rgba(255,77,77,0.3)]"
          >
            <DownloadIcon className="size-5" />
            Get Started Free
          </Link>
          <a
            href="https://app.hanzo.bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-semibold text-fd-foreground bg-[rgba(255,255,255,0.05)] border border-fd-border rounded-xl no-underline transition-all hover:-translate-y-0.5 hover:bg-[rgba(0,229,204,0.08)] hover:border-[#00e5cc] hover:shadow-[0_8px_40px_rgba(0,229,204,0.2)]"
          >
            <CloudIcon className="size-5" />
            Launch in Cloud
          </a>
        </div>
      </header>

      {/* How It Works */}
      <section className="mb-16 animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-2">
          <span className="text-brand font-bold">&#x27E9;</span> How It Works
        </h2>
        <p className="text-sm text-fd-muted-foreground mb-6">
          Three steps to deploy your AI workforce.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative flex flex-col p-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-brand"
              >
                <span className="font-mono text-xs text-brand font-bold mb-3">
                  {step.num}
                </span>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="size-5 text-brand" />
                  <h3 className="text-sm font-bold text-fd-foreground">{step.title}</h3>
                </div>
                <p className="text-xs text-fd-muted-foreground leading-relaxed mb-3">
                  {step.desc}
                </p>
                {step.code && (
                  <code className="block text-[11px] text-[#00e5cc] bg-[rgba(0,229,204,0.06)] border border-[rgba(0,229,204,0.15)] rounded-lg px-3 py-2 font-mono break-all">
                    {step.code}
                  </code>
                )}
                {step.alt && (
                  <p className="mt-2 text-[11px] text-fd-muted-foreground/70 italic">
                    {step.alt}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="mb-16 animate-[fadeInUp_0.8s_ease-out_0.3s_both]">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-2">
          <span className="text-brand font-bold">&#x27E9;</span> Architecture
        </h2>
        <p className="text-sm text-fd-muted-foreground mb-6">
          Full-stack AI workforce infrastructure, from channels to compute.
        </p>

        <div className="flex flex-col gap-2">
          {archLayers.map((layer) => (
            <div
              key={layer.label}
              className={cn(
                'flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-xl border backdrop-blur-sm',
                layer.borderColor,
                layer.bgColor,
              )}
            >
              <span
                className={cn(
                  'font-mono text-xs uppercase tracking-wider font-bold w-20 shrink-0',
                  layer.color,
                )}
              >
                {layer.label}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {layer.items.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 text-[11px] text-fd-muted-foreground bg-[rgba(255,255,255,0.04)] border border-fd-border/50 rounded-md"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-3">
          <div className="flex flex-col items-center gap-0.5 text-fd-muted-foreground/40">
            <span className="text-[10px] font-mono">LLM Gateway</span>
            <span className="text-xs">|</span>
            <span className="text-[10px] font-mono">llm.hanzo.ai</span>
          </div>
        </div>
      </section>

      {/* Key Capabilities */}
      <section className="mb-16 animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-2">
          <span className="text-brand font-bold">&#x27E9;</span> Key Capabilities
        </h2>
        <p className="text-sm text-fd-muted-foreground mb-6">
          Everything you need to deploy and manage an AI workforce.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.title}
                className="flex flex-col p-5 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-brand hover:shadow-[0_12px_40px_rgba(255,77,77,0.2)]"
              >
                <div className="flex items-center justify-center mb-3">
                  <Icon className="size-7 text-brand" />
                </div>
                <h3 className="text-sm font-semibold text-fd-foreground mb-1.5">{cap.title}</h3>
                <p className="text-xs text-fd-muted-foreground leading-relaxed">{cap.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="mb-16 animate-[fadeInUp_0.8s_ease-out_0.5s_both]">
        <div className="flex flex-col items-center gap-5 p-8 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm text-center">
          <h2 className="text-2xl font-bold text-fd-foreground">
            Simple, Transparent Pricing
          </h2>
          <p className="text-fd-muted-foreground max-w-[500px]">
            Free forever when running locally on your own hardware. Hanzo Cloud
            starts at <span className="text-fd-foreground font-semibold">$5/mo per bot</span> with
            100+ AI models included.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckIcon className="size-4 text-[#00e5cc]" />
              <span className="text-fd-muted-foreground">Free locally, forever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="size-4 text-[#00e5cc]" />
              <span className="text-fd-muted-foreground">Cloud from $5/mo</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="size-4 text-[#00e5cc]" />
              <span className="text-fd-muted-foreground">Cancel anytime</span>
            </div>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-7 py-3 font-semibold text-fd-foreground bg-[rgba(255,255,255,0.05)] border border-fd-border rounded-xl no-underline transition-all hover:-translate-y-0.5 hover:border-brand"
          >
            View Full Pricing
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </section>

      {/* Solutions */}
      <section className="mb-16 animate-[fadeInUp_0.8s_ease-out_0.55s_both]">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-2">
          <span className="text-brand font-bold">&#x27E9;</span> Solutions
        </h2>
        <p className="text-sm text-fd-muted-foreground mb-5">
          Purpose-built AI teams for every department.
        </p>

        <div className="flex flex-wrap gap-3">
          {solutions.map((sol) => (
            <Link
              key={sol.label}
              href={sol.href}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-fd-foreground bg-[rgba(255,255,255,0.05)] border border-fd-border rounded-full no-underline transition-all hover:-translate-y-0.5 hover:border-brand hover:bg-[rgba(255,77,77,0.06)]"
            >
              {sol.label}
              <ArrowRightIcon className="size-3.5" />
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="text-center mb-8 animate-[fadeInUp_0.8s_ease-out_0.6s_both]">
        <Link
          href="/get-started"
          className="inline-flex items-center gap-2.5 px-9 py-4 text-lg font-semibold text-[#050810] bg-gradient-to-br from-brand to-[#e03e3e] rounded-2xl no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(255,77,77,0.45)] shadow-[0_4px_24px_rgba(255,77,77,0.3)]"
        >
          <SparklesIcon className="size-5" />
          Get Started Free
        </Link>
        <p className="mt-3 text-sm text-fd-muted-foreground">
          Free locally. $5/mo in the cloud. Cancel anytime.
        </p>
      </div>
    </main>
  );
}
