import Link from 'next/link';
import { cn } from '@/lib/cn';
import { cva } from 'class-variance-authority';
import {
  HomeIcon, MessageCircleIcon, BrainIcon, GlobeIcon,
  TerminalIcon, PuzzleIcon, MonitorIcon, ShieldIcon,
  DownloadIcon, LogInIcon, UsersIcon, BookOpenIcon,
  CheckIcon, ArrowRightIcon, SparklesIcon,
  WalletIcon, StoreIcon, CpuIcon, LockKeyholeIcon,
  CoinsIcon, BotIcon, ZapIcon, NetworkIcon,
} from 'lucide-react';
import testimonials from '@/data/testimonials.json';
import { TestimonialCarousel } from './_components/testimonial-carousel';
import { InstallTabs } from './_components/install-tabs';
import { IntegrationPills } from './_components/integration-pills';
import { NinjaHero } from './_components/ninja-hero';

const headingVariants = cva('font-medium tracking-tight', {
  variants: {
    variant: {
      h1: 'text-4xl lg:text-5xl xl:text-6xl',
      h2: 'text-3xl lg:text-4xl',
      h3: 'text-xl lg:text-2xl',
    },
  },
});

const models = [
  { provider: 'Anthropic', names: 'Claude Opus 4.6, Sonnet 4.5' },
  { provider: 'OpenAI', names: 'GPT-5.2, GPT-5.1 Codex' },
  { provider: 'Google', names: 'Gemini 3 Pro, Flash' },
  { provider: 'Open Source', names: 'Qwen 3, GLM 4.7, Llama' },
  { provider: 'Together AI', names: 'DeepSeek, Mixtral, more' },
  { provider: 'OpenRouter', names: '100+ models, one API' },
];

const features = [
  { icon: HomeIcon, title: 'Runs on Your Machine', desc: 'Mac, Windows, or Linux. Anthropic, OpenAI, or local models. Private by default\u2014your data stays yours.', href: 'https://github.com/hanzoai/bot' },
  { icon: MessageCircleIcon, title: 'Any Chat App', desc: 'Talk to it on WhatsApp, Telegram, Discord, Slack, Signal, or iMessage. Works in DMs and group chats.', href: '/integrations' },
  { icon: BrainIcon, title: 'Persistent Memory', desc: 'Remembers you and becomes uniquely yours. Your preferences, your context, your AI.', href: 'https://github.com/hanzoai/bot' },
  { icon: GlobeIcon, title: 'Browser Control', desc: 'It can browse the web, fill forms, and extract data from any site.', href: 'https://github.com/hanzoai/bot' },
  { icon: TerminalIcon, title: 'Full System Access', desc: 'Read and write files, run shell commands, execute scripts. Full access or sandboxed\u2014your choice.', href: 'https://github.com/hanzoai/bot' },
  { icon: PuzzleIcon, title: 'Skills & Plugins', desc: 'Extend with community skills or build your own. It can even write its own.', href: '/skills' },
];

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Run locally on your own hardware.',
    cta: 'Download Free',
    ctaHref: '#quickstart',
    features: [
      'Runs on Mac, Windows, Linux',
      'Bring your own API keys',
      'All chat integrations',
      'Full system access',
      'Community skills & plugins',
      'Browse marketplace listings',
    ],
  },
  {
    name: 'Cloud',
    price: '$5',
    period: '/mo per bot',
    desc: 'Full VM in Hanzo Cloud. Always on.',
    cta: 'Start Free Trial',
    ctaHref: 'https://app.hanzo.bot/auth/signup?plan=cloud',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Full Linux desktop VM',
      '100+ AI models included',
      'Bot wallet with AI coin funding',
      'Marketplace buying & selling',
      'Auto-purchase compute rules',
      'Persistent memory & files',
    ],
  },
  {
    name: 'Cloud Pro',
    price: '$25',
    period: '/mo per bot',
    desc: 'Mac or Windows VM for native apps.',
    cta: 'Get Started',
    ctaHref: 'https://app.hanzo.bot/auth/signup?plan=cloud-pro',
    features: [
      'macOS or Windows desktop VM',
      'Confidential computing (TEE)',
      'Priority model access',
      'On-chain settlement & earnings',
      'Custom agent marketplace listings',
      'Priority support',
    ],
  },
];

export default function Page() {
  return (
    <main className="relative z-[1] max-w-[860px] mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-10 overflow-hidden">
      <div className="stars" />
      <div className="nebula" />

      {/* Hero */}
      <header className="text-center mb-16 animate-[fadeInUp_0.8s_ease-out]">
        <NinjaHero />

        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 leading-[1.1]">
          <span className="bg-gradient-to-br from-fd-foreground via-brand to-[#00e5cc] bg-[length:200%_200%] bg-clip-text text-transparent animate-[gradientShift_6s_ease_infinite]">
            Your AI Team.
          </span>
          <br />
          <span className="text-fd-foreground">In a Box.</span>
        </h1>

        <p className="text-brand text-sm font-medium tracking-[0.15em] uppercase mb-6 animate-[fadeInUp_0.8s_ease-out_0.15s_both]">
          One bot. Every role. Every channel.
        </p>

        <p className="text-base sm:text-lg text-fd-muted-foreground max-w-[680px] mx-auto leading-relaxed animate-[fadeInUp_0.8s_ease-out_0.3s_both]">
          Stop hiring for every role. Hanzo Bot is a full-blown computer-using AI agent that runs locally
          on your Mac or deploys to Hanzo Cloud. Fund bots with real money, let them autonomously buy
          compute on the AI Capacity Marketplace, and settle on-chain. One platform for AI teams that
          code, design, test, ship, and earn.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-[fadeInUp_0.8s_ease-out_0.45s_both]">
          <Link
            href="/get-started"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-semibold text-[#050810] bg-gradient-to-br from-brand to-[#e03e3e] rounded-xl no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(255,77,77,0.45)] shadow-[0_4px_24px_rgba(255,77,77,0.3)]"
          >
            <DownloadIcon className="w-5 h-5" />
            Get Started Free
          </Link>
          <a
            href="https://app.hanzo.bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-semibold text-fd-foreground bg-[rgba(255,255,255,0.05)] border border-fd-border rounded-xl no-underline transition-all hover:-translate-y-0.5 hover:bg-[rgba(0,229,204,0.08)] hover:border-[#00e5cc] hover:shadow-[0_8px_40px_rgba(0,229,204,0.2)]"
          >
            <LogInIcon className="w-5 h-5" />
            Launch in Cloud &mdash; $5/mo
          </a>
        </div>
      </header>

      {/* Why You Need a Bot */}
      <section className="mb-14 animate-[fadeInUp_0.8s_ease-out_0.5s_both]">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-5">
          <span className="text-brand font-bold">&#x27E9;</span> Why Everyone Needs Their Own Bot
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { emoji: '💸', title: 'Save $200K+/yr', desc: 'One bot replaces the cost of multiple specialized hires. Fund it once, let it buy its own compute.' },
            { emoji: '⚡', title: 'Ship 10x Faster', desc: 'Instant code reviews, automated testing, docs written as you code. Bots auto-purchase capacity as they need it.' },
            { emoji: '🔒', title: 'Private by Default', desc: 'Confidential computing with hardware-level isolation. Your data stays encrypted, even from the host.' },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center gap-3 p-5 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-brand">
              <span className="text-3xl">{item.emoji}</span>
              <h3 className="text-sm font-bold text-fd-foreground">{item.title}</h3>
              <p className="text-xs text-fd-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Models */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-5">
          <span className="text-brand font-bold">&#x27E9;</span> 100+ AI Models
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {models.map((m) => (
            <div key={m.provider} className="flex flex-col gap-1 p-4 rounded-xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm transition-all hover:border-brand hover:-translate-y-0.5">
              <span className="text-xs font-semibold text-brand uppercase tracking-wider">{m.provider}</span>
              <span className="text-sm text-fd-muted-foreground">{m.names}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-fd-muted-foreground">
          Bring your own API keys or use Hanzo Cloud for instant access to all models.
        </p>
      </section>

      {/* Testimonials */}
      <TestimonialCarousel testimonials={testimonials} />

      {/* Install Tabs */}
      <div id="quickstart">
        <InstallTabs />
      </div>

      {/* Features */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-5">
          <span className="text-brand font-bold">&#x27E9;</span> What It Does
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            const isExternal = f.href.startsWith('http');
            const El = isExternal ? 'a' : Link;
            const props = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};
            return (
              <El
                key={f.title}
                href={f.href}
                {...props}
                className="block p-5 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm no-underline text-inherit transition-all hover:-translate-y-1 hover:border-brand hover:shadow-[0_12px_40px_rgba(255,77,77,0.2)]"
              >
                <div className="flex items-center justify-center mb-3">
                  <Icon className="w-7 h-7 text-brand" />
                </div>
                <h3 className="text-sm font-semibold text-fd-foreground mb-1.5">{f.title}</h3>
                <p className="text-xs text-fd-muted-foreground leading-relaxed">{f.desc}</p>
              </El>
            );
          })}
        </div>
      </section>

      {/* Integrations */}
      <IntegrationPills />

      {/* Marketplace & Economy */}
      <section className="mb-14" id="marketplace">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-2">
          <span className="text-brand font-bold">&#x27E9;</span> AI Capacity Marketplace
        </h2>
        <p className="text-sm text-fd-muted-foreground mb-6">
          Buy and sell AI compute. Fund your bots. Let them purchase autonomously.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: StoreIcon,
              title: 'Buy & Sell Compute',
              desc: 'A real marketplace for AI capacity — Claude Code sessions, GPU hours, custom agents, API keys. List your spare capacity or buy what you need.',
              tag: 'Marketplace',
            },
            {
              icon: WalletIcon,
              title: 'Bot Wallets',
              desc: 'Each bot gets a real on-chain wallet. Fund it with AI coin or USD. Bots spend from their own balance to purchase compute autonomously.',
              tag: 'On-Chain',
            },
            {
              icon: ZapIcon,
              title: 'Auto-Purchase Rules',
              desc: 'Set rules for what your bot can buy — capacity type, max price, preferred model. When balance dips, bots buy more compute automatically.',
              tag: 'Autonomous',
            },
            {
              icon: LockKeyholeIcon,
              title: 'Confidential Computing',
              desc: 'NVIDIA Blackwell TEE for hardware-encrypted execution. Attestation verification, encrypted memory, zero-trust compute on the marketplace.',
              tag: 'TEE',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col gap-3 p-5 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[#00e5cc] hover:shadow-[0_12px_40px_rgba(0,229,204,0.15)]"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-[#00e5cc]" />
                  <h3 className="text-sm font-bold text-fd-foreground">{item.title}</h3>
                  <span className="ml-auto px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#00e5cc] border border-[rgba(0,229,204,0.3)] rounded-full">
                    {item.tag}
                  </span>
                </div>
                <p className="text-xs text-fd-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { icon: BotIcon, label: 'Custom Agents', desc: 'DID-backed trained agents for rent' },
            { icon: CoinsIcon, label: 'AI Coin Settlement', desc: 'On-chain payments & earnings' },
            { icon: NetworkIcon, label: 'Decentralized', desc: 'Anyone can list & sell capacity' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex flex-col items-center text-center gap-2 p-4 rounded-xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm transition-all hover:border-[#00e5cc]">
                <Icon className="w-5 h-5 text-[#00e5cc]" />
                <span className="text-xs font-semibold text-fd-foreground">{item.label}</span>
                <span className="text-[10px] text-fd-muted-foreground">{item.desc}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing */}
      <section className="mb-14" id="pricing">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-2">
          <span className="text-brand font-bold">&#x27E9;</span> Simple Pricing
        </h2>
        <p className="text-sm text-fd-muted-foreground mb-6">
          Get started free. Scale when you&apos;re ready.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {pricingTiers.map((tier) => (
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
                target={tier.ctaHref.startsWith('http') ? '_blank' : undefined}
                rel={tier.ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
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
        </div>
        <div className="mt-6 text-center">
          <Link href="/pricing" className="text-sm text-brand font-medium hover:text-[#00e5cc] transition-colors no-underline">
            View full pricing & FAQ →
          </Link>
        </div>
      </section>

      {/* Why Hanzo Bot */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-5">
          <span className="text-brand font-bold">&#x27E9;</span> Why Hanzo Bot
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-[rgba(255,77,77,0.3)] bg-gradient-to-br from-[rgba(255,77,77,0.05)] to-[rgba(10,15,26,0.7)] backdrop-blur-sm text-center transition-all hover:-translate-y-1 hover:border-brand hover:shadow-[0_12px_40px_rgba(255,77,77,0.15)]">
            <div className="flex items-center gap-2.5">
              <MonitorIcon className="w-7 h-7 text-fd-muted-foreground" />
              <span className="text-lg font-semibold text-fd-muted-foreground">Full Desktop VMs</span>
            </div>
            <blockquote className="text-sm font-medium leading-relaxed italic">
              Each agent gets a full cloud desktop environment. Browse, code, design &mdash; just like a real team member.
            </blockquote>
            <span className="text-sm text-brand font-medium">Powered by Hanzo Cloud</span>
          </div>
          <div className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.7)] backdrop-blur-sm text-center transition-all hover:-translate-y-1 hover:border-brand hover:shadow-[0_12px_40px_rgba(255,77,77,0.15)]">
            <div className="flex items-center gap-2.5">
              <WalletIcon className="w-7 h-7 text-fd-muted-foreground" />
              <span className="text-lg font-semibold text-fd-muted-foreground">Real Bot Wallets</span>
            </div>
            <blockquote className="text-sm font-medium leading-relaxed italic">
              Fund your bots with AI coin or USD. They hold real balances, buy their own compute, and settle on-chain. Autonomous economic agents.
            </blockquote>
            <span className="text-sm text-[#00e5cc] font-medium">On-Chain Settlement</span>
          </div>
          <div className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.7)] backdrop-blur-sm text-center transition-all hover:-translate-y-1 hover:border-brand hover:shadow-[0_12px_40px_rgba(255,77,77,0.15)]">
            <div className="flex items-center gap-2.5">
              <LockKeyholeIcon className="w-7 h-7 text-fd-muted-foreground" />
              <span className="text-lg font-semibold text-fd-muted-foreground">Confidential Compute</span>
            </div>
            <blockquote className="text-sm font-medium leading-relaxed italic">
              NVIDIA Blackwell TEE hardware enclaves. Your code and data stay encrypted in memory. Attestation-verified, zero-trust execution.
            </blockquote>
            <span className="text-sm text-[#00e5cc] font-medium">Hardware-Level Security</span>
          </div>
          <div className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.7)] backdrop-blur-sm text-center transition-all hover:-translate-y-1 hover:border-brand hover:shadow-[0_12px_40px_rgba(255,77,77,0.15)]">
            <div className="flex items-center gap-2.5">
              <ShieldIcon className="w-7 h-7 text-fd-muted-foreground" />
              <span className="text-lg font-semibold text-fd-muted-foreground">Secure by Default</span>
            </div>
            <blockquote className="text-sm font-medium leading-relaxed italic">
              Your data stays yours. Hanzo IAM for auth, encrypted at rest, isolated per-agent. No data leaves your infrastructure.
            </blockquote>
            <span className="text-sm text-brand font-medium">Enterprise Ready</span>
          </div>
        </div>
      </section>

      {/* Explore Hanzo Ecosystem */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-5">
          <span className="text-brand font-bold">&#x27E9;</span> The Hanzo Ecosystem
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { name: 'LLM Gateway', desc: '200+ AI models, one API', href: 'https://docs.hanzo.ai/docs/llm' },
            { name: 'Marketplace', desc: 'Buy & sell AI capacity', href: 'https://app.hanzo.bot' },
            { name: 'MCP', desc: '260+ tools for agents', href: 'https://docs.hanzo.ai/docs/mcp' },
            { name: 'Commerce', desc: 'Billing & on-chain settlement', href: 'https://docs.hanzo.ai/docs/commerce' },
            { name: 'Operative', desc: 'Computer use for AI', href: 'https://docs.hanzo.ai/docs/operative' },
            { name: 'Platform', desc: 'Deploy anywhere', href: 'https://docs.hanzo.ai/docs/platform' },
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
          href="https://app.hanzo.bot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-9 py-4 text-lg font-semibold text-[#050810] bg-gradient-to-br from-brand to-[#e03e3e] rounded-2xl no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(255,77,77,0.45)] shadow-[0_4px_24px_rgba(255,77,77,0.3)]"
        >
          <SparklesIcon className="w-5 h-5" />
          Deploy Your AI Team
        </a>
        <p className="mt-3 text-sm text-fd-muted-foreground">Free locally. $5/mo in the cloud. Fund your bots. Let them earn.</p>
      </div>

      {/* CTA Grid */}
      <nav className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
        {[
          { href: 'https://app.hanzo.bot', icon: UsersIcon, label: 'Dashboard', sub: 'Launch app.hanzo.bot', className: 'border-[rgba(255,77,77,0.25)] bg-[rgba(255,77,77,0.06)] hover:border-brand hover:shadow-[0_12px_40px_rgba(255,77,77,0.25)]' },
          { href: 'https://discord.gg/hanzo', icon: MessageCircleIcon, label: 'Discord', sub: 'Join community', className: 'hover:border-[#5865F2] hover:shadow-[0_12px_40px_rgba(88,101,242,0.2)]' },
          { href: 'https://github.com/hanzoai/bot', icon: GlobeIcon, label: 'GitHub', sub: 'View source', className: 'hover:border-fd-foreground hover:shadow-[0_12px_40px_rgba(240,244,255,0.1)]' },
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
