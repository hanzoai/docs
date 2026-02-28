import Link from 'next/link';
import {
  BarChart2, Play, Flag, FlaskConical, MessageSquare, Brain,
  ArrowRight, Terminal, BookOpen, Github, ExternalLink,
  Shield, Database, Server, Zap, Lock, Globe, Eye,
  Package, Layers, Activity, CheckCircle, Code,
  Users, Clock, Gauge, CloudLightning, ScrollText,
  Radio, GitBranch, ChevronRight, BarChart, LineChart,
  PieChart, Funnel, UserCheck, Workflow, Bell, Search,
  Sparkles, Bot, AlertTriangle, Send, Download, Cpu,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────── */
/*  LANDING PAGE                                               */
/* ─────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <main className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-fd-border">
        <div className="absolute inset-0 bg-gradient-to-b from-fd-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-muted px-4 py-1.5 text-sm text-fd-muted-foreground mb-6">
            <Sparkles className="h-4 w-4" />
            Open Source · Self-Hosted · Privacy-First
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Hanzo Insights
          </h1>

          <p className="text-xl md:text-2xl text-fd-muted-foreground max-w-3xl mx-auto mb-4">
            Product analytics that respects your users. Event tracking, session replay, feature flags, A/B testing, and surveys — all in one platform.
          </p>

          <p className="text-base text-fd-muted-foreground max-w-2xl mx-auto mb-10">
            45+ built-in products. Fully self-hostable. GDPR-compliant by default.
            No usage limits. No third-party data sharing. Built by{' '}
            <a href="https://hanzo.ai" className="text-fd-primary hover:underline">Hanzo AI</a> (Techstars &apos;17).
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-16">
            <a
              href="https://insights-app.hanzo.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-6 py-3 text-sm font-medium text-fd-primary-foreground hover:opacity-90 transition"
            >
              <Activity className="h-4 w-4" />
              Start Free
            </a>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-6 py-3 text-sm font-medium text-fd-foreground hover:bg-fd-muted transition"
            >
              <BookOpen className="h-4 w-4" />
              Documentation
            </Link>
            <Link
              href="/docs/api"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-6 py-3 text-sm font-medium text-fd-foreground hover:bg-fd-muted transition"
            >
              <Terminal className="h-4 w-4" />
              API Reference
            </Link>
            <a
              href="https://github.com/hanzoai/insights"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-6 py-3 text-sm font-medium text-fd-foreground hover:bg-fd-muted transition"
            >
              <Github className="h-4 w-4" />
              GitHub
              <ExternalLink className="h-3 w-3 text-fd-muted-foreground" />
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
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeader
          title="Core Products"
          subtitle="Six flagship products covering every dimension of product analytics"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            icon={<BarChart2 className="h-6 w-6" />}
            name="Product Analytics"
            badge="ANALYTICS"
            description="Funnels, retention curves, user paths, and cohort analysis. Understand where users drop off and why."
            href="/docs/products"
            featured
          />
          <ProductCard
            icon={<Play className="h-6 w-6" />}
            name="Session Replay"
            badge="RECORDING"
            description="Watch real user sessions with automatic privacy masking. Understand rage clicks, confusion, and delight."
            href="/docs/products/replay"
          />
          <ProductCard
            icon={<Flag className="h-6 w-6" />}
            name="Feature Flags"
            badge="FLAGS"
            description="Ship with confidence. Percentage rollouts, user targeting, instant rollbacks. No deploys needed."
            href="/docs/products/feature-flags"
          />
          <ProductCard
            icon={<FlaskConical className="h-6 w-6" />}
            name="A/B Testing"
            badge="EXPERIMENTS"
            description="Statistically sound experiments at any scale. Multi-variant tests with automatic significance detection."
            href="/docs/products/experiments"
          />
          <ProductCard
            icon={<MessageSquare className="h-6 w-6" />}
            name="Surveys"
            badge="RESEARCH"
            description="In-app NPS, CSAT, and custom user research. Trigger surveys on events, page views, or feature usage."
            href="/docs/products/surveys"
          />
          <ProductCard
            icon={<Brain className="h-6 w-6" />}
            name="LLM Analytics"
            badge="AI"
            description="Track AI model performance, prompts, completions, latency, and cost. Purpose-built for AI products."
            href="/docs/products/llm-analytics"
          />
        </div>
      </section>

      {/* ── All 45 Products ──────────────────────────────── */}
      <section className="border-t border-fd-border bg-fd-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeader
            title="All Products"
            subtitle="45 built-in products — no feature flags or paid tiers. Every product ships with every self-hosted instance."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {ALL_PRODUCTS.map((product) => (
              <div
                key={product}
                className="rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm text-fd-foreground hover:border-fd-primary/40 hover:bg-fd-primary/5 transition cursor-default"
              >
                {product}
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/docs/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-fd-primary hover:underline"
            >
              Browse all products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Self-Host ─────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeader
          title="Why Self-Host"
          subtitle="Keep your data on your infrastructure. No vendor lock-in, no usage caps, no surprise bills."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ReasonCard
            icon={<Lock className="h-5 w-5" />}
            title="Privacy by Default"
            description="No third-party data sharing. IP addresses anonymized. DNT and GPC headers respected. Cookieless mode available."
          />
          <ReasonCard
            icon={<Database className="h-5 w-5" />}
            title="Full Data Ownership"
            description="Your events live in your ClickHouse cluster. Query raw data directly with SQL. Export to BigQuery, Snowflake, or S3."
          />
          <ReasonCard
            icon={<Shield className="h-5 w-5" />}
            title="GDPR / CCPA Compliant"
            description="Built-in consent management. One-click user data deletion API. Configurable data retention per table."
          />
          <ReasonCard
            icon={<Gauge className="h-5 w-5" />}
            title="No Usage Limits"
            description="Track every event, forever. No event volume caps, no seat limits, no sampling. Your infrastructure, your scale."
          />
          <ReasonCard
            icon={<Clock className="h-5 w-5" />}
            title="Custom Retention"
            description="Keep data as long as you need — or delete it on your schedule. Configurable TTL per event type and table."
          />
          <ReasonCard
            icon={<Globe className="h-5 w-5" />}
            title="Deploy Anywhere"
            description="Single server with Docker Compose or multi-region Kubernetes. Runs on any cloud or bare metal."
          />
        </div>
      </section>

      {/* ── Tech Stack ────────────────────────────────────── */}
      <section className="border-t border-fd-border bg-fd-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeader
            title="Tech Stack"
            subtitle="Built on battle-tested open source components — nothing proprietary in the data path."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <StackCard
              icon={<Server className="h-5 w-5" />}
              name="Django + Python"
              role="Web Server & API"
              description="The application server handling dashboards, feature flag evaluation, and REST/GraphQL APIs."
              badge="Backend"
            />
            <StackCard
              icon={<Code className="h-5 w-5" />}
              name="React Frontend"
              role="Dashboard UI"
              description="Fast single-page application for analytics dashboards, session replay player, and experiment setup."
              badge="Frontend"
            />
            <StackCard
              icon={<Database className="h-5 w-5" />}
              name="ClickHouse"
              role="hanzoai/datastore"
              description="Column-oriented OLAP database for analytics queries. Aggregates billions of events in milliseconds."
              badge="Analytics DB"
            />
            <StackCard
              icon={<Database className="h-5 w-5" />}
              name="PostgreSQL"
              role="hanzoai/sql"
              description="Relational store for application data: users, projects, feature flags, experiments, and surveys."
              badge="App DB"
            />
            <StackCard
              icon={<Zap className="h-5 w-5" />}
              name="Valkey / Redis"
              role="hanzoai/kv"
              description="High-performance caching, session storage, Celery task queue, and real-time feature flag cache."
              badge="Cache"
            />
            <StackCard
              icon={<Radio className="h-5 w-5" />}
              name="Kafka"
              role="hanzoai/stream"
              description="Event streaming backbone. Decouples high-throughput ingestion from storage and processing."
              badge="Streaming"
            />
            <StackCard
              icon={<Cpu className="h-5 w-5" />}
              name="Rust Capture Service"
              role="High-Throughput Ingestion"
              description="Zero-copy event capture service written in Rust. Handles millions of events per second with minimal latency."
              badge="Capture"
            />
            <StackCard
              icon={<Bot className="h-5 w-5" />}
              name="Celery Workers"
              role="Background Processing"
              description="Async task processing for exports, cohort computation, experiment significance, and notifications."
              badge="Workers"
            />
            <StackCard
              icon={<Package className="h-5 w-5" />}
              name="Node.js Plugin Server"
              role="Event Pipeline"
              description="Extensible plugin system for event transformations, enrichment, and third-party integrations."
              badge="Plugins"
            />
          </div>
        </div>
      </section>

      {/* ── Quick Deploy ──────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeader
          title="Quick Deploy"
          subtitle="One command to start. Docker Compose for development and single-server production. Kubernetes for scale."
        />

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="rounded-xl border border-fd-border bg-fd-background overflow-hidden">
            <div className="flex items-center gap-2 border-b border-fd-border px-4 py-2 text-xs text-fd-muted-foreground bg-fd-muted/50">
              <Terminal className="h-3.5 w-3.5" />
              Docker Compose — Quick Start
            </div>
            <pre className="p-4 text-sm overflow-x-auto"><code>{`git clone https://github.com/hanzoai/insights
cd insights
cp .env.example .env
docker compose up -d

# Open http://localhost:8000`}</code></pre>
          </div>

          <div className="rounded-xl border border-fd-border bg-fd-background overflow-hidden">
            <div className="flex items-center gap-2 border-b border-fd-border px-4 py-2 text-xs text-fd-muted-foreground bg-fd-muted/50">
              <Terminal className="h-3.5 w-3.5" />
              compose.yml — Core Services
            </div>
            <pre className="p-4 text-sm overflow-x-auto"><code>{`services:
  insights:
    image: ghcr.io/hanzoai/insights:latest
    environment:
      DATABASE_URL: postgresql://...
      CLICKHOUSE_HOST: datastore
      REDIS_URL: redis://kv:6379
  datastore:
    image: hanzoai/datastore:latest
  sql:
    image: hanzoai/sql:latest
  kv:
    image: hanzoai/kv:latest
  stream:
    image: hanzoai/stream:latest`}</code></pre>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="rounded-xl border border-fd-border bg-fd-background overflow-hidden">
            <div className="flex items-center gap-2 border-b border-fd-border px-4 py-2 text-xs text-fd-muted-foreground bg-fd-muted/50">
              <Terminal className="h-3.5 w-3.5" />
              JavaScript SDK — Track Events
            </div>
            <pre className="p-4 text-sm overflow-x-auto"><code>{`npm install hanzo-insights-js

import Insights from 'hanzo-insights-js'

Insights.init('YOUR_API_KEY', {
  api_host: 'https://insights.hanzo.ai',
})

// Track pageview
Insights.capture('$pageview')

// Track custom event
Insights.capture('button_clicked', {
  button_name: 'signup',
  page: '/pricing',
})`}</code></pre>
          </div>

          <div className="rounded-xl border border-fd-border bg-fd-background overflow-hidden">
            <div className="flex items-center gap-2 border-b border-fd-border px-4 py-2 text-xs text-fd-muted-foreground bg-fd-muted/50">
              <Terminal className="h-3.5 w-3.5" />
              Kubernetes — Universe Manifests
            </div>
            <pre className="p-4 text-sm overflow-x-auto"><code>{`# Deploy full stack to Kubernetes
kubectl apply -k \\
  github.com/hanzoai/universe/infra/k8s/insights

# Services deployed:
# - insights-web (port 8000)
# - insights-capture (port 3000)
# - insights-worker
# - datastore (ClickHouse)
# - sql (PostgreSQL)
# - kv (Valkey)
# - stream (Kafka)`}</code></pre>
          </div>
        </div>

        <div className="rounded-xl border border-fd-border bg-fd-muted/30 p-6">
          <h4 className="font-semibold mb-3">SDK Support</h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-fd-primary mt-0.5 shrink-0" />
              <div><strong>JavaScript</strong> — Browser + Node.js</div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-fd-primary mt-0.5 shrink-0" />
              <div><strong>Python</strong> — pip install hanzo-insights</div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-fd-primary mt-0.5 shrink-0" />
              <div><strong>Go</strong> — github.com/hanzoai/insights-go</div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-fd-primary mt-0.5 shrink-0" />
              <div><strong>REST API</strong> — Any language</div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-fd-primary mt-0.5 shrink-0" />
              <div><strong>iOS / Android</strong> — Mobile SDKs</div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-fd-primary mt-0.5 shrink-0" />
              <div><strong>React Native</strong> — Cross-platform</div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-fd-primary mt-0.5 shrink-0" />
              <div><strong>Flutter</strong> — Dart SDK</div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-fd-primary mt-0.5 shrink-0" />
              <div><strong>Ruby / PHP / Java</strong> — Community SDKs</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
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
            features={[
              'All 45+ products',
              'Unlimited events',
              'Full data ownership',
              'GDPR-compliant',
              'Community support',
              'Docker & Kubernetes',
            ]}
            cta="Deploy Now"
            ctaHref="https://github.com/hanzoai/insights"
            ctaExternal
          />
          <PricingCard
            name="Cloud Starter"
            price="$25"
            period="/ month"
            description="Managed cloud hosting. We handle infrastructure and updates."
            features={[
              '1M events / month',
              'All 45+ products',
              '1 year data retention',
              '3 projects',
              'Email support',
              'Automatic updates',
            ]}
            cta="Start Free Trial"
            ctaHref="https://insights-app.hanzo.ai"
            ctaExternal
          />
          <PricingCard
            name="Cloud Growth"
            price="$149"
            period="/ month"
            description="For growing teams with high event volumes and compliance needs."
            features={[
              '10M events / month',
              'All 45+ products',
              '3 years data retention',
              'Unlimited projects',
              'SSO / SAML',
              'Priority support',
            ]}
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
            features={[
              'Unlimited events',
              'Dedicated infrastructure',
              'Unlimited retention',
              'Custom SLA',
              'HIPAA / SOC2 ready',
              'Dedicated support',
            ]}
            cta="Contact Sales"
            ctaHref="https://hanzo.ai"
            ctaExternal
          />
        </div>

        <div className="rounded-xl border border-fd-border bg-fd-muted/30 p-6 text-center text-sm text-fd-muted-foreground">
          All plans include every product — no feature gating. Cloud plans include automatic updates, backups, and monitoring.
          <a href="https://hanzo.ai" className="ml-1 text-fd-primary hover:underline">Questions? Talk to us →</a>
        </div>
      </section>

      {/* ── Ecosystem ─────────────────────────────────────── */}
      <section className="border-t border-fd-border bg-fd-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeader
            title="Hanzo Ecosystem"
            subtitle="Insights is part of the broader Hanzo AI observability and developer platform."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <EcosystemCard
              title="Hanzo Analytics"
              description="Lightweight privacy-first web analytics. Script-based page tracking without cookies."
              href="https://analytics.hanzo.ai"
              cta="View Analytics"
            />
            <EcosystemCard
              title="Hanzo Chat"
              description="AI-powered chat with 14 Zen models plus 100+ third-party models and MCP tools."
              href="https://hanzo.chat"
              cta="Open Chat"
            />
            <EcosystemCard
              title="Hanzo Console"
              description="LLM observability, API key management, and usage analytics for AI applications."
              href="https://console.hanzo.ai"
              cta="Open Console"
            />
            <EcosystemCard
              title="Hanzo Flow"
              description="Visual workflow builder for AI pipelines. Connect models, tools, and data sources."
              href="https://flow.hanzo.ai"
              cta="Try Flow"
            />
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-fd-primary/5 to-transparent">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Start building with Hanzo Insights
          </h2>
          <p className="text-fd-muted-foreground mb-8 max-w-xl mx-auto">
            45+ products. Fully self-hosted. No usage limits. GDPR-compliant by default.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://insights-app.hanzo.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-8 py-3 text-sm font-medium text-fd-primary-foreground hover:opacity-90 transition"
            >
              <Activity className="h-4 w-4" />
              Open Dashboard
            </a>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-8 py-3 text-sm font-medium text-fd-foreground hover:bg-fd-muted transition"
            >
              <BookOpen className="h-4 w-4" />
              Read the Docs
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-fd-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
            <div className="lg:col-span-2">
              <div className="text-lg font-bold mb-3">Hanzo Insights</div>
              <p className="text-sm text-fd-muted-foreground mb-4 max-w-xs">
                Self-hosted product analytics by Hanzo AI. 45+ products, GDPR-ready, open source.
              </p>
              <div className="flex gap-3">
                <a href="https://github.com/hanzoai/insights" target="_blank" rel="noopener noreferrer" className="text-fd-muted-foreground hover:text-fd-foreground transition" title="GitHub">
                  <Github className="h-4 w-4" />
                </a>
              </div>
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
              { text: 'Hanzo Flow', href: 'https://flow.hanzo.ai', external: true },
            ]} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-fd-border pt-6 text-xs text-fd-muted-foreground">
            <span>&copy; 2016–2026 Hanzo AI Inc. Techstars &apos;17.</span>
            <div className="flex gap-4">
              <a href="https://hanzo.ai/privacy" className="hover:text-fd-foreground transition">Privacy</a>
              <a href="https://hanzo.ai/terms" className="hover:text-fd-foreground transition">Terms</a>
              <a href="https://hanzo.ai/security" className="hover:text-fd-foreground transition">Security</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Floating CTA ─────────────────────────────────── */}
      <a
        href="https://insights-app.hanzo.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full bg-fd-primary px-4 py-2.5 text-sm font-medium text-fd-primary-foreground shadow-lg hover:opacity-90 transition"
        title="Open Hanzo Insights dashboard"
      >
        <Activity className="h-4 w-4" />
        Open Dashboard
      </a>
    </main>
  );
}


/* ═══════════════════════════════════════════════════════════ */
/*  DATA                                                       */
/* ═══════════════════════════════════════════════════════════ */

const ALL_PRODUCTS = [
  'Analytics Platform',
  'Product Analytics',
  'Customer Analytics',
  'Web Analytics',
  'Events API',
  'Dashboards',
  'Live Debugger',
  'Session Replay',
  'Desktop Recordings',
  'Session Summaries',
  'Feature Flags',
  'Early Access Features',
  'Experiments',
  'Persons',
  'Groups',
  'Cohorts',
  'Revenue Analytics',
  'Growth',
  'Funnels',
  'Data Warehouse',
  'Data Modeling',
  'Surveys',
  'Conversations',
  'Product Tours',
  'User Interviews',
  'LLM Analytics',
  'AI Insights',
  'Error Tracking',
  'Signals',
  'Batch Exports',
  'CDP',
  'Links',
  'Marketing Analytics',
  'Endpoints',
  'Notebooks',
  'Logs',
  'Slack App',
  'Toolbar',
  'Actions',
  'Workflows',
  'Managed Migrations',
];


/* ═══════════════════════════════════════════════════════════ */
/*  SUB-COMPONENTS                                            */
/* ═══════════════════════════════════════════════════════════ */

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold tracking-tight mb-3">{title}</h2>
      <p className="text-fd-muted-foreground max-w-2xl">{subtitle}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl md:text-3xl font-bold tracking-tight">{value}</div>
      <div className="text-sm text-fd-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function ProductCard({
  icon, name, badge, description, href, featured,
}: {
  icon: React.ReactNode; name: string; badge: string;
  description: string; href: string; featured?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-xl border p-6 transition hover:border-fd-primary/40 block ${
        featured ? 'border-fd-primary/30 bg-fd-primary/5 ring-1 ring-fd-primary/20' : 'border-fd-border bg-fd-background'
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="rounded-lg bg-fd-muted p-2 text-fd-primary">{icon}</div>
        <span className="text-[10px] font-semibold tracking-widest uppercase text-fd-primary bg-fd-primary/10 px-2 py-0.5 rounded-full">{badge}</span>
      </div>
      <h3 className="text-lg font-semibold mb-2 group-hover:text-fd-primary transition">{name}</h3>
      <p className="text-sm text-fd-muted-foreground">{description}</p>
    </Link>
  );
}

function ReasonCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-fd-border bg-fd-background p-6">
      <div className="rounded-lg bg-fd-muted p-2 w-fit text-fd-primary mb-3">{icon}</div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-fd-muted-foreground">{description}</p>
    </div>
  );
}

function StackCard({
  icon, name, role, description, badge,
}: {
  icon: React.ReactNode; name: string; role: string; description: string; badge: string;
}) {
  return (
    <div className="rounded-xl border border-fd-border bg-fd-background p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="rounded-lg bg-fd-muted p-2 text-fd-primary">{icon}</div>
        <span className="text-[10px] font-semibold tracking-widest uppercase text-fd-muted-foreground bg-fd-muted px-2 py-0.5 rounded-full">{badge}</span>
      </div>
      <h4 className="font-semibold mb-0.5">{name}</h4>
      <p className="text-xs text-fd-primary font-mono mb-2">{role}</p>
      <p className="text-sm text-fd-muted-foreground">{description}</p>
    </div>
  );
}

function EcosystemCard({ title, description, href, cta }: {
  title: string; description: string; href: string; cta: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-xl border border-fd-border bg-fd-background p-6 hover:border-fd-primary/40 transition block"
    >
      <h4 className="font-semibold mb-2 group-hover:text-fd-primary transition">{title}</h4>
      <p className="text-sm text-fd-muted-foreground mb-4">{description}</p>
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-fd-primary">
        {cta} <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </a>
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
              <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-fd-muted-foreground hover:text-fd-foreground transition flex items-center gap-1">
                {link.text} <ExternalLink className="h-2.5 w-2.5" />
              </a>
            ) : (
              <Link href={link.href} className="text-sm text-fd-muted-foreground hover:text-fd-foreground transition">
                {link.text}
              </Link>
            )}
          </li>
        ))}
      </ul>
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
  const tagProps = ctaExternal ? { href: ctaHref, target: '_blank', rel: 'noopener noreferrer' } : { href: ctaHref };
  return (
    <div className={`rounded-xl border p-6 flex flex-col ${
      highlighted
        ? 'border-fd-primary/40 bg-fd-primary/5 ring-1 ring-fd-primary/20'
        : 'border-fd-border bg-fd-background'
    }`}>
      {highlighted && (
        <div className="text-[10px] font-semibold tracking-widest uppercase text-fd-primary bg-fd-primary/10 px-2 py-0.5 rounded-full w-fit mb-3">
          Most Popular
        </div>
      )}
      <h3 className="font-semibold text-lg mb-1">{name}</h3>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-3xl font-bold tracking-tight">{price}</span>
        <span className="text-sm text-fd-muted-foreground">{period}</span>
      </div>
      <p className="text-sm text-fd-muted-foreground mb-5">{description}</p>
      <ul className="space-y-2 mb-6 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-fd-primary mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Tag
        {...tagProps as any}
        className={`w-full text-center rounded-lg py-2.5 text-sm font-medium transition ${
          highlighted
            ? 'bg-fd-primary text-fd-primary-foreground hover:opacity-90'
            : 'border border-fd-border hover:bg-fd-muted text-fd-foreground'
        }`}
      >
        {cta}
      </Tag>
    </div>
  );
}
