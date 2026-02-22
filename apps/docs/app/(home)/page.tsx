import { cn } from '@/lib/cn';
import Link from 'next/link';
import { cva } from 'class-variance-authority';
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Cloud,
  Database,
  Globe,
  Key,
  Layers,
  MessageCircle,
  Monitor,
  Search,
  Server,
  Shield,
  Workflow,
  Zap,
} from 'lucide-react';
import { CodeBlock } from '@/components/code-block';

const cardVariants = cva('rounded-2xl text-sm p-6 bg-origin-border shadow-lg', {
  variants: {
    variant: {
      default: 'border bg-fd-card',
      brand: 'border border-[#fd4444]/20 bg-[#fd4444]/5 hover:border-[#fd4444]/40 transition-colors',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const serviceCategories = [
  {
    title: 'AI & Intelligence',
    description: 'LLM gateway, agents, search, vector DB, and ML pipelines.',
    href: '/docs/services/cloud',
    icon: BrainCircuit,
    color: '#fd4444',
    services: ['Cloud', 'Chat', 'Search', 'Bot', 'Nexus', 'Vector', 'ML'],
  },
  {
    title: 'Automation',
    description: 'Visual workflows, event-driven tasks, and browser automation.',
    href: '/docs/services/flow',
    icon: Workflow,
    color: '#f59e0b',
    services: ['Flow', 'Auto', 'Operative'],
  },
  {
    title: 'Platform',
    description: 'IAM, identity, commerce, API gateway, and observability.',
    href: '/docs/services/iam',
    icon: Shield,
    color: '#3b82f6',
    services: ['IAM', 'Identity', 'Commerce', 'Gateway', 'Guard', 'Console', 'KMS', 'Analytics'],
  },
  {
    title: 'Infrastructure',
    description: 'PaaS, databases, storage, queues, edge functions, and registry.',
    href: '/docs/services/paas',
    icon: Database,
    color: '#10b981',
    services: ['PaaS', 'Platform', 'S3', 'DB', 'KV', 'MQ', 'Kafka', 'PubSub', 'Edge', 'Registry', 'Visor'],
  },
  {
    title: 'Operations',
    description: 'Inference engine, observability, DNS, and zero-trust networking.',
    href: '/docs/services/engine',
    icon: Monitor,
    color: '#8b5cf6',
    services: ['Engine', 'O11y', 'DNS', 'ZT'],
  },
];

const quickLinks = [
  {
    title: 'Get an API Key',
    description: 'Sign up and get your API key in seconds.',
    href: 'https://console.hanzo.ai',
    icon: Key,
  },
  {
    title: 'LLM Gateway',
    description: '100+ models from all major providers.',
    href: '/docs/services/cloud',
    icon: Cloud,
  },
  {
    title: 'SDKs & Libraries',
    description: 'Python, TypeScript, Go, Rust, and C.',
    href: '/docs/sdks',
    icon: Layers,
  },
  {
    title: 'API Reference',
    description: 'Complete REST API documentation.',
    href: '/docs/openapi',
    icon: Globe,
  },
];

export default function Page() {
  return (
    <main className="pt-4 pb-6 md:pb-12">
      {/* Hero */}
      <div className="relative flex flex-col items-center text-center border rounded-2xl overflow-hidden mx-auto w-full max-w-[1400px] px-6 py-20 md:py-28 bg-gradient-to-b from-[#0a0a0a] to-[#111]">
        <p className="text-xs text-[#fd4444] font-medium rounded-full px-3 py-1.5 border border-[#fd4444]/30 mb-6">
          One API key. One gateway. 33 services.
        </p>
        <h1 className="text-4xl font-medium tracking-tight leading-tight xl:text-5xl">
          Hanzo <span className="text-[#fd4444]">Documentation</span>
        </h1>
        <p className="mt-4 max-w-xl text-[#a3a3a3] text-lg">
          Everything you need to build with Hanzo AI Cloud &mdash; from LLM
          inference to full-stack infrastructure.
        </p>
        <div className="flex flex-row items-center gap-4 mt-8 flex-wrap justify-center">
          <Link
            href="/docs/services"
            className="inline-flex items-center gap-2 rounded-full bg-[#fd4444] px-5 py-3 text-sm font-medium text-white hover:bg-[#fd4444]/90 transition-colors"
          >
            Explore Services
            <ArrowRight className="size-4" />
          </Link>
          <a
            href="https://console.hanzo.ai"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium hover:bg-fd-accent transition-colors"
          >
            Get API Key
          </a>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 mt-12 space-y-12">
        {/* Quick Start */}
        <section>
          <h2 className="text-2xl font-medium tracking-tight mb-6">
            Quick Start
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CodeBlock
              code={`curl https://api.hanzo.ai/v1/chat/completions \\
  -H "Authorization: Bearer $HANZO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "claude-sonnet-4-20250514",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`}
              lang="bash"
              wrapper={{ title: 'cURL' }}
            />
            <CodeBlock
              code={`from hanzo import Hanzo

client = Hanzo()

response = client.chat.completions.create(
    model="claude-sonnet-4-20250514",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`}
              lang="python"
              wrapper={{ title: 'Python SDK' }}
            />
          </div>
        </section>

        {/* Quick Links */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className={cn(
                  cardVariants({ variant: 'brand' }),
                  'flex flex-col gap-2 no-underline hover:no-underline',
                )}
              >
                <link.icon className="size-5 text-[#fd4444]" />
                <h3 className="font-medium">{link.title}</h3>
                <p className="text-fd-muted-foreground text-xs">
                  {link.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Service Categories */}
        <section>
          <h2 className="text-2xl font-medium tracking-tight mb-2">
            33 Services
          </h2>
          <p className="text-fd-muted-foreground mb-6">
            Everything at <code className="text-[#fd4444]">api.hanzo.ai</code>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceCategories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className={cn(
                  cardVariants(),
                  'flex flex-col gap-3 no-underline hover:border-[color:var(--cat-color)]/40 transition-colors',
                )}
                style={{ '--cat-color': category.color } as React.CSSProperties}
              >
                <category.icon
                  className="size-6"
                  style={{ color: category.color }}
                />
                <h3 className="font-medium text-base">{category.title}</h3>
                <p className="text-fd-muted-foreground text-xs">
                  {category.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                  {category.services.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-fd-accent text-fd-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Products CTA */}
        <section className="rounded-2xl border border-[#fd4444]/20 bg-gradient-to-br from-[#fd4444]/5 to-transparent p-8 text-center">
          <h2 className="text-2xl font-medium tracking-tight mb-2">
            Ready to build?
          </h2>
          <p className="text-fd-muted-foreground mb-6 max-w-md mx-auto">
            Get started with Hanzo AI Cloud. Free tier available with generous
            rate limits.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="https://hanzo.id/signup?redirect_uri=https://console.hanzo.ai"
              className="inline-flex items-center gap-2 rounded-full bg-[#fd4444] px-5 py-3 text-sm font-medium text-white hover:bg-[#fd4444]/90 transition-colors"
            >
              Sign Up Free
              <ArrowRight className="size-4" />
            </a>
            <Link
              href="/docs/services"
              className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium hover:bg-fd-accent transition-colors"
            >
              Browse All Services
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
