import Link from 'next/link';
import { cn } from '@/lib/cn';
import { cva } from 'class-variance-authority';
import {
  TimerIcon,
  RefreshCwIcon,
  LayersIcon,
  ShieldCheckIcon,
  WorkflowIcon,
  ServerIcon,
  CodeIcon,
  PlayIcon,
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
        primary: 'bg-brand text-brand-foreground hover:bg-brand-200',
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
      secondary: 'bg-brand-secondary text-brand-secondary-foreground',
      default: 'border bg-fd-card',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export default function Page() {
  return (
    <main className="text-landing-foreground pt-4 pb-6 dark:text-landing-foreground-dark md:pb-12">
      {/* Hero Section */}
      <div className="relative flex min-h-[600px] h-[70vh] max-h-[900px] border rounded-2xl overflow-hidden mx-auto w-full max-w-[1400px] bg-gradient-to-br from-brand/10 via-transparent to-brand-secondary/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="flex flex-col z-2 px-4 size-full md:p-12 max-md:items-center max-md:text-center">
          <div className="flex items-center gap-2 mt-12 text-xs text-brand font-medium rounded-full p-2 border border-brand/50 w-fit">
            <WorkflowIcon className="size-4" />
            Durable Execution for AI Agents
          </div>
          <h1 className={cn(headingVariants({ variant: 'h1' }), 'my-8 leading-tight')}>
            <span className="text-brand">Hanzo Tasks</span> - Workflows
            <br />
            That Never Fail
          </h1>
          <p className="text-lg text-fd-muted-foreground max-w-2xl mb-8">
            Durable workflow execution engine built on Temporal.io. Workflows survive crashes,
            retry on failure, and maintain full event history. Built for orchestrating AI agent
            swarms in Hanzo Playground.
          </p>
          <div className="flex flex-row items-center justify-center gap-4 flex-wrap w-fit">
            <Link href="/docs" className={cn(buttonVariants(), 'max-sm:text-sm')}>
              Get Started
            </Link>
            <a
              href="https://github.com/hanzoai/tasks"
              target="_blank"
              rel="noreferrer noopener"
              className={cn(buttonVariants({ variant: 'secondary' }), 'max-sm:text-sm')}
            >
              View on GitHub
            </a>
          </div>

          {/* Code Preview */}
          <div className="mt-12 w-full max-w-3xl mx-auto">
            <div className="bg-fd-card border rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-2 border-b bg-fd-muted/50">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-red-500" />
                  <div className="size-3 rounded-full bg-yellow-500" />
                  <div className="size-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-fd-muted-foreground ml-2">workflow.go</span>
              </div>
              <pre className="p-4 text-sm overflow-x-auto font-mono">
                <code>{`func AgentWorkflow(ctx workflow.Context, input AgentInput) (Result, error) {
    // Activities survive crashes and retry automatically
    var analysis AnalysisResult
    err := workflow.ExecuteActivity(ctx, AnalyzeData, input.Data).Get(ctx, &analysis)
    if err != nil {
        return Result{}, err
    }

    // Fan out to multiple agents in parallel
    futures := make([]workflow.Future, len(input.Agents))
    for i, agent := range input.Agents {
        futures[i] = workflow.ExecuteActivity(ctx, RunAgent, agent, analysis)
    }

    // Collect all results
    return aggregateResults(ctx, futures)
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-10 mt-12 px-6 mx-auto w-full max-w-[1400px] md:px-12 lg:grid-cols-2">
        <p className="text-2xl tracking-tight leading-snug font-light col-span-full md:text-3xl xl:text-4xl">
          Hanzo Tasks provides <span className="text-brand font-medium">durable execution</span> for
          AI agent workflows with <span className="text-brand font-medium">automatic retries</span>,
          <span className="text-brand font-medium"> full event history</span>, and
          <span className="text-brand font-medium"> priority queues</span>.
        </p>

        {/* Durable Workflows */}
        <div className={cn(cardVariants())}>
          <ShieldCheckIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Durable Workflows
          </h3>
          <ul className="space-y-3 text-fd-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-brand">Crash-proof</span> workflows survive server restarts
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand">Event sourced</span> full replay history for every execution
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand">Deterministic</span> replay guarantees consistent results
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand">Long-running</span> workflows can run for days or months
            </li>
          </ul>
        </div>

        {/* Automatic Retries */}
        <div className={cn(cardVariants({ variant: 'secondary' }))}>
          <RefreshCwIcon className="size-8 mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Automatic Retries
          </h3>
          <p className="mb-4">
            Configurable retry policies with exponential backoff. Failed activities
            retry automatically without losing progress. Set max attempts, timeouts,
            and backoff coefficients per activity.
          </p>
          <pre className="bg-black/20 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`RetryPolicy{
  InitialInterval:    time.Second,
  BackoffCoefficient: 2.0,
  MaximumInterval:    time.Minute,
  MaximumAttempts:    5,
}`}
          </pre>
        </div>

        {/* Priority Queues */}
        <div className={cn(cardVariants())}>
          <LayersIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Priority Queues
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            Route tasks to the right workers with named task queues. Urgent tasks
            execute first. Organize workers by capability, region, or priority level.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Named Queues</p>
              <p className="text-xs text-fd-muted-foreground">Route by capability</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Priority Levels</p>
              <p className="text-xs text-fd-muted-foreground">Urgent tasks first</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Fan-Out</p>
              <p className="text-xs text-fd-muted-foreground">Parallel execution</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Fan-In</p>
              <p className="text-xs text-fd-muted-foreground">Result aggregation</p>
            </div>
          </div>
        </div>

        {/* Timeouts & Deadlines */}
        <div className={cn(cardVariants())}>
          <TimerIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Timeouts and Deadlines
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            Enforce time limits at every level: workflow execution timeout, activity start-to-close
            timeout, schedule-to-start timeout, and heartbeat timeout for long-running activities.
          </p>
          <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`ActivityOptions{
  StartToCloseTimeout:    5 * time.Minute,
  ScheduleToStartTimeout: 10 * time.Second,
  HeartbeatTimeout:       30 * time.Second,
}`}
          </pre>
        </div>

        {/* Multi-Language SDKs */}
        <div className={cn(cardVariants(), 'col-span-full')}>
          <CodeIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-6' }))}>
            Multi-Language SDKs
          </h3>
          <div className="flex flex-wrap gap-4">
            {[
              { name: 'Go', href: '/docs/getting-started' },
              { name: 'Python', href: '/docs/sdk/python' },
              { name: 'REST API', href: '/docs/sdk/api' },
            ].map((sdk) => (
              <Link
                key={sdk.name}
                href={sdk.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:border-brand transition-colors"
              >
                <span className="font-medium">{sdk.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Architecture */}
        <div className={cn(cardVariants({ variant: 'secondary' }), 'col-span-full')}>
          <ServerIcon className="size-8 mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Architecture
          </h3>
          <pre className="bg-black/20 rounded-lg p-4 text-xs overflow-x-auto font-mono leading-relaxed">
{`┌───────────────────────────────────────────┐
│          Hanzo Tasks Server                │
│    (github.com/hanzoai/tasks)              │
│                                            │
│  ┌────────────┐  ┌───────────────────────┐ │
│  │ Frontend   │  │ Matching Engine       │ │
│  │ (gRPC)     │  │ (routes tasks to      │ │
│  │            │  │  available workers)   │ │
│  └────────────┘  └───────────────────────┘ │
│  ┌────────────┐  ┌───────────────────────┐ │
│  │ History    │  │ Visibility            │ │
│  │ Service    │  │ (search + list)       │ │
│  └────────────┘  └───────────────────────┘ │
│  ┌───────────────────────────────────────┐ │
│  │ Persistence (SQLite / PostgreSQL)     │ │
│  └───────────────────────────────────────┘ │
└───────────────────────────────────────────┘`}
          </pre>
        </div>

        {/* Quick Start */}
        <div className={cn(cardVariants(), 'col-span-full')}>
          <PlayIcon className="size-8 text-brand mb-4" />
          <h2 className={cn(headingVariants({ variant: 'h2', className: 'mb-6' }))}>
            Quick Start
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Docker</h4>
              <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`docker run -p 7233:7233 -p 8233:8233 \\
  ghcr.io/hanzoai/tasks:latest`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">Go SDK</h4>
              <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`go get go.temporal.io/sdk`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">Python SDK</h4>
              <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`pip install hanzo-tasks`}
              </pre>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className={cn(cardVariants(), 'col-span-full text-center py-12')}>
          <h2 className={cn(headingVariants({ variant: 'h2', className: 'mb-4' }))}>
            Ready to Build?
          </h2>
          <p className="text-fd-muted-foreground mb-8 max-w-2xl mx-auto">
            Stop worrying about failures. Hanzo Tasks handles retries, timeouts, and crash recovery
            so your AI agents can focus on the work.
          </p>
          <div className="flex flex-row items-center justify-center gap-4">
            <Link href="/docs" className={cn(buttonVariants())}>
              Read the Docs
            </Link>
            <a
              href="https://github.com/hanzoai/tasks"
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
