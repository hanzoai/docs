import Link from 'next/link';
import {
  HeadsetIcon, TrendingUpIcon, CodeIcon, MegaphoneIcon,
  SettingsIcon, MonitorIcon, ArrowRightIcon, SparklesIcon,
} from 'lucide-react';

const solutions = [
  {
    icon: HeadsetIcon,
    title: 'Customer Support',
    desc: '24/7 AI agents across WhatsApp, Slack, Discord, email. Auto-escalate complex issues to humans when needed.',
    href: '/solutions/customer-support',
    color: '#25D366',
  },
  {
    icon: TrendingUpIcon,
    title: 'Sales',
    desc: 'AI reps that qualify leads, manage your CRM, send outbound sequences, and keep your pipeline moving.',
    href: '/solutions/sales',
    color: '#6366F1',
  },
  {
    icon: CodeIcon,
    title: 'Engineering',
    desc: 'AI engineers for code review, CI/CD monitoring, incident response, and documentation maintenance.',
    href: '/solutions/engineering',
    color: '#00E5CC',
  },
  {
    icon: MegaphoneIcon,
    title: 'Marketing',
    desc: 'Content creation, social media management, campaign analysis, and ad spend optimization.',
    href: '/solutions/marketing',
    color: '#E91E63',
  },
  {
    icon: SettingsIcon,
    title: 'Operations',
    desc: 'Process automation, system monitoring, reporting, and compliance tracking on autopilot.',
    href: '/solutions/operations',
    color: '#F59E0B',
  },
  {
    icon: MonitorIcon,
    title: 'Platform',
    desc: 'The complete AI workforce platform. Deploy, manage, and scale your entire AI team from one dashboard.',
    href: '/platform',
    color: '#FF4D4D',
  },
];

export const metadata = {
  title: 'Solutions — Hanzo Bot',
};

export default function SolutionsPage() {
  return (
    <main className="relative z-[1] max-w-[1000px] mx-auto px-6 py-10">
      <div className="stars" />
      <div className="nebula" />

      <header className="text-center mb-12 animate-[fadeInUp_0.6s_ease-out]">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-br from-fd-foreground via-brand to-[#00e5cc] bg-[length:200%_200%] bg-clip-text text-transparent">
          Solutions
        </h1>
        <p className="text-lg text-fd-muted-foreground max-w-[600px] mx-auto leading-relaxed">
          AI agents purpose-built for every department.
          <br />
          Deploy in minutes. Results from day one.
        </p>
      </header>

      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-2">
          <span className="text-brand font-bold">&#x27E9;</span> AI for Every Team
        </h2>
        <p className="text-sm text-fd-muted-foreground mb-5 leading-relaxed">
          Each solution comes pre-configured with the skills, integrations, and workflows your team needs.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {solutions.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.title}
                href={s.href}
                className="group flex flex-col gap-4 p-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm no-underline text-inherit transition-all hover:-translate-y-1 hover:border-brand hover:shadow-[0_12px_40px_rgba(255,77,77,0.2)]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl"
                    style={{ backgroundColor: `${s.color}15`, color: s.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-fd-foreground">{s.title}</h3>
                </div>
                <p className="text-sm text-fd-muted-foreground leading-relaxed flex-1">{s.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-sm text-brand font-medium group-hover:gap-2.5 transition-all">
                  Learn more <ArrowRightIcon className="w-4 h-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why Hanzo Solutions */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-5">
          <span className="text-brand font-bold">&#x27E9;</span> Why Hanzo Solutions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'Deploy in Minutes', desc: 'Pre-built workflows and integrations. Connect your tools and go live the same day.' },
            { title: 'Always Learning', desc: 'Agents improve from every interaction. Train on your data, your processes, your voice.' },
            { title: 'Human in the Loop', desc: 'Smart escalation ensures humans handle what matters. AI handles the rest.' },
          ].map((item) => (
            <div key={item.title} className="flex flex-col gap-3 p-5 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-brand">
              <h3 className="text-sm font-bold text-fd-foreground">{item.title}</h3>
              <p className="text-xs text-fd-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center p-12 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm mb-10">
        <h2 className="text-2xl font-semibold mb-2">Ready to deploy your AI team?</h2>
        <p className="text-fd-muted-foreground mb-6 max-w-[500px] mx-auto">
          Start with one solution or deploy them all. Free locally, $5/mo in the cloud.
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
            href="/docs"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-fd-foreground bg-[rgba(255,255,255,0.05)] border border-fd-border no-underline transition-all hover:-translate-y-0.5 hover:border-brand"
          >
            Read the Docs
          </Link>
        </div>
      </section>
    </main>
  );
}
