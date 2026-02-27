import { cn } from '@/lib/cn';
import { cva } from 'class-variance-authority';
import Image from 'next/image';
import {
  ArrowRightIcon,
  CheckSquareIcon,
  BookOpenIcon,
  MessageSquareIcon,
  ClockIcon,
  ZapIcon,
  CodeIcon,
  GithubIcon,
  KeyboardIcon,
  CalendarIcon,
  BellIcon,
  LayoutGridIcon,
} from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-white text-black hover:bg-white/90',
        secondary:
          'border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20',
        ghost: 'text-text-muted hover:text-white',
      },
      size: {
        lg: 'px-8 py-4 text-lg',
        md: 'px-6 py-3 text-base',
        sm: 'px-4 py-2 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

const features = [
  {
    icon: CheckSquareIcon,
    title: 'Issue Tracking',
    description:
      'Kanban boards, sprints, and backlog management. Customizable workflows for every team.',
    image: '/images/tasks.png',
  },
  {
    icon: BookOpenIcon,
    title: 'Knowledge Base',
    description:
      'Collaborative documents with rich text editing. Your team\'s single source of truth.',
    image: '/images/collab.jpg',
  },
  {
    icon: MessageSquareIcon,
    title: 'Real-time Chat',
    description:
      'Threaded conversations linked to issues and documents. Channels, DMs, and video calls.',
    image: '/images/teammates.jpg',
  },
  {
    icon: ClockIcon,
    title: 'Time Management',
    description:
      'Time tracking, estimations, and resource planning. Gantt charts and workload views.',
    image: '/images/planner.jpg',
  },
  {
    icon: ZapIcon,
    title: 'Automation',
    description:
      'Custom automations for recurring workflows. Trigger actions on state changes and deadlines.',
    image: '/images/pm.jpg',
  },
  {
    icon: CodeIcon,
    title: 'Developer Tools',
    description:
      'GitHub/GitLab integration, CI/CD tracking, and code reviews. Built for engineering teams.',
    image: '/images/calendar.png',
  },
];

const productivityFeatures = [
  {
    icon: KeyboardIcon,
    title: 'Keyboard shortcuts',
    description: 'Work efficiently with instant access to every action.',
  },
  {
    icon: CalendarIcon,
    title: 'Team Planner',
    description: 'View all tasks in a centralized calendar.',
  },
  {
    icon: BellIcon,
    title: 'Notifications',
    description: 'Receive instant updates on changes that matter.',
  },
  {
    icon: LayoutGridIcon,
    title: 'Time-blocking',
    description: 'Transform tasks into structured time blocks.',
  },
];

export default function Page() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tight text-white">
              Hanzo Team
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
              Features
            </a>
            <a href="https://github.com/hanzoai/team" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
              GitHub
            </a>
            <a href="https://app.hanzo.team" className={cn(buttonVariants({ size: 'sm' }))}>
              Sign In
              <ArrowRightIcon className="size-4" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[800px] w-[1000px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-white/[0.02] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-24 md:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
              Everything app
              <br />
              <span className="text-text-muted">for your teams</span>
            </h1>
            <p className="mx-auto mb-12 max-w-2xl text-lg text-text-muted md:text-xl leading-relaxed">
              All-in-one replacement for Linear, Jira, Slack, and Notion.
              Open-source project management with real-time collaboration.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://app.hanzo.team"
                className={cn(buttonVariants({ size: 'lg' }))}
              >
                Get Started Free
                <ArrowRightIcon className="size-5" />
              </a>
              <a
                href="https://github.com/hanzoai/team"
                target="_blank"
                rel="noreferrer noopener"
                className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}
              >
                <GithubIcon className="size-5" />
                Star on GitHub
              </a>
            </div>
          </div>

          {/* Hero Screenshot */}
          <div className="mx-auto mt-20 max-w-5xl">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/50">
              <Image
                src="/images/hero.jpg"
                alt="Hanzo Team — Project management interface"
                width={1024}
                height={569}
                className="w-full"
                priority
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.08]" />
            </div>
          </div>
        </div>
      </section>

      {/* Productivity Section */}
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="mb-16">
          <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Unmatched
            <br />
            <span className="text-text-muted">productivity</span>
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {productivityFeatures.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
            >
              <f.icon className="mb-4 size-6 text-text-muted transition-colors group-hover:text-white" />
              <h3 className="mb-2 font-semibold text-white">{f.title}</h3>
              <p className="text-sm text-text-dim leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-20 max-w-xl">
          <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Work together.
            <br />
            <span className="text-text-muted">Ship faster.</span>
          </h2>
          <p className="text-text-muted text-lg">
            From issue tracking to knowledge management — everything your team
            needs in one place.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all hover:border-white/[0.12]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-bg-subtle">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover opacity-80 transition-all group-hover:opacity-100 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-center gap-3">
                  <feature.icon className="size-5 text-text-muted" />
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-text-dim">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GitHub Sync Section */}
      <section className="border-y border-white/[0.06] bg-white/[0.01]">
        <div className="mx-auto max-w-7xl px-6 py-32">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
                Sync with GitHub.
                <br />
                <span className="text-text-muted">Both ways.</span>
              </h2>
              <p className="mb-8 text-lg text-text-muted leading-relaxed">
                Two-way sync keeps issues, PRs, and commits linked. Your
                development workflow stays in flow — no context switching.
              </p>
              <div className="space-y-4">
                {[
                  'Two-way issue synchronization',
                  'PR and commit linking',
                  'Multiple repository support',
                  'Automated status updates',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-text-muted">
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full border border-white/10">
                      <CheckSquareIcon className="size-3 text-white" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08]">
              <Image
                src="/images/pm.jpg"
                alt="GitHub integration"
                width={422}
                height={250}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute left-1/2 bottom-0 h-[600px] w-[800px] -translate-x-1/2 translate-y-1/2 rounded-full bg-white/[0.02] blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
              Join the movement
            </h2>
            <p className="mb-10 text-lg text-text-muted">
              Open-source. Self-hostable. Built for teams that ship.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://app.hanzo.team"
                className={cn(buttonVariants({ size: 'lg' }))}
              >
                Get Started Free
                <ArrowRightIcon className="size-5" />
              </a>
              <a
                href="https://github.com/hanzoai/team"
                target="_blank"
                rel="noreferrer noopener"
                className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}
              >
                <GithubIcon className="size-5" />
                View Source
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8">
          <span className="text-sm text-text-dim">Hanzo Team</span>
          <div className="flex items-center gap-6 text-sm text-text-dim">
            <a href="https://hanzo.ai" className="hover:text-white transition-colors">
              hanzo.ai
            </a>
            <a href="https://app.hanzo.team" className="hover:text-white transition-colors">
              App
            </a>
            <a href="https://github.com/hanzoai/team" className="hover:text-white transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
