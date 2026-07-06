import Link from 'next/link';
import {
  MegaphoneIcon, ArrowRightIcon, PenToolIcon, CalendarIcon,
  BarChart3Icon, SearchIcon, MailIcon, FlaskConicalIcon,
  SparklesIcon,
} from 'lucide-react';

const features = [
  { icon: PenToolIcon, title: 'Content Generation', desc: 'Blog posts, landing pages, ad copy, and social captions in your brand voice. Drafts in seconds, not hours.' },
  { icon: CalendarIcon, title: 'Social Scheduling', desc: 'Plan, schedule, and publish across Twitter/X, LinkedIn, Instagram, and more from one place.' },
  { icon: BarChart3Icon, title: 'Campaign Analytics', desc: 'Track performance across channels. Get AI-generated insights on what is working and what to change.' },
  { icon: SearchIcon, title: 'SEO Optimization', desc: 'Keyword research, content scoring, and meta tag generation. Rank higher with less effort.' },
  { icon: MailIcon, title: 'Email Marketing', desc: 'Write, segment, and send email campaigns. Auto-generate subject lines that maximize open rates.' },
  { icon: FlaskConicalIcon, title: 'A/B Testing', desc: 'Generate headline and copy variants automatically. The AI picks winners based on real performance data.' },
];

const workflows = [
  { title: 'Blog Pipeline', desc: 'Research keywords, outline, draft, edit, optimize for SEO, and schedule publishing.' },
  { title: 'Social Campaigns', desc: 'Generate post variations, schedule across platforms, monitor engagement, and adjust strategy.' },
  { title: 'Email Sequences', desc: 'Segment audiences, write personalized emails, A/B test subject lines, and track conversions.' },
  { title: 'Ad Optimization', desc: 'Generate ad copy variants, monitor spend vs. conversions, and reallocate budget automatically.' },
];

const steps = [
  { num: '01', title: 'Define Your Brand', desc: 'Upload brand guidelines, tone of voice docs, and example content. The AI learns to sound like you.' },
  { num: '02', title: 'Connect Channels', desc: 'Link your social accounts, email platform, analytics tools, and CMS. Everything syncs automatically.' },
  { num: '03', title: 'Create & Optimize', desc: 'Generate content, schedule campaigns, and let the AI continuously optimize based on performance data.' },
];

export const metadata = {
  title: 'Marketing — Solutions — Hanzo Bot',
};

export default function MarketingPage() {
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
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[rgba(233,30,99,0.12)]">
            <MegaphoneIcon className="w-6 h-6 text-[#E91E63]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-fd-foreground via-brand to-[#00e5cc] bg-[length:200%_200%] bg-clip-text text-transparent">
            Marketing
          </h1>
        </div>
        <p className="text-lg text-fd-muted-foreground max-w-[650px] leading-relaxed">
          AI marketers that create content, manage social media, analyze campaigns, and optimize spend.
          Your marketing engine runs 24/7 without burning out.
        </p>
      </header>

      {/* How It Works */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-2">
          <span className="text-brand font-bold">&#x27E9;</span> How It Works
        </h2>
        <p className="text-sm text-fd-muted-foreground mb-5 leading-relaxed">
          From brand voice to campaign optimization in three steps.
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

      {/* Features */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-2">
          <span className="text-brand font-bold">&#x27E9;</span> Features
        </h2>
        <p className="text-sm text-fd-muted-foreground mb-5 leading-relaxed">
          A full marketing team in a single AI agent.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="flex flex-col gap-3 p-5 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-brand">
                <Icon className="w-6 h-6 text-brand" />
                <h3 className="text-sm font-bold text-fd-foreground">{f.title}</h3>
                <p className="text-xs text-fd-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Workflows */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-2">
          <span className="text-brand font-bold">&#x27E9;</span> Automated Workflows
        </h2>
        <p className="text-sm text-fd-muted-foreground mb-5 leading-relaxed">
          End-to-end marketing workflows that run on autopilot.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {workflows.map((wf) => (
            <div key={wf.title} className="flex flex-col gap-3 p-5 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[#E91E63]">
              <h3 className="text-base font-semibold text-fd-foreground">{wf.title}</h3>
              <p className="text-xs text-fd-muted-foreground leading-relaxed">{wf.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Metrics */}
      <section className="mb-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: '10x', label: 'Content Output' },
            { value: '50%', label: 'Less Time on Reporting' },
            { value: '3x', label: 'Social Engagement' },
            { value: '24/7', label: 'Campaign Monitoring' },
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
        <h2 className="text-2xl font-semibold mb-2">Supercharge your marketing</h2>
        <p className="text-fd-muted-foreground mb-6 max-w-[500px] mx-auto">
          Deploy AI marketers that create content and optimize campaigns while you sleep.
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
