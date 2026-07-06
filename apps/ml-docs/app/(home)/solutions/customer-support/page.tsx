import Link from 'next/link';
import {
  HeadsetIcon, ArrowRightIcon, MessageSquareIcon, HashIcon,
  MessageCircleIcon, MailIcon, GlobeIcon, SmartphoneIcon,
  LanguagesIcon, TagIcon, HeartPulseIcon, ArrowUpRightIcon,
  BookOpenIcon, ShieldCheckIcon, CheckIcon, SparklesIcon,
} from 'lucide-react';

const channels = [
  { icon: MessageSquareIcon, name: 'WhatsApp', desc: 'QR pairing, group and 1:1 support', color: '#25D366' },
  { icon: HashIcon, name: 'Slack', desc: 'Workspace channels and DMs', color: '#E01E5A' },
  { icon: MessageCircleIcon, name: 'Discord', desc: 'Server threads and ticket channels', color: '#5865F2' },
  { icon: MailIcon, name: 'Email', desc: 'Inbox monitoring and auto-reply', color: '#EA4335' },
  { icon: GlobeIcon, name: 'Web Chat', desc: 'Embeddable widget for your site', color: '#00E5CC' },
  { icon: SmartphoneIcon, name: 'SMS', desc: 'Twilio-powered text support', color: '#F22F46' },
];

const capabilities = [
  { icon: LanguagesIcon, title: '100+ Languages', desc: 'Auto-detect and respond in your customer\'s language. No configuration needed.' },
  { icon: TagIcon, title: 'Ticket Classification', desc: 'Automatically categorize, tag, and route tickets to the right team.' },
  { icon: HeartPulseIcon, title: 'Sentiment Analysis', desc: 'Detect frustrated customers in real-time and prioritize accordingly.' },
  { icon: ArrowUpRightIcon, title: 'Smart Escalation', desc: 'Seamlessly hand off to human agents with full conversation context.' },
  { icon: BookOpenIcon, title: 'Knowledge Base', desc: 'Train on your docs, FAQs, and past tickets for accurate answers.' },
  { icon: ShieldCheckIcon, title: 'Secure & Compliant', desc: 'SOC 2 ready. Data encrypted at rest and in transit. Your data stays yours.' },
];

const steps = [
  { num: '01', title: 'Connect Channels', desc: 'Link WhatsApp, Slack, Discord, email, or any channel in minutes. No code required.' },
  { num: '02', title: 'Train on Your Data', desc: 'Upload docs, FAQs, past tickets, and product info. The agent learns your voice and policies.' },
  { num: '03', title: 'Go Live', desc: 'Deploy and start resolving tickets immediately. Monitor, tune, and improve over time.' },
];

export const metadata = {
  title: 'Customer Support — Solutions — Hanzo Bot',
};

export default function CustomerSupportPage() {
  return (
    <main className="relative z-[1] max-w-[1000px] mx-auto px-6 py-10">
      <div className="stars" />
      <div className="nebula" />

      {/* Breadcrumb */}
      <nav className="mb-8 animate-[fadeInUp_0.4s_ease-out]">
        <Link href="/solutions" className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground hover:text-brand transition-colors no-underline">
          <ArrowRightIcon className="w-3.5 h-3.5 rotate-180" />
          Solutions
        </Link>
      </nav>

      {/* Hero */}
      <header className="mb-14 animate-[fadeInUp_0.6s_ease-out]">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[rgba(37,211,102,0.12)]">
            <HeadsetIcon className="w-6 h-6 text-[#25D366]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-fd-foreground via-brand to-[#00e5cc] bg-[length:200%_200%] bg-clip-text text-transparent">
            Customer Support
          </h1>
        </div>
        <p className="text-lg text-fd-muted-foreground max-w-[650px] leading-relaxed">
          24/7 AI support agents that resolve tickets across every channel your customers use.
          Instant responses, smart escalation, and continuous learning from every interaction.
        </p>
      </header>

      {/* How It Works */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-2">
          <span className="text-brand font-bold">&#x27E9;</span> How It Works
        </h2>
        <p className="text-sm text-fd-muted-foreground mb-5 leading-relaxed">
          Three steps to 24/7 AI-powered customer support.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col gap-3 p-5 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-brand">
              <span className="text-2xl font-bold text-brand">{step.num}</span>
              <h3 className="text-sm font-bold text-fd-foreground">{step.title}</h3>
              <p className="text-xs text-fd-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Channels */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-2">
          <span className="text-brand font-bold">&#x27E9;</span> Multi-Channel Support
        </h2>
        <p className="text-sm text-fd-muted-foreground mb-5 leading-relaxed">
          One agent, every channel. Your customers get help wherever they are.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {channels.map((ch) => {
            const Icon = ch.icon;
            return (
              <div
                key={ch.name}
                className="flex flex-col items-center text-center gap-3 p-5 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-brand hover:shadow-[0_12px_40px_rgba(255,77,77,0.15)]"
              >
                <Icon className="w-7 h-7" style={{ color: ch.color }} />
                <h3 className="text-sm font-semibold text-fd-foreground">{ch.name}</h3>
                <p className="text-xs text-fd-muted-foreground leading-snug">{ch.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Capabilities */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-2">
          <span className="text-brand font-bold">&#x27E9;</span> Capabilities
        </h2>
        <p className="text-sm text-fd-muted-foreground mb-5 leading-relaxed">
          Enterprise-grade features that make your support team superhuman.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div key={cap.title} className="flex flex-col gap-3 p-5 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-brand">
                <Icon className="w-6 h-6 text-brand" />
                <h3 className="text-sm font-bold text-fd-foreground">{cap.title}</h3>
                <p className="text-xs text-fd-muted-foreground leading-relaxed">{cap.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Metrics */}
      <section className="mb-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: '< 5s', label: 'Avg Response Time' },
            { value: '85%', label: 'Auto-Resolution Rate' },
            { value: '24/7', label: 'Availability' },
            { value: '100+', label: 'Languages Supported' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 p-5 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm text-center">
              <span className="text-2xl font-bold text-brand">{stat.value}</span>
              <span className="text-xs text-fd-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center p-12 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm mb-10">
        <h2 className="text-2xl font-semibold mb-2">Transform your customer support</h2>
        <p className="text-fd-muted-foreground mb-6 max-w-[500px] mx-auto">
          Deploy AI support agents that resolve tickets faster and never sleep.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="https://app.hanzo.bot/auth/signup"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[#050810] bg-gradient-to-br from-brand to-[#e03e3e] no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(255,77,77,0.45)] shadow-[0_4px_24px_rgba(255,77,77,0.3)]"
          >
            <SparklesIcon className="w-5 h-5" />
            Get Started Free
          </a>
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-fd-foreground bg-[rgba(255,255,255,0.05)] border border-fd-border no-underline transition-all hover:-translate-y-0.5 hover:border-brand"
          >
            View All Solutions
          </Link>
        </div>
      </section>
    </main>
  );
}
