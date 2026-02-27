import Link from 'next/link';
import { cn } from '@/lib/cn';
import { cva } from 'class-variance-authority';
import {
  DatabaseIcon,
  ShieldCheckIcon,
  ZapIcon,
  CloudIcon,
  HardDriveIcon,
  CodeIcon,
  TerminalIcon,
  ServerIcon,
  RefreshCwIcon,
  LockIcon,
  FolderIcon,
  ArrowRightIcon,
  CheckIcon,
  MessageCircleIcon,
} from 'lucide-react';

const headingVariants = cva('font-medium tracking-tight', {
  variants: {
    variant: {
      h1: 'text-4xl lg:text-5xl xl:text-6xl',
      h2: 'text-3xl lg:text-4xl',
      h3: 'text-xl lg:text-2xl',
    },
  },
});

const buttonVariants = cva(
  'inline-flex justify-center px-5 py-3 rounded-full font-medium tracking-tight transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-fd-foreground text-fd-background hover:bg-fd-foreground/90',
        secondary: 'border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

const cardVariants = cva('rounded-2xl text-sm p-6 bg-origin-border shadow-lg', {
  variants: {
    variant: {
      secondary: 'bg-fd-muted text-fd-foreground',
      default: 'border bg-fd-card',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const pricingTiers = [
  {
    name: 'Starter',
    price: '$5',
    period: '/mo',
    desc: '1 shared vCPU, 1 GB RAM, 10 GB storage.',
    cta: 'Get Started',
    ctaHref: '/docs',
    features: [
      '1 Base instance',
      '10K API requests/day',
      'SSE realtime subscriptions',
      'Email/password auth',
      'Local filesystem storage',
      'Admin dashboard included',
    ],
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/mo',
    desc: '2 shared vCPUs, 4 GB RAM, 40 GB storage.',
    cta: 'Start Free Trial',
    ctaHref: '/docs',
    highlight: true,
    badge: 'Popular',
    features: [
      '3 Base instances',
      '100K API requests/day',
      'WebSocket + CRDT sync',
      'OAuth2 + Hanzo IAM',
      'S3-compatible file storage',
      'Monitoring + alerts',
      'Daily backups',
    ],
  },
  {
    name: 'Scale',
    price: '$49',
    period: '/mo',
    desc: '4 dedicated vCPUs, 16 GB RAM, 160 GB storage.',
    cta: 'Get Started',
    ctaHref: '/docs',
    features: [
      'Unlimited Base instances',
      'Unlimited API requests',
      'Multi-tenant platform mode',
      'Horizontal auto-scaling',
      'Private networking',
      'Point-in-time restore',
      'Dedicated support',
    ],
  },
];

export default function Page() {
  return (
    <main className="text-fd-foreground pt-4 pb-6 md:pb-12">
      {/* Hero Section */}
      <div className="relative flex min-h-[600px] h-[70vh] max-h-[900px] border rounded-2xl overflow-hidden mx-auto w-full max-w-[1400px]">
        <div className="absolute inset-0 bg-gradient-to-br from-fd-muted/50 via-transparent to-fd-muted/30" />
        <div className="flex flex-col z-2 px-4 size-full md:p-12 max-md:items-center max-md:text-center">
          <div className="flex items-center gap-2 mt-12 text-xs font-medium rounded-full p-2 border w-fit">
            <DatabaseIcon className="size-4" />
            Open-Source Realtime Backend
          </div>
          <h1 className={cn(headingVariants({ variant: 'h1' }), 'my-8 leading-tight')}>
            One Binary.
            <br />
            Auth, DB, API.
          </h1>
          <p className="text-lg text-fd-muted-foreground max-w-2xl mb-8">
            Auth, database, realtime subscriptions, file storage, and server-side functions
            compiled into a single Go binary. SQLite locally, PostgreSQL in production.
            REST API auto-generated from your schema.
          </p>
          <div className="flex flex-row items-center justify-center gap-4 flex-wrap w-fit">
            <Link href="/docs" className={cn(buttonVariants(), 'max-sm:text-sm')}>
              Get Started
            </Link>
            <a
              href="https://github.com/hanzoai/base"
              target="_blank"
              rel="noreferrer noopener"
              className={cn(buttonVariants({ variant: 'secondary' }), 'max-sm:text-sm')}
            >
              View on GitHub
            </a>
          </div>

          {/* Terminal Preview */}
          <div className="mt-12 w-full max-w-3xl mx-auto">
            <div className="bg-fd-card border rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-2 border-b bg-fd-muted/50">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-red-500/80" />
                  <div className="size-3 rounded-full bg-yellow-500/80" />
                  <div className="size-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-fd-muted-foreground ml-2">terminal</span>
              </div>
              <pre className="p-4 text-sm overflow-x-auto font-mono">
                <code className="text-fd-muted-foreground">{`$ `}<span className="text-fd-foreground">base serve</span>{`
> Server started at http://127.0.0.1:8090
  - REST API:    /api/
  - Realtime:    /api/realtime
  - Admin UI:    /_/
  - Auth:        /api/collections/users/auth-with-password

$ `}<span className="text-fd-foreground">curl localhost:8090/api/collections/tasks/records</span>{`
{
  "items": [...],
  "totalItems": 42,
  "totalPages": 5
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-10 mt-12 px-6 mx-auto w-full max-w-[1400px] md:px-12 lg:grid-cols-2">
        <p className="text-2xl tracking-tight leading-snug font-light col-span-full md:text-3xl xl:text-4xl">
          <span className="font-medium">Database, auth, files, realtime, and functions</span> in
          a <span className="font-medium">~15 MB binary</span> with zero external dependencies.
        </p>

        {/* Database */}
        <div className={cn(cardVariants())}>
          <DatabaseIcon className="size-8 mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Database
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            SQLite for local dev, PostgreSQL for production. REST API auto-generated
            from your schema with filtering, sorting, pagination, and relation expansion.
          </p>
          <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`// Create a record
const record = await base.collection('tasks').create({
  title: 'Ship it',
  status: 'active',
  assignee: userId
});

// Query with filters
const tasks = await base.collection('tasks').getList(1, 20, {
  filter: 'status = "active" && assignee = "' + userId + '"',
  sort: '-created',
  expand: 'assignee'
});`}
          </pre>
        </div>

        {/* Realtime */}
        <div className={cn(cardVariants({ variant: 'secondary' }))}>
          <RefreshCwIcon className="size-8 mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Realtime Subscriptions
          </h3>
          <p className="mb-4">
            Subscribe to collection changes over SSE. Each create, update, or delete
            event is broadcast with the full record payload. Client SDKs handle
            reconnection and deduplication.
          </p>
          <pre className="bg-black/10 dark:bg-white/5 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`// Subscribe to all changes in a collection
base.collection('messages').subscribe('*', (e) => {
  console.log(e.action); // 'create' | 'update' | 'delete'
  console.log(e.record); // the changed record
});

// Subscribe to a single record by ID
base.collection('tasks').subscribe(recordId, (e) => {
  updateUI(e.record);
});`}
          </pre>
        </div>

        {/* Auth */}
        <div className={cn(cardVariants())}>
          <ShieldCheckIcon className="size-8 mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Authentication
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            Built-in auth with email/password, OAuth2 providers, and Hanzo IAM integration.
            Per-collection API rules define read/write/create/delete access using
            filter expressions.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Email/Password</p>
              <p className="text-xs text-fd-muted-foreground">With email verification flow</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">OAuth2</p>
              <p className="text-xs text-fd-muted-foreground">Google, GitHub, Apple, 10+ others</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Hanzo IAM</p>
              <p className="text-xs text-fd-muted-foreground">SSO via hanzo.id, SAML/OIDC</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">API Rules</p>
              <p className="text-xs text-fd-muted-foreground">Filter-based access per collection</p>
            </div>
          </div>
        </div>

        {/* File Storage */}
        <div className={cn(cardVariants())}>
          <FolderIcon className="size-8 mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            File Storage
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            Attach files to any collection record. Local filesystem in dev mode,
            S3-compatible object storage in production. Generates thumbnails on read
            via query parameters.
          </p>
          <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`// Upload a file
const formData = new FormData();
formData.append('document', file);
formData.append('title', 'Report Q4');

const record = await base.collection('documents')
  .create(formData);

// Get file URL (with optional thumb params)
const url = base.files.getURL(record, record.document);`}
          </pre>
        </div>

        {/* Cloud Functions */}
        <div className={cn(cardVariants({ variant: 'secondary' }), 'col-span-full')}>
          <CloudIcon className="size-8 mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-6' }))}>
            Server-Side Functions
          </h3>
          <p className="mb-6 max-w-2xl">
            JavaScript hooks execute before or after any API operation. Define
            custom HTTP routes, cron jobs, and event-driven logic in the embedded
            JSVM runtime. No separate function deployment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Hooks</h4>
              <pre className="bg-black/10 dark:bg-white/5 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`onRecordCreate((e) => {
  // Runs before record is saved
  e.record.set('slug',
    slugify(e.record.get('title'))
  );
});`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">Custom Routes</h4>
              <pre className="bg-black/10 dark:bg-white/5 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`routerAdd("POST", "/webhook",
  (e) => {
    const body = e.requestBody();
    // Process incoming payload
    return e.json(200,
      { ok: true }
    );
  }
);`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">Cron Jobs</h4>
              <pre className="bg-black/10 dark:bg-white/5 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`cronAdd("daily cleanup",
  "0 3 * * *",
  () => {
    // Runs at 03:00 UTC daily
    const old = findRecords(
      "logs", "created < -30d"
    );
    deleteRecords("logs", old);
  }
);`}
              </pre>
            </div>
          </div>
        </div>

        {/* SDKs */}
        <div className={cn(cardVariants(), 'col-span-full')}>
          <CodeIcon className="size-8 mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-6' }))}>
            Client SDKs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">JavaScript / TypeScript</h4>
              <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`import { BaseClient } from '@hanzoai/base'

const base = new BaseClient('http://localhost:8090')

// Auth
await base.collection('users')
  .authWithPassword(email, pass)

// CRUD with type safety
const tasks = await base.collection('tasks')
  .getFullList<Task>({
    sort: '-created',
    expand: 'assignee'
  })`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">Go</h4>
              <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`import "github.com/hanzoai/base"

app := base.New()

app.OnRecordCreate("tasks").
  BindFunc(func(e *core.RecordEvent) error {
    // Custom logic
    return e.Next()
  })

app.Start()`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">Dart / Flutter</h4>
              <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`import 'package:hanzo_base/hanzo_base.dart';

final base = BaseClient('http://localhost:8090');

// Realtime subscription
base.collection('messages')
  .subscribe('*', (e) {
    print(e.action);
    print(e.record);
  });`}
              </pre>
            </div>
          </div>
        </div>

        {/* Architecture: Dev vs Prod */}
        <div className={cn(cardVariants(), 'col-span-full')}>
          <ServerIcon className="size-8 mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-6' }))}>
            Dev to Prod
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl border">
              <div className="flex items-center gap-3 mb-4">
                <TerminalIcon className="size-5" />
                <h4 className="font-medium text-lg">Local Development</h4>
              </div>
              <p className="text-fd-muted-foreground text-sm mb-4">
                Single binary, no dependencies. Embedded SQLite, starts in under 1 second.
              </p>
              <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs font-mono">
{`$ base serve --dev
# Auth, DB, REST API, Admin UI
# all running at localhost:8090`}
              </pre>
            </div>
            <div className="p-6 rounded-xl border">
              <div className="flex items-center gap-3 mb-4">
                <CloudIcon className="size-5" />
                <h4 className="font-medium text-lg">Production</h4>
              </div>
              <p className="text-fd-muted-foreground text-sm mb-4">
                PostgreSQL backend, horizontal replicas, K8s-native. Same binary, different config.
              </p>
              <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs font-mono">
{`# Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: base
          image: ghcr.io/hanzoai/base`}
              </pre>
            </div>
          </div>
        </div>

        {/* Native ZAP */}
        <div className={cn(cardVariants())}>
          <ZapIcon className="size-8 mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            ZAP Protocol
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            Zero-copy binary protocol for inter-service communication between Base
            instances. Uses Cap{"'"}n Proto RPC instead of JSON serialization.
          </p>
          <ul className="space-y-2 text-sm text-fd-muted-foreground">
            <li className="flex items-center gap-2">
              <ArrowRightIcon className="size-3" />
              Cap{"'"}n Proto RPC for zero-copy message passing
            </li>
            <li className="flex items-center gap-2">
              <ArrowRightIcon className="size-3" />
              Database, KV, and gateway transport layers
            </li>
            <li className="flex items-center gap-2">
              <ArrowRightIcon className="size-3" />
              ML-KEM / ML-DSA post-quantum TLS
            </li>
          </ul>
        </div>

        {/* Admin UI */}
        <div className={cn(cardVariants())}>
          <HardDriveIcon className="size-8 mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Admin Dashboard
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            Served at <code className="text-xs bg-fd-muted px-1 py-0.5 rounded">/_/</code>.
            Embedded in the binary. No separate deployment.
          </p>
          <ul className="space-y-2 text-sm text-fd-muted-foreground">
            <li className="flex items-center gap-2">
              <ArrowRightIcon className="size-3" />
              Visual schema editor for collections
            </li>
            <li className="flex items-center gap-2">
              <ArrowRightIcon className="size-3" />
              Record browser with inline editing
            </li>
            <li className="flex items-center gap-2">
              <ArrowRightIcon className="size-3" />
              User management and auth configuration
            </li>
            <li className="flex items-center gap-2">
              <ArrowRightIcon className="size-3" />
              API rules editor
            </li>
            <li className="flex items-center gap-2">
              <ArrowRightIcon className="size-3" />
              Request logs and system metrics
            </li>
          </ul>
        </div>

        {/* Quick Start */}
        <div className={cn(cardVariants({ variant: 'secondary' }), 'col-span-full')}>
          <h2 className={cn(headingVariants({ variant: 'h2', className: 'mb-6' }))}>
            Quick Start
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">1. Install</h4>
              <pre className="bg-black/10 dark:bg-white/5 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`# macOS
brew install hanzoai/tap/base

# Linux
curl -fsSL https://base.hanzo.ai/install | sh

# Docker
docker pull ghcr.io/hanzoai/base`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">2. Run</h4>
              <pre className="bg-black/10 dark:bg-white/5 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`# Start with dev mode
base serve --dev

# Admin UI: localhost:8090/_/
# API:      localhost:8090/api/`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">3. Query</h4>
              <pre className="bg-black/10 dark:bg-white/5 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`import { BaseClient } from '@hanzoai/base'

const base = new BaseClient(
  'http://localhost:8090'
)

const records = await base
  .collection('posts')
  .getFullList()`}
              </pre>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="col-span-full" id="pricing">
          <h2 className={cn(headingVariants({ variant: 'h2', className: 'mb-2' }))}>
            Pricing
          </h2>
          <p className="text-fd-muted-foreground mb-8">
            Each tier maps to a compute node. Pay for the resources you use.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={cn(
                  'relative flex flex-col p-6 rounded-2xl border transition-colors',
                  tier.highlight
                    ? 'border-fd-foreground/40 bg-fd-card shadow-lg'
                    : 'border-fd-border bg-fd-card',
                )}
              >
                {tier.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-xs font-medium bg-fd-foreground text-fd-background rounded-full">
                    {tier.badge}
                  </span>
                )}
                <h3 className="text-lg font-medium text-fd-foreground mb-1">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-medium text-fd-foreground">{tier.price}</span>
                  <span className="text-sm text-fd-muted-foreground">{tier.period}</span>
                </div>
                <p className="text-sm text-fd-muted-foreground mb-5">{tier.desc}</p>
                <ul className="flex flex-col gap-2 mb-6 flex-1">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm text-fd-muted-foreground">
                      <CheckIcon className="size-4 shrink-0 mt-0.5 text-fd-foreground" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.ctaHref}
                  className={cn(
                    'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-medium transition-colors text-center text-sm',
                    tier.highlight
                      ? 'bg-fd-foreground text-fd-background hover:bg-fd-foreground/90'
                      : 'border border-fd-border text-fd-foreground hover:bg-fd-accent',
                  )}
                >
                  {tier.cta}
                  <ArrowRightIcon className="size-4" />
                </Link>
              </div>
            ))}
          </div>

          {/* Enterprise */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl border border-fd-border bg-fd-card">
            <div>
              <h3 className="text-lg font-medium text-fd-foreground mb-1">Enterprise</h3>
              <p className="text-sm text-fd-muted-foreground max-w-lg">
                Dedicated infrastructure, custom SLA, SSO/SAML, priority support,
                and custom integrations. Runs on your cloud or ours.
              </p>
            </div>
            <a
              href="mailto:team@hanzo.ai"
              className={cn(
                buttonVariants({ variant: 'secondary' }),
                'shrink-0 gap-2',
              )}
            >
              <MessageCircleIcon className="size-4" />
              Contact Sales
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className={cn(cardVariants(), 'col-span-full text-center py-12')}>
          <LockIcon className="size-8 mx-auto mb-4" />
          <h2 className={cn(headingVariants({ variant: 'h2', className: 'mb-4' }))}>
            Start Building
          </h2>
          <p className="text-fd-muted-foreground mb-8 max-w-2xl mx-auto">
            Install the binary, define your collections, and ship.
            Open-source under MIT. Backed by Hanzo AI.
          </p>
          <div className="flex flex-row items-center justify-center gap-4">
            <Link href="/docs" className={cn(buttonVariants())}>
              Read the Docs
            </Link>
            <a
              href="https://github.com/hanzoai/base"
              target="_blank"
              rel="noreferrer noopener"
              className={cn(buttonVariants({ variant: 'secondary' }))}
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
