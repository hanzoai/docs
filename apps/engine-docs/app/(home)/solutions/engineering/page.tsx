import Link from 'next/link';
import {
  CodeIcon, ArrowRightIcon, GitPullRequestIcon, ActivityIcon,
  SirenIcon, FileTextIcon, PackageIcon, ShieldIcon,
  SparklesIcon, CheckIcon,
} from 'lucide-react';

const features = [
  { icon: GitPullRequestIcon, title: 'Code Review', desc: 'Automated PR reviews with inline comments. Catches bugs, style issues, and security vulnerabilities before merge.' },
  { icon: ActivityIcon, title: 'CI/CD Monitor', desc: 'Watches your pipelines, diagnoses failures, and suggests fixes. Get notified on Slack or Discord instantly.' },
  { icon: SirenIcon, title: 'Incident Response', desc: 'Triages alerts from PagerDuty and Datadog. Runs initial diagnostics and proposes remediation steps.' },
  { icon: FileTextIcon, title: 'Doc Generation', desc: 'Generates and maintains API docs, READMEs, changelogs, and architecture decision records from your code.' },
  { icon: PackageIcon, title: 'Dependency Management', desc: 'Tracks outdated packages, evaluates upgrade risks, and creates PRs for safe dependency updates.' },
  { icon: ShieldIcon, title: 'Security Scanning', desc: 'Continuous vulnerability scanning across dependencies, container images, and infrastructure as code.' },
];

const integrations = [
  { name: 'GitHub', desc: 'PRs, issues, actions, code search, and repository management.' },
  { name: 'GitLab', desc: 'Merge requests, CI pipelines, and project management.' },
  { name: 'Jira', desc: 'Issue tracking, sprint management, and status updates.' },
  { name: 'PagerDuty', desc: 'Incident alerts, on-call routing, and escalation policies.' },
  { name: 'Datadog', desc: 'Metrics, logs, traces, and APM data for diagnostics.' },
];

const steps = [
  { num: '01', title: 'Connect Your Stack', desc: 'Link GitHub, GitLab, Jira, PagerDuty, and your monitoring tools. The agent understands your codebase.' },
  { num: '02', title: 'Set Review Policies', desc: 'Define coding standards, security requirements, and incident response runbooks. The AI follows your rules.' },
  { num: '03', title: 'Ship Faster', desc: 'Automated reviews, instant incident triage, and docs that update themselves. Your team focuses on building.' },
];

export const metadata = {
  title: 'Engineering — Solutions — Hanzo Bot',
};

export default function EngineeringPage() {
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
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[rgba(0,229,204,0.12)]">
            <CodeIcon className="w-6 h-6 text-[#00E5CC]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-fd-foreground via-brand to-[#00e5cc] bg-[length:200%_200%] bg-clip-text text-transparent">
            Engineering
          </h1>
        </div>
        <p className="text-lg text-fd-muted-foreground max-w-[650px] leading-relaxed">
          AI engineers that review code, monitor CI/CD, respond to incidents, and keep your documentation
          up to date. Your team ships faster with less toil.
        </p>
      </header>

      {/* How It Works */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-2">
          <span className="text-brand font-bold">&#x27E9;</span> How It Works
        </h2>
        <p className="text-sm text-fd-muted-foreground mb-5 leading-relaxed">
          From repo connection to automated engineering workflows.
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
          An AI engineering teammate that handles the work nobody wants to do.
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

      {/* Integrations */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-2">
          <span className="text-brand font-bold">&#x27E9;</span> Dev Tool Integrations
        </h2>
        <p className="text-sm text-fd-muted-foreground mb-5 leading-relaxed">
          Connects to the tools your engineering team already relies on.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((intg) => (
            <div key={intg.name} className="flex flex-col gap-3 p-5 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[#00e5cc]">
              <h3 className="text-base font-semibold text-fd-foreground">{intg.name}</h3>
              <p className="text-xs text-fd-muted-foreground leading-relaxed">{intg.desc}</p>
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
            { value: '< 2min', label: 'PR Review Time' },
            { value: '70%', label: 'Faster Incident Triage' },
            { value: '0', label: 'Stale Documentation' },
            { value: '24/7', label: 'Pipeline Monitoring' },
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
        <h2 className="text-2xl font-semibold mb-2">Level up your engineering team</h2>
        <p className="text-fd-muted-foreground mb-6 max-w-[500px] mx-auto">
          Deploy AI engineers that review code, triage incidents, and maintain docs automatically.
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
