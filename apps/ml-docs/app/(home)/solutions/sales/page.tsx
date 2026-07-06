import Link from 'next/link';
import {
  TrendingUpIcon, ArrowRightIcon, TargetIcon, MailIcon,
  CalendarIcon, BrainIcon, RefreshCwIcon, BarChart3Icon,
  SparklesIcon, CheckIcon,
} from 'lucide-react';

const features = [
  { icon: TargetIcon, title: 'Lead Scoring', desc: 'Automatically score and prioritize inbound leads based on fit, intent, and engagement signals.' },
  { icon: MailIcon, title: 'Outbound Sequences', desc: 'Craft and send personalized multi-step outreach. Follow up automatically until you get a response.' },
  { icon: CalendarIcon, title: 'Meeting Scheduling', desc: 'Book meetings directly from conversations. Syncs with Google Calendar, Outlook, and Calendly.' },
  { icon: BrainIcon, title: 'Deal Intelligence', desc: 'Surface deal risks, next steps, and coaching insights from call transcripts and email threads.' },
  { icon: RefreshCwIcon, title: 'CRM Sync', desc: 'Two-way sync with Salesforce, HubSpot, and Pipedrive. Every interaction logged automatically.' },
  { icon: BarChart3Icon, title: 'Pipeline Analytics', desc: 'Real-time dashboards for pipeline health, conversion rates, and revenue forecasting.' },
];

const crms = [
  { name: 'Salesforce', desc: 'Full API integration with leads, contacts, opportunities, and custom objects.' },
  { name: 'HubSpot', desc: 'Native sync for contacts, deals, companies, and engagement tracking.' },
  { name: 'Pipedrive', desc: 'Pipeline stages, activities, and deal management out of the box.' },
];

const steps = [
  { num: '01', title: 'Connect Your CRM', desc: 'One-click integration with Salesforce, HubSpot, or Pipedrive. Import your pipeline instantly.' },
  { num: '02', title: 'Define Your Playbook', desc: 'Set qualification criteria, outreach templates, and escalation rules. The AI adapts to your process.' },
  { num: '03', title: 'Close More Deals', desc: 'AI reps work your pipeline 24/7. Qualify leads, send follow-ups, and book meetings while you sleep.' },
];

export const metadata = {
  title: 'Sales — Solutions — Hanzo Bot',
};

export default function SalesPage() {
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
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[rgba(99,102,241,0.12)]">
            <TrendingUpIcon className="w-6 h-6 text-[#6366F1]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-fd-foreground via-brand to-[#00e5cc] bg-[length:200%_200%] bg-clip-text text-transparent">
            Sales
          </h1>
        </div>
        <p className="text-lg text-fd-muted-foreground max-w-[650px] leading-relaxed">
          AI sales reps that qualify leads, manage your CRM, run outbound sequences, and keep your pipeline
          moving. Never miss a follow-up again.
        </p>
      </header>

      {/* How It Works */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-2">
          <span className="text-brand font-bold">&#x27E9;</span> How It Works
        </h2>
        <p className="text-sm text-fd-muted-foreground mb-5 leading-relaxed">
          From CRM connection to closed deals in three steps.
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
          Everything your sales team needs to close faster.
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

      {/* CRM Integrations */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-2">
          <span className="text-brand font-bold">&#x27E9;</span> CRM Integrations
        </h2>
        <p className="text-sm text-fd-muted-foreground mb-5 leading-relaxed">
          Deep, two-way sync with the CRMs your team already uses.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {crms.map((crm) => (
            <div key={crm.name} className="flex flex-col gap-3 p-5 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[#6366F1]">
              <h3 className="text-base font-semibold text-fd-foreground">{crm.name}</h3>
              <p className="text-xs text-fd-muted-foreground leading-relaxed">{crm.desc}</p>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#00e5cc] font-medium">
                <CheckIcon className="w-3.5 h-3.5" /> Supported
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Metrics */}
      <section className="mb-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: '3x', label: 'More Meetings Booked' },
            { value: '60%', label: 'Faster Lead Response' },
            { value: '0', label: 'Missed Follow-ups' },
            { value: '24/7', label: 'Pipeline Coverage' },
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
        <h2 className="text-2xl font-semibold mb-2">Accelerate your pipeline</h2>
        <p className="text-fd-muted-foreground mb-6 max-w-[500px] mx-auto">
          Deploy AI sales reps that qualify leads and book meetings around the clock.
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
