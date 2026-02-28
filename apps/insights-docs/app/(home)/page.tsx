import Link from 'next/link';
import {
  BarChart2, Play, Flag, FlaskConical, MessageSquare, Brain,
  ArrowRight, Terminal, BookOpen, Github, ExternalLink,
  Shield, Database, Server, Zap, Lock, Globe,
  Activity, CheckCircle, Code, Clock, Gauge,
  Radio, Cpu, Bot, Package,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────── */
/*  LANDING PAGE  — matches cloud/flow docs pattern           */
/* ─────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg text-text">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Subtle background blob */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-brand/3 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-24 md:pt-32 text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-border px-4 py-1.5 text-xs text-text-muted">
            Open Source · Self-Hosted · Privacy-First
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Hanzo Insights
          </h1>

          <p className="mx-auto mb-4 max-w-3xl text-lg text-text-muted md:text-xl">
            Product analytics that respects your users. Event tracking, session replay,
            feature flags, A/B testing, and surveys — all in one platform.
          </p>

          <p className="mx-auto mb-10 max-w-2xl text-sm text-text-dim">
            45+ built-in products. Fully self-hostable. GDPR-compliant by default.
            No usage limits. No third-party data sharing. Built by{' '}
            <a href="https://hanzo.ai" className="text-text hover:underline">Hanzo AI</a>{' '}
            (Techstars &apos;17).
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-20">
            <a
              href="https://insights-app.hanzo.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-brand-foreground hover:bg-brand-hover transition-all"
            >
              <Activity className="h-4 w-4" />
              Start Free
            </a>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-6 py-2.5 text-sm font-medium text-text hover:bg-bg-elevated transition-all"
            >
              <BookOpen className="h-4 w-4" />
              Documentation
            </Link>
            <a
              href="https://github.com/hanzoai/insights"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-6 py-2.5 text-sm font-medium text-text hover:bg-bg-elevated transition-all"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <Stat value="45+" label="Products" />
            <Stat value="100%" label="Open Source" />
            <Stat value="Self-Hosted" label="Your Infrastructure" />
            <Stat value="GDPR" label="Ready" />
          </div>
        </div>
      </section>

      {/* ── Core Products Grid ───────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeader
            title="Core Products"
            subtitle="Six flagship products covering every dimension of product analytics"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CORE_PRODUCTS.map((p) => (
              <Link
                key={p.name}
                href={p.href}
                className="group rounded-2xl border border-border bg-bg-card p-6 transition-all hover:border-brand/20 hover:bg-bg-elevated block"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-lg bg-bg-elevated p-2 text-text-muted">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-text-dim bg-bg-elevated px-2 py-0.5 rounded-full">
                    {p.badge}
                  </span>
                </div>
                <h3 className="text-base font-semibold mb-2">{p.name}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{p.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── All 45 Products ──────────────────────────────── */}
      <section className="border-t border-border bg-bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeader
            title="All Products"
            subtitle="45 built-in products — no feature flags or paid tiers. Every product ships with every self-hosted instance."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-8">
            {ALL_PRODUCTS.map((product) => (
              <div
                key={product}
                className="rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-text-muted hover:text-text hover:border-border transition cursor-default"
              >
                {product}
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/docs/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-text hover:underline"
            >
              Browse all products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Self-Host ─────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeader
            title="Why Self-Host"
            subtitle="Keep your data on your infrastructure. No vendor lock-in, no usage caps, no surprise bills."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {REASONS.map((r) => (
              <div key={r.title} className="rounded-2xl border border-border bg-bg-card p-6">
                <div className="rounded-lg bg-bg-elevated p-2 w-fit text-text-muted mb-3">
                  <r.icon className="h-5 w-5" />
                </div>
                <h4 className="font-semibold mb-2">{r.title}</h4>
                <p className="text-sm text-text-muted leading-relaxed">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ────────────────────────────────────── */}
      <section className="border-t border-border bg-bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeader
            title="Tech Stack"
            subtitle="Built on battle-tested open source components — nothing proprietary in the data path."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STACK.map((s) => (
              <div key={s.name} className="rounded-2xl border border-border bg-bg-card p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="rounded-lg bg-bg-elevated p-2 text-text-muted">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-text-dim bg-bg-elevated px-2 py-0.5 rounded-full">
                    {s.badge}
                  </span>
                </div>
                <h4 className="font-semibold mb-0.5">{s.name}</h4>
                <p className="text-xs text-text-dim font-mono mb-2">{s.role}</p>
                <p className="text-sm text-text-muted leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Deploy ──────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeader
            title="Quick Deploy"
            subtitle="One command to start. Docker Compose for development and single-server production."
          />

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <CodeBlock title="Docker Compose — Quick Start">{`git clone https://github.com/hanzoai/insights
cd insights
cp .env.example .env
docker compose up -d

# Open http://localhost:8000`}</CodeBlock>

            <CodeBlock title="JavaScript SDK — Track Events">{`npm install hanzo-insights-js

import Insights from 'hanzo-insights-js'

Insights.init('YOUR_API_KEY', {
  api_host: 'https://insights-app.hanzo.ai',
})

Insights.capture('button_clicked', {
  button_name: 'signup',
  page: '/pricing',
})`}</CodeBlock>
          </div>

          <div className="rounded-2xl border border-border bg-bg-card p-6">
            <h4 className="font-semibold text-sm mb-4">SDK Support</h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              {SDKS.map((sdk) => (
                <div key={sdk} className="flex items-center gap-2 text-text-muted">
                  <CheckCircle className="h-4 w-4 text-text shrink-0" />
                  {sdk}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────── */}
      <section className="border-t border-border bg-bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeader
            title="Pricing"
            subtitle="Start free with self-hosting, or let Hanzo manage it for you."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <PricingCard
              name="Open Source"
              price="Free"
              period="self-hosted"
              description="Full feature set on your own infrastructure. Community support."
              features={['All 45+ products', 'Unlimited events', 'Full data ownership', 'GDPR-compliant', 'Community support', 'Docker & Kubernetes']}
              cta="Deploy Now"
              ctaHref="https://github.com/hanzoai/insights"
              ctaExternal
            />
            <PricingCard
              name="Cloud Starter"
              price="$25"
              period="/ month"
              description="Managed cloud hosting. We handle infrastructure and updates."
              features={['1M events / month', 'All 45+ products', '1 year data retention', '3 projects', 'Email support', 'Automatic updates']}
              cta="Start Free Trial"
              ctaHref="https://insights-app.hanzo.ai"
              ctaExternal
            />
            <PricingCard
              name="Cloud Growth"
              price="$149"
              period="/ month"
              description="For growing teams with high event volumes and compliance needs."
              features={['10M events / month', 'All 45+ products', '3 years data retention', 'Unlimited projects', 'SSO / SAML', 'Priority support']}
              cta="Get Started"
              ctaHref="https://insights-app.hanzo.ai"
              ctaExternal
              highlighted
            />
            <PricingCard
              name="Enterprise"
              price="Custom"
              period="contact us"
              description="Dedicated cluster, unlimited events, compliance, and SLA."
              features={['Unlimited events', 'Dedicated infrastructure', 'Unlimited retention', 'Custom SLA', 'HIPAA / SOC2 ready', 'Dedicated support']}
              cta="Contact Sales"
              ctaHref="https://hanzo.ai"
              ctaExternal
            />
          </div>

          <div className="rounded-2xl border border-border bg-bg-card p-5 text-center text-sm text-text-muted">
            All plans include every product — no feature gating.{' '}
            <a href="https://hanzo.ai" className="text-text hover:underline">Questions? Talk to us →</a>
          </div>
        </div>
      </section>

      {/* ── Ecosystem ─────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeader
            title="Hanzo Ecosystem"
            subtitle="Insights is part of the broader Hanzo AI observability and developer platform."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ECOSYSTEM.map((e) => (
              <a
                key={e.title}
                href={e.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-border bg-bg-card p-6 hover:bg-bg-elevated transition-all block"
              >
                <h4 className="font-semibold mb-2">{e.title}</h4>
                <p className="text-sm text-text-muted mb-4 leading-relaxed">{e.description}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-text">
                  {e.cta} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Start building with Hanzo Insights
          </h2>
          <p className="text-text-muted mb-10 max-w-xl mx-auto">
            45+ products. Fully self-hosted. No usage limits. GDPR-compliant by default.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://insights-app.hanzo.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3 text-sm font-medium text-brand-foreground hover:bg-brand-hover transition-all"
            >
              <Activity className="h-4 w-4" />
              Open Dashboard
            </a>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-8 py-3 text-sm font-medium text-text hover:bg-bg-elevated transition-all"
            >
              <BookOpen className="h-4 w-4" />
              Read the Docs
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
            <div className="lg:col-span-2">
              <div className="text-base font-bold mb-3">Hanzo Insights</div>
              <p className="text-sm text-text-muted mb-4 max-w-xs leading-relaxed">
                Self-hosted product analytics by Hanzo AI. 45+ products, GDPR-ready, open source.
              </p>
              <a
                href="https://github.com/hanzoai/insights"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-dim hover:text-text transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>

            <FooterColumn title="Products" links={[
              { text: 'Product Analytics', href: '/docs/products' },
              { text: 'Session Replay', href: '/docs/products/replay' },
              { text: 'Feature Flags', href: '/docs/products/feature-flags' },
              { text: 'Experiments', href: '/docs/products/experiments' },
              { text: 'LLM Analytics', href: '/docs/products/llm-analytics' },
            ]} />
            <FooterColumn title="Developers" links={[
              { text: 'Documentation', href: '/docs' },
              { text: 'Getting Started', href: '/docs/getting-started' },
              { text: 'API Reference', href: '/docs/api' },
              { text: 'Self-Hosting', href: '/docs/self-hosting' },
              { text: 'GitHub', href: 'https://github.com/hanzoai/insights', external: true },
            ]} />
            <FooterColumn title="Hanzo" links={[
              { text: 'Hanzo AI', href: 'https://hanzo.ai', external: true },
              { text: 'Hanzo Chat', href: 'https://hanzo.chat', external: true },
              { text: 'Hanzo Console', href: 'https://console.hanzo.ai', external: true },
              { text: 'Hanzo Analytics', href: 'https://analytics.hanzo.ai', external: true },
            ]} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-xs text-text-dim">
            <span>&copy; 2016–2026 Hanzo AI Inc. Techstars &apos;17.</span>
            <div className="flex gap-4">
              <a href="https://hanzo.ai/privacy" className="hover:text-text transition-colors">Privacy</a>
              <a href="https://hanzo.ai/terms" className="hover:text-text transition-colors">Terms</a>
              <a href="https://hanzo.ai/security" className="hover:text-text transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}


/* ═══════════════════════════════════════════════════════════ */
/*  DATA                                                       */
/* ═══════════════════════════════════════════════════════════ */

const CORE_PRODUCTS = [
  { icon: BarChart2, name: 'Product Analytics', badge: 'ANALYTICS', description: 'Funnels, retention curves, user paths, and cohort analysis. Understand where users drop off and why.', href: '/docs/products' },
  { icon: Play,      name: 'Session Replay',    badge: 'RECORDING', description: 'Watch real user sessions with automatic privacy masking. Understand rage clicks, confusion, and delight.', href: '/docs/products/replay' },
  { icon: Flag,      name: 'Feature Flags',     badge: 'FLAGS',     description: 'Ship with confidence. Percentage rollouts, user targeting, instant rollbacks. No deploys needed.', href: '/docs/products/feature-flags' },
  { icon: FlaskConical, name: 'A/B Testing',    badge: 'EXPERIMENTS', description: 'Statistically sound experiments at any scale. Multi-variant tests with automatic significance detection.', href: '/docs/products/experiments' },
  { icon: MessageSquare, name: 'Surveys',        badge: 'RESEARCH',  description: 'In-app NPS, CSAT, and custom user research. Trigger surveys on events, page views, or feature usage.', href: '/docs/products/surveys' },
  { icon: Brain,     name: 'LLM Analytics',     badge: 'AI',        description: 'Track AI model performance, prompts, completions, latency, and cost. Purpose-built for AI products.', href: '/docs/products/llm-analytics' },
];

const REASONS = [
  { icon: Lock,     title: 'Privacy by Default',   description: 'No third-party data sharing. IP addresses anonymized. DNT and GPC headers respected. Cookieless mode available.' },
  { icon: Database, title: 'Full Data Ownership',   description: 'Your events live in your ClickHouse cluster. Query raw data directly with SQL. Export to BigQuery, Snowflake, or S3.' },
  { icon: Shield,   title: 'GDPR / CCPA Compliant', description: 'Built-in consent management. One-click user data deletion API. Configurable data retention per table.' },
  { icon: Gauge,    title: 'No Usage Limits',       description: 'Track every event, forever. No event volume caps, no seat limits, no sampling. Your infrastructure, your scale.' },
  { icon: Clock,    title: 'Custom Retention',      description: 'Keep data as long as you need — or delete it on your schedule. Configurable TTL per event type and table.' },
  { icon: Globe,    title: 'Deploy Anywhere',       description: 'Single server with Docker Compose or multi-region Kubernetes. Runs on any cloud or bare metal.' },
];

const STACK = [
  { icon: Server,   name: 'Django + Python',       role: 'Web Server & API',          description: 'Application server handling dashboards, feature flag evaluation, and REST/GraphQL APIs.', badge: 'Backend' },
  { icon: Code,     name: 'React Frontend',        role: 'Dashboard UI',              description: 'Fast single-page application for analytics dashboards, session replay, and experiment setup.', badge: 'Frontend' },
  { icon: Database, name: 'ClickHouse',            role: 'hanzoai/datastore',         description: 'Column-oriented OLAP database. Aggregates billions of events in milliseconds.', badge: 'Analytics DB' },
  { icon: Database, name: 'PostgreSQL',            role: 'hanzoai/sql',               description: 'Relational store for users, projects, feature flags, experiments, and surveys.', badge: 'App DB' },
  { icon: Zap,      name: 'Valkey / Redis',        role: 'hanzoai/kv',                description: 'High-performance caching, session storage, Celery task queue, and feature flag cache.', badge: 'Cache' },
  { icon: Radio,    name: 'Kafka',                 role: 'hanzoai/stream',            description: 'Event streaming backbone. Decouples high-throughput ingestion from storage.', badge: 'Streaming' },
  { icon: Cpu,      name: 'Rust Capture Service',  role: 'High-Throughput Ingestion', description: 'Zero-copy event capture. Handles millions of events per second with minimal latency.', badge: 'Capture' },
  { icon: Bot,      name: 'Celery Workers',        role: 'Background Processing',     description: 'Async task processing for exports, cohort computation, and notifications.', badge: 'Workers' },
  { icon: Package,  name: 'Node.js Plugin Server', role: 'Event Pipeline',            description: 'Extensible plugin system for event transformations, enrichment, and integrations.', badge: 'Plugins' },
];

const SDKS = [
  'JavaScript — Browser + Node.js',
  'Python — pip install hanzo-insights',
  'Go — github.com/hanzoai/insights-go',
  'REST API — Any language',
  'iOS / Android — Mobile SDKs',
  'React Native — Cross-platform',
  'Flutter — Dart SDK',
  'Ruby / PHP / Java — Community',
];

const ECOSYSTEM = [
  { title: 'Hanzo Analytics', description: 'Lightweight privacy-first web analytics. Script-based page tracking without cookies.', href: 'https://analytics.hanzo.ai', cta: 'View Analytics' },
  { title: 'Hanzo Chat',      description: 'AI-powered chat with 14 Zen models plus 100+ third-party models and MCP tools.', href: 'https://hanzo.chat', cta: 'Open Chat' },
  { title: 'Hanzo Console',   description: 'LLM observability, API key management, and usage analytics for AI applications.', href: 'https://console.hanzo.ai', cta: 'Open Console' },
  { title: 'Hanzo Flow',      description: 'Visual workflow builder for AI pipelines. Connect models, tools, and data sources.', href: 'https://flow.hanzo.ai', cta: 'Try Flow' },
];

const ALL_PRODUCTS = [
  'Analytics Platform', 'Product Analytics', 'Customer Analytics', 'Web Analytics',
  'Events API', 'Dashboards', 'Live Debugger', 'Session Replay',
  'Desktop Recordings', 'Session Summaries', 'Feature Flags', 'Early Access Features',
  'Experiments', 'Persons', 'Groups', 'Cohorts',
  'Revenue Analytics', 'Growth', 'Funnels', 'Data Warehouse',
  'Data Modeling', 'Surveys', 'Conversations', 'Product Tours',
  'User Interviews', 'LLM Analytics', 'AI Insights', 'Error Tracking',
  'Signals', 'Batch Exports', 'CDP', 'Links',
  'Marketing Analytics', 'Endpoints', 'Notebooks', 'Logs',
  'Slack App', 'Toolbar', 'Actions', 'Workflows', 'Managed Migrations',
];


/* ═══════════════════════════════════════════════════════════ */
/*  SUB-COMPONENTS                                            */
/* ═══════════════════════════════════════════════════════════ */

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold tracking-tight mb-3">{title}</h2>
      <p className="text-text-muted max-w-2xl leading-relaxed">{subtitle}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl md:text-3xl font-bold tracking-tight">{value}</div>
      <div className="text-sm text-text-muted mt-1">{label}</div>
    </div>
  );
}

function CodeBlock({ title, children }: { title: string; children: string }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 text-xs text-text-dim bg-bg-elevated">
        <Terminal className="h-3.5 w-3.5" />
        {title}
      </div>
      <pre className="p-5 text-sm overflow-x-auto text-text-muted leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function PricingCard({
  name, price, period, description, features, cta, ctaHref, ctaExternal, highlighted,
}: {
  name: string; price: string; period: string; description: string;
  features: string[]; cta: string; ctaHref: string; ctaExternal?: boolean; highlighted?: boolean;
}) {
  const Tag = ctaExternal ? 'a' : Link;
  const tagProps = ctaExternal
    ? { href: ctaHref, target: '_blank', rel: 'noopener noreferrer' }
    : { href: ctaHref };
  return (
    <div className={`rounded-2xl border p-6 flex flex-col ${
      highlighted ? 'border-brand/30 bg-bg-card' : 'border-border bg-bg-card'
    }`}>
      {highlighted && (
        <div className="text-[10px] font-semibold tracking-widest uppercase text-text-dim bg-bg-elevated px-2 py-0.5 rounded-full w-fit mb-3">
          Most Popular
        </div>
      )}
      <h3 className="font-semibold text-base mb-1">{name}</h3>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-3xl font-bold tracking-tight">{price}</span>
        <span className="text-sm text-text-muted">{period}</span>
      </div>
      <p className="text-sm text-text-muted mb-5 leading-relaxed">{description}</p>
      <ul className="space-y-2 mb-6 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-text-muted">
            <CheckCircle className="h-4 w-4 text-text mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Tag
        {...tagProps as any}
        className={`w-full text-center rounded-full py-2.5 text-sm font-medium transition-all ${
          highlighted
            ? 'bg-brand text-brand-foreground hover:bg-brand-hover'
            : 'border border-border hover:bg-bg-elevated text-text'
        }`}
      >
        {cta}
      </Tag>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: { text: string; href: string; external?: boolean }[] }) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-3">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.text}>
            {link.external ? (
              <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-text transition-colors flex items-center gap-1">
                {link.text} <ExternalLink className="h-2.5 w-2.5" />
              </a>
            ) : (
              <Link href={link.href} className="text-sm text-text-muted hover:text-text transition-colors">
                {link.text}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
