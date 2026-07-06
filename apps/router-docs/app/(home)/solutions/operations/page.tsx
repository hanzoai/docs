import Link from 'next/link';
import {
  SettingsIcon, ArrowRightIcon, WorkflowIcon, ActivityIcon,
  FileBarChartIcon, ShieldCheckIcon, LayoutDashboardIcon,
  HandshakeIcon, SparklesIcon,
} from 'lucide-react';

const features = [
  { icon: WorkflowIcon, title: 'Workflow Automation', desc: 'Automate repetitive processes end-to-end. Approvals, handoffs, and notifications all run on their own.' },
  { icon: ActivityIcon, title: 'System Monitoring', desc: 'Track uptime, resource usage, and performance across your infrastructure. Get alerts before things break.' },
  { icon: FileBarChartIcon, title: 'Report Generation', desc: 'Daily, weekly, and monthly reports generated automatically. Custom dashboards for every stakeholder.' },
  { icon: ShieldCheckIcon, title: 'Compliance Tracking', desc: 'Monitor regulatory requirements, flag violations, and maintain audit trails automatically.' },
  { icon: LayoutDashboardIcon, title: 'Resource Planning', desc: 'Forecast demand, optimize capacity, and track utilization across teams and infrastructure.' },
  { icon: HandshakeIcon, title: 'Vendor Management', desc: 'Track contracts, SLAs, renewals, and spending. Get alerts before deadlines and budget overruns.' },
];

const automations = [
  { title: 'Employee Onboarding', desc: 'Provision accounts, schedule orientation, assign training, and track completion across all systems.' },
  { title: 'Expense Processing', desc: 'Auto-categorize receipts, validate against policies, route for approval, and sync to accounting.' },
  { title: 'Infrastructure Scaling', desc: 'Monitor usage patterns, predict demand, auto-scale resources, and report on cost optimization.' },
  { title: 'Compliance Audits', desc: 'Collect evidence, verify controls, generate audit reports, and track remediation tasks.' },
];

const steps = [
  { num: '01', title: 'Map Your Processes', desc: 'Define the workflows you want to automate. The AI analyzes your current processes and suggests improvements.' },
  { num: '02', title: 'Connect Systems', desc: 'Integrate your tools, databases, and communication channels. The agent orchestrates across all of them.' },
  { num: '03', title: 'Automate & Monitor', desc: 'Deploy automated workflows and track everything from a single dashboard. Adjust rules as your needs evolve.' },
];

export const metadata = {
  title: 'Operations — Solutions — Hanzo Bot',
};

export default function OperationsPage() {
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
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[rgba(245,158,11,0.12)]">
            <SettingsIcon className="w-6 h-6 text-[#F59E0B]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-fd-foreground via-brand to-[#00e5cc] bg-[length:200%_200%] bg-clip-text text-transparent">
            Operations
          </h1>
        </div>
        <p className="text-lg text-fd-muted-foreground max-w-[650px] leading-relaxed">
          AI operations agents that automate processes, monitor systems, generate reports, and
          keep your business running smoothly around the clock.
        </p>
      </header>

      {/* How It Works */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-2">
          <span className="text-brand font-bold">&#x27E9;</span> How It Works
        </h2>
        <p className="text-sm text-fd-muted-foreground mb-5 leading-relaxed">
          From process mapping to full automation in three steps.
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
          <span className="text-brand font-bold">&#x27E9;</span> Capabilities
        </h2>
        <p className="text-sm text-fd-muted-foreground mb-5 leading-relaxed">
          Everything your ops team needs to eliminate manual work.
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

      {/* Automation Examples */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-2">
          <span className="text-brand font-bold">&#x27E9;</span> Automation Examples
        </h2>
        <p className="text-sm text-fd-muted-foreground mb-5 leading-relaxed">
          Real workflows that teams automate with Hanzo Bot.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {automations.map((auto) => (
            <div key={auto.title} className="flex flex-col gap-3 p-5 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[#F59E0B]">
              <h3 className="text-base font-semibold text-fd-foreground">{auto.title}</h3>
              <p className="text-xs text-fd-muted-foreground leading-relaxed">{auto.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Metrics */}
      <section className="mb-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: '80%', label: 'Less Manual Work' },
            { value: '< 1min', label: 'Report Generation' },
            { value: '99.9%', label: 'Process Uptime' },
            { value: '24/7', label: 'System Monitoring' },
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
        <h2 className="text-2xl font-semibold mb-2">Automate your operations</h2>
        <p className="text-fd-muted-foreground mb-6 max-w-[500px] mx-auto">
          Deploy AI ops agents that handle processes, monitoring, and compliance on autopilot.
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
