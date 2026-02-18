import { cn } from '@/lib/cn';
import { cva } from 'class-variance-authority';
import {
  CloudIcon,
  BarChart3Icon,
  UsersIcon,
  KeyIcon,
  ShieldCheckIcon,
  ZapIcon,
  ArrowRightIcon,
  GlobeIcon,
  ServerIcon,
  BrainCircuitIcon,
} from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all',
  {
    variants: {
      variant: {
        primary:
          'bg-brand text-brand-foreground hover:bg-brand-hover shadow-lg shadow-brand/20 hover:shadow-brand/40',
        secondary:
          'border border-border bg-transparent text-text hover:bg-bg-elevated hover:border-text-dim',
        ghost: 'text-text-muted hover:text-text',
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
    icon: BrainCircuitIcon,
    title: 'LLM Gateway',
    description:
      'Unified proxy for 100+ AI providers. OpenAI, Anthropic, Together, Deepseek, and more through a single API.',
  },
  {
    icon: BarChart3Icon,
    title: 'Usage Analytics',
    description:
      'Real-time token usage, cost tracking, and performance metrics. Per-model, per-team breakdowns with ClickHouse-powered dashboards.',
  },
  {
    icon: UsersIcon,
    title: 'Team Management',
    description:
      'Organizations, teams, and role-based access control. SSO via Hanzo IAM with granular permissions per API key.',
  },
  {
    icon: KeyIcon,
    title: 'API Key Management',
    description:
      'Create, rotate, and scope API keys. Set rate limits, model access, and budget caps per key.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Security & Compliance',
    description:
      'End-to-end encryption, audit logs, and SOC 2 compliance. PII redaction and content filtering built in.',
  },
  {
    icon: ZapIcon,
    title: 'Rate Limiting & Caching',
    description:
      'Intelligent response caching with Redis. Global and per-key rate limits. Automatic retry with exponential backoff.',
  },
];

const stats = [
  { value: '100+', label: 'AI Providers' },
  { value: '<50ms', label: 'Proxy Latency' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '5000', label: 'Req/s Capacity' },
];

export default function Page() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <CloudIcon className="size-6 text-brand" />
            <span className="text-lg font-semibold tracking-tight">
              Hanzo Cloud
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://hanzo.ai/docs"
              className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
            >
              Docs
            </a>
            <a
              href="https://console.hanzo.ai"
              className={cn(buttonVariants({ size: 'sm' }))}
            >
              Console
              <ArrowRightIcon className="size-4" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/5 blur-3xl" />
          <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-brand/3 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-24 md:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-muted px-4 py-2 text-sm font-medium text-brand">
              <CloudIcon className="size-4" />
              AI Infrastructure Platform
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              <span className="text-brand">Hanzo Cloud</span>
              <br />
              <span className="text-text">AI at Scale</span>
            </h1>
            <p className="mx-auto mb-12 max-w-2xl text-lg text-text-muted md:text-xl">
              Unified gateway to 100+ AI providers. Usage analytics,
              team management, and API key provisioning — all in one platform.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://console.hanzo.ai"
                className={cn(buttonVariants({ size: 'lg' }))}
              >
                Open Console
                <ArrowRightIcon className="size-5" />
              </a>
              <a
                href="https://hanzo.ai/docs"
                className={cn(
                  buttonVariants({ variant: 'secondary', size: 'lg' }),
                )}
              >
                Documentation
              </a>
            </div>
          </div>

          {/* API Preview */}
          <div className="mx-auto mt-20 max-w-3xl">
            <div className="overflow-hidden rounded-2xl border border-border bg-bg-card shadow-2xl shadow-brand/5">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-red-500/80" />
                  <div className="size-3 rounded-full bg-yellow-500/80" />
                  <div className="size-3 rounded-full bg-green-500/80" />
                </div>
                <span className="ml-2 text-xs text-text-dim font-mono">
                  api.cloud.hanzo.ai
                </span>
              </div>
              <pre className="overflow-x-auto p-6 text-sm font-mono leading-relaxed">
                <code className="text-text-muted">
                  <span className="text-brand">curl</span>
                  {' https://api.cloud.hanzo.ai/v1/chat/completions \\\n'}
                  {'  -H '}
                  <span className="text-green-400">
                    {'"Authorization: Bearer sk-hanzo-..."'}
                  </span>
                  {' \\\n'}
                  {'  -d '}
                  <span className="text-amber-300">{"'"}</span>
                  {'{\n'}
                  {'    '}
                  <span className="text-blue-400">{'"model"'}</span>
                  {': '}
                  <span className="text-green-400">
                    {'"claude-sonnet-4-5-20250929"'}
                  </span>
                  {',\n'}
                  {'    '}
                  <span className="text-blue-400">{'"messages"'}</span>
                  {': [{"role": "user", "content": "Hello"}]\n'}
                  {'  }'}
                  <span className="text-amber-300">{"'"}</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-bg-card/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-16 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-brand md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need for{' '}
            <span className="text-brand">AI infrastructure</span>
          </h2>
          <p className="text-text-muted">
            From a single API key to a full enterprise deployment. Hanzo Cloud
            scales with your team.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-bg-card p-8 transition-all hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5"
            >
              <feature.icon className="mb-4 size-8 text-brand transition-transform group-hover:scale-110" />
              <h3 className="mb-3 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-text-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Section */}
      <section className="border-y border-border bg-bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Built for <span className="text-brand">production</span>
            </h2>
            <p className="text-text-muted">
              Enterprise-grade infrastructure running on Kubernetes with
              automatic scaling, failover, and observability.
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-2xl border border-border bg-bg-card">
              <div className="border-b border-border px-6 py-4">
                <span className="text-sm font-medium text-text-dim">
                  Request Flow
                </span>
              </div>
              <div className="space-y-0 divide-y divide-border">
                {[
                  {
                    icon: GlobeIcon,
                    path: 'api.cloud.hanzo.ai',
                    desc: 'Cloudflare Edge + TLS',
                  },
                  {
                    icon: ShieldCheckIcon,
                    path: 'API Gateway',
                    desc: 'Auth, rate limiting, caching',
                  },
                  {
                    icon: ServerIcon,
                    path: 'LLM Router',
                    desc: 'Provider selection, load balancing, fallback',
                  },
                  {
                    icon: BrainCircuitIcon,
                    path: 'AI Provider',
                    desc: 'OpenAI, Anthropic, Together, Deepseek...',
                  },
                  {
                    icon: BarChart3Icon,
                    path: 'Analytics Pipeline',
                    desc: 'Langfuse → ClickHouse → Dashboards',
                  },
                ].map((step, i) => (
                  <div
                    key={step.path}
                    className="flex items-center gap-4 px-6 py-4"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-muted text-brand">
                      <step.icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium font-mono text-sm">
                        {step.path}
                      </div>
                      <div className="text-xs text-text-dim">{step.desc}</div>
                    </div>
                    {i < 4 && (
                      <ArrowRightIcon className="size-4 shrink-0 text-text-dim" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Ready to get started?
          </h2>
          <p className="mb-8 text-text-muted">
            Sign in to the Hanzo Cloud Console to manage your AI infrastructure.
            Create API keys, monitor usage, and manage your team.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://console.hanzo.ai"
              className={cn(buttonVariants({ size: 'lg' }))}
            >
              Go to Console
              <ArrowRightIcon className="size-5" />
            </a>
            <a
              href="https://github.com/hanzoai"
              target="_blank"
              rel="noreferrer noopener"
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'lg' }),
              )}
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8">
          <div className="flex items-center gap-2 text-sm text-text-dim">
            <CloudIcon className="size-4" />
            <span>Hanzo Cloud</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-dim">
            <a
              href="https://hanzo.ai"
              className="hover:text-text transition-colors"
            >
              hanzo.ai
            </a>
            <a
              href="https://console.hanzo.ai"
              className="hover:text-text transition-colors"
            >
              Console
            </a>
            <a
              href="https://hanzo.ai/docs"
              className="hover:text-text transition-colors"
            >
              Docs
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
