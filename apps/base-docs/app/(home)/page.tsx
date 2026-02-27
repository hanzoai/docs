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
            Infinite Scale.
          </h1>
          <p className="text-lg text-fd-muted-foreground max-w-2xl mb-8">
            Auth, database, realtime subscriptions, file storage, and cloud functions
            in a single Go binary. Develop locally, deploy to the cloud with
            multi-tenant scaling.
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
          Everything you need to build <span className="font-medium">full-stack applications</span> with
          a <span className="font-medium">single binary</span> that scales to
          <span className="font-medium"> millions of users</span>.
        </p>

        {/* Database */}
        <div className={cn(cardVariants())}>
          <DatabaseIcon className="size-8 mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Database
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            SQLite for local dev, PostgreSQL for production. Full REST API auto-generated
            from your schema with filtering, sorting, pagination, and relations.
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
            Subscribe to database changes over SSE. Every collection record change is broadcast
            in real-time with optimistic update support.
          </p>
          <pre className="bg-black/10 dark:bg-white/5 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`// Subscribe to record changes
base.collection('messages').subscribe('*', (e) => {
  console.log(e.action); // 'create' | 'update' | 'delete'
  console.log(e.record); // the changed record
});

// Subscribe to specific record
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
            Built-in auth with email/password, OAuth2, and Hanzo IAM integration.
            API rules engine for fine-grained access control per collection.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Email/Password</p>
              <p className="text-xs text-fd-muted-foreground">Built-in with verification</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">OAuth2</p>
              <p className="text-xs text-fd-muted-foreground">Google, GitHub, Apple, etc.</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Hanzo IAM</p>
              <p className="text-xs text-fd-muted-foreground">Enterprise SSO via hanzo.id</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">API Rules</p>
              <p className="text-xs text-fd-muted-foreground">Per-collection access control</p>
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
            Upload files directly to collections. Local filesystem for dev, S3-compatible
            storage for production. Automatic thumbnail generation.
          </p>
          <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`// Upload a file
const formData = new FormData();
formData.append('document', file);
formData.append('title', 'Report Q4');

const record = await base.collection('documents')
  .create(formData);

// Get file URL
const url = base.files.getURL(record, record.document);`}
          </pre>
        </div>

        {/* Cloud Functions */}
        <div className={cn(cardVariants({ variant: 'secondary' }), 'col-span-full')}>
          <CloudIcon className="size-8 mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-6' }))}>
            Cloud Functions
          </h3>
          <p className="mb-6 max-w-2xl">
            Server-side JavaScript hooks that run before/after any API operation.
            Scheduled functions, custom endpoints, and event-driven workflows
            with the full power of the JSVM runtime.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Hooks</h4>
              <pre className="bg-black/10 dark:bg-white/5 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`onRecordCreate((e) => {
  // Validate, transform,
  // or enrich before save
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
    // Process webhook
    return e.json(200,
      { ok: true }
    );
  }
);`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">Scheduled</h4>
              <pre className="bg-black/10 dark:bg-white/5 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`cronAdd("daily cleanup",
  "0 3 * * *",
  () => {
    // Run at 3am daily
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
{`import Base from 'pocketbase'

const base = new Base('http://localhost:8090')

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
{`import 'package:pocketbase/pocketbase.dart';

final base = PocketBase('http://localhost:8090');

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
            Dev to Prod Architecture
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl border">
              <div className="flex items-center gap-3 mb-4">
                <TerminalIcon className="size-5" />
                <h4 className="font-medium text-lg">Local Development</h4>
              </div>
              <p className="text-fd-muted-foreground text-sm mb-4">
                Single binary, zero dependencies. SQLite embedded, instant startup.
              </p>
              <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs font-mono">
{`$ base serve --dev
# That's it. Auth, DB, API, Admin UI
# all running at localhost:8090`}
              </pre>
            </div>
            <div className="p-6 rounded-xl border">
              <div className="flex items-center gap-3 mb-4">
                <CloudIcon className="size-5" />
                <h4 className="font-medium text-lg">Production Cloud</h4>
              </div>
              <p className="text-fd-muted-foreground text-sm mb-4">
                Multi-tenant PostgreSQL, horizontal scaling, K8s-native deployment.
              </p>
              <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs font-mono">
{`# Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
spec:
  replicas: 3  # Scale horizontally
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
            Native ZAP Protocol
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            Zero-copy binary protocol between Base instances and backend services.
            10-100x faster than JSON serialization for inter-service communication.
          </p>
          <ul className="space-y-2 text-sm text-fd-muted-foreground">
            <li className="flex items-center gap-2">
              <ArrowRightIcon className="size-3" />
              Cap'n Proto RPC for zero-copy message passing
            </li>
            <li className="flex items-center gap-2">
              <ArrowRightIcon className="size-3" />
              Native database, KV, and gateway transport
            </li>
            <li className="flex items-center gap-2">
              <ArrowRightIcon className="size-3" />
              Post-quantum security with ML-KEM/ML-DSA
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
            Built-in admin UI at <code className="text-xs bg-fd-muted px-1 py-0.5 rounded">/_/</code> for managing
            collections, records, users, and settings. No separate deployment needed.
          </p>
          <ul className="space-y-2 text-sm text-fd-muted-foreground">
            <li className="flex items-center gap-2">
              <ArrowRightIcon className="size-3" />
              Visual collection schema editor
            </li>
            <li className="flex items-center gap-2">
              <ArrowRightIcon className="size-3" />
              Record browser with inline editing
            </li>
            <li className="flex items-center gap-2">
              <ArrowRightIcon className="size-3" />
              User management and auth settings
            </li>
            <li className="flex items-center gap-2">
              <ArrowRightIcon className="size-3" />
              API rules and access control
            </li>
            <li className="flex items-center gap-2">
              <ArrowRightIcon className="size-3" />
              Logs and system health monitoring
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
              <h4 className="font-medium mb-2">1. Download</h4>
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
              <h4 className="font-medium mb-2">2. Start</h4>
              <pre className="bg-black/10 dark:bg-white/5 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`# Start with dev mode
base serve --dev

# Admin UI: localhost:8090/_/
# API:      localhost:8090/api/`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">3. Build</h4>
              <pre className="bg-black/10 dark:bg-white/5 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`import Base from 'pocketbase'

const base = new Base(
  'http://localhost:8090'
)

const records = await base
  .collection('posts')
  .getFullList()`}
              </pre>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className={cn(cardVariants(), 'col-span-full text-center py-12')}>
          <LockIcon className="size-8 mx-auto mb-4" />
          <h2 className={cn(headingVariants({ variant: 'h2', className: 'mb-4' }))}>
            Ready to Build?
          </h2>
          <p className="text-fd-muted-foreground mb-8 max-w-2xl mx-auto">
            Start with a single binary locally and scale to millions of users in the cloud.
            Open-source, battle-tested, and backed by Hanzo AI.
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
