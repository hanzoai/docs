import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Cloud,
  Code2,
  Database,
  Globe,
  HardDrive,
  Key,
  MessageCircle,
  Monitor,
  Shield,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
} from 'lucide-react';
import { CodeBlock } from '@/components/code-block';

/* ── Zen model highlights ────────────────────────────────────────── */

const zenModels = [
  {
    name: 'zen4',
    params: '~400B MoDE',
    description: 'Flagship reasoning',
    color: '#fd4444',
  },
  {
    name: 'zen4-coder',
    params: '~200B MoDE',
    description: 'Code generation',
    color: '#f59e0b',
  },
  {
    name: 'zen4-thinking',
    params: '~400B MoDE',
    description: 'Deep reasoning chain',
    color: '#8b5cf6',
  },
  {
    name: 'zen3-omni',
    params: '72B',
    description: 'Vision + audio + text',
    color: '#3b82f6',
  },
  {
    name: 'zen3-nano',
    params: '4B',
    description: 'Edge & mobile',
    color: '#10b981',
  },
  {
    name: 'zen3-guard',
    params: '8B',
    description: 'Safety & moderation',
    color: '#ec4899',
  },
];

/* ── Products ────────────────────────────────────────────────────── */

const products = [
  {
    name: 'Cloud',
    tagline: 'Unified LLM gateway',
    href: '/docs/services/cloud',
    icon: Cloud,
    color: '#fd4444',
  },
  {
    name: 'Chat',
    tagline: 'AI chat with multi-model & MCP',
    href: '/docs/chat',
    icon: MessageCircle,
    color: '#3b82f6',
  },
  {
    name: 'Bot',
    tagline: 'Multi-channel AI assistant',
    href: '/docs/services/bot',
    icon: Bot,
    color: '#10b981',
  },
  {
    name: 'Flow',
    tagline: 'Visual workflow automation',
    href: '/docs/services/flow',
    icon: Workflow,
    color: '#f59e0b',
  },
  {
    name: 'Console',
    tagline: 'Observability, traces, evals',
    href: '/docs/services/console',
    icon: Monitor,
    color: '#8b5cf6',
  },
  {
    name: 'Platform',
    tagline: 'PaaS with git push deploy',
    href: '/docs/services/paas',
    icon: Globe,
    color: '#06b6d4',
  },
  {
    name: 'Space',
    tagline: 'S3-compatible object storage',
    href: '/docs/services/s3',
    icon: HardDrive,
    color: '#ec4899',
  },
];

/* ── All services ────────────────────────────────────────────────── */

const serviceGroups = [
  {
    category: 'AI & Intelligence',
    color: '#fd4444',
    icon: BrainCircuit,
    services: [
      { name: 'Cloud', desc: 'Unified LLM gateway', href: '/docs/services/cloud' },
      { name: 'Chat', desc: 'Multi-model AI chat', href: '/docs/services/chat' },
      { name: 'Search', desc: 'AI search & generative UI', href: '/docs/services/search' },
      { name: 'Bot', desc: 'Multi-channel assistant', href: '/docs/services/bot' },
      { name: 'Nexus', desc: 'Agent orchestration', href: '/docs/services/nexus' },
      { name: 'Vector', desc: 'Embeddings & RAG', href: '/docs/services/vector' },
      { name: 'ML', desc: 'MLOps & model registry', href: '/docs/services/ml' },
    ],
  },
  {
    category: 'Automation',
    color: '#f59e0b',
    icon: Workflow,
    services: [
      { name: 'Flow', desc: 'Visual workflow builder', href: '/docs/services/flow' },
      { name: 'Auto', desc: 'Event-driven tasks', href: '/docs/services/auto' },
      { name: 'Operative', desc: 'Computer use agent', href: '/docs/services/operative' },
    ],
  },
  {
    category: 'Platform',
    color: '#3b82f6',
    icon: Shield,
    services: [
      { name: 'IAM', desc: 'Identity & SSO', href: '/docs/services/iam' },
      { name: 'DID', desc: 'Decentralized identity', href: '/docs/services/did' },
      { name: 'Commerce', desc: 'Headless commerce', href: '/docs/services/commerce' },
      { name: 'Gateway', desc: 'API routing', href: '/docs/services/gateway' },
      { name: 'Guard', desc: 'AI safety & PII redaction', href: '/docs/services/guard' },
      { name: 'Console', desc: 'LLM observability', href: '/docs/services/console' },
      { name: 'KMS', desc: 'Secrets management', href: '/docs/services/kms' },
      { name: 'Analytics', desc: 'Usage & cost tracking', href: '/docs/services/analytics' },
    ],
  },
  {
    category: 'Infrastructure',
    color: '#10b981',
    icon: Database,
    services: [
      { name: 'PaaS', desc: 'Git push deploy', href: '/docs/services/paas' },
      { name: 'Platform', desc: 'Container orchestration', href: '/docs/services/platform' },
      { name: 'S3', desc: 'Object storage', href: '/docs/services/s3' },
      { name: 'DB', desc: 'PostgreSQL managed', href: '/docs/services/db' },
      { name: 'KV', desc: 'Redis key-value', href: '/docs/services/kv' },
      { name: 'MQ', desc: 'Message queues', href: '/docs/services/mq' },
      { name: 'Stream', desc: 'Kafka-compatible streaming', href: '/docs/services/stream' },
      { name: 'PubSub', desc: 'Real-time messaging', href: '/docs/services/pubsub' },
      { name: 'Edge', desc: 'Edge functions', href: '/docs/services/edge' },
      { name: 'Registry', desc: 'Container registry', href: '/docs/services/registry' },
      { name: 'Visor', desc: 'Container networking', href: '/docs/services/visor' },
    ],
  },
  {
    category: 'Operations',
    color: '#8b5cf6',
    icon: Monitor,
    services: [
      { name: 'Engine', desc: 'Inference engine', href: '/docs/services/engine' },
      { name: 'O11y', desc: 'Metrics & alerting', href: '/docs/services/o11y' },
      { name: 'DNS', desc: 'DNS management', href: '/docs/services/dns' },
      { name: 'ZT', desc: 'Zero-trust networking', href: '/docs/services/zt' },
    ],
  },
];

/* ── Page ─────────────────────────────────────────────────────────── */

export default function Page() {
  return (
    <main className="pb-6 md:pb-12">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center text-center mx-auto w-full max-w-[1400px] px-6 pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(253,68,68,0.08),transparent_70%)]" />
        <p className="relative text-xs text-[#fd4444] font-mono tracking-widest uppercase mb-6">
          Decentralized AI Cloud
        </p>
        <h1 className="relative text-5xl font-bold tracking-tight leading-[1.1] xl:text-6xl">
          Hanzo AI Cloud
        </h1>
        <p className="relative mt-4 max-w-lg text-[#a3a3a3] text-lg leading-relaxed">
          AI infrastructure for the decentralized internet.
          Build resilient, unstoppable applications.
        </p>
        <div className="relative flex flex-row items-center gap-3 mt-8 flex-wrap justify-center">
          <Link
            href="/docs/services"
            className="inline-flex items-center gap-2 rounded-full bg-[#fd4444] px-6 py-3 text-sm font-medium text-white hover:bg-[#fd4444]/90 transition-colors"
          >
            Explore Docs
            <ArrowRight className="size-4" />
          </Link>
          <a
            href="https://console.hanzo.ai"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-[#333] px-6 py-3 text-sm font-medium hover:bg-[#111] transition-colors"
          >
            <Key className="size-3.5" />
            Get API Key
          </a>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 space-y-16">
        {/* ── Zen Models ──────────────────────────────────────── */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Zen LM
              </h2>
              <p className="text-[#a3a3a3] text-sm mt-1">
                44 frontier models. From 4B edge to 1T+ reasoning.
              </p>
            </div>
            <Link
              href="/docs/llm"
              className="text-sm text-[#fd4444] hover:underline hidden sm:block"
            >
              All models &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {zenModels.map((m) => (
              <Link
                key={m.name}
                href="/docs/llm"
                className="group rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-4 hover:border-[color:var(--m-color)]/40 transition-colors no-underline"
                style={{ '--m-color': m.color } as React.CSSProperties}
              >
                <div
                  className="text-xs font-mono font-medium mb-2"
                  style={{ color: m.color }}
                >
                  {m.name}
                </div>
                <div className="text-[11px] text-[#666] mb-1">{m.params}</div>
                <div className="text-xs text-[#a3a3a3]">{m.description}</div>
              </Link>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="size-4 text-[#fd4444]" />
                <span className="text-sm font-medium">Mixture of Distilled Experts (MoDE)</span>
              </div>
              <p className="text-xs text-[#666]">
                Co-developed with Zoo Labs. Qwen3+ architecture. 600M&ndash;480B+ parameters.
                Text, code, vision, audio, video, 3D, and safety.
              </p>
            </div>
            <a
              href="https://zen.hanzo.ai"
              target="_blank"
              rel="noreferrer noopener"
              className="shrink-0 text-xs text-[#fd4444] border border-[#fd4444]/30 rounded-full px-4 py-2 hover:bg-[#fd4444]/10 transition-colors"
            >
              zen.hanzo.ai
            </a>
          </div>
        </section>

        {/* ── Products ────────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {products.map((p) => (
              <Link
                key={p.name}
                href={p.href}
                className="group flex items-start gap-3 rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-4 hover:border-[color:var(--p-color)]/40 transition-colors no-underline"
                style={{ '--p-color': p.color } as React.CSSProperties}
              >
                <p.icon
                  className="size-5 mt-0.5 shrink-0"
                  style={{ color: p.color }}
                />
                <div>
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-[#666] mt-0.5">{p.tagline}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Quick Start ─────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Quick Start
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CodeBlock
              code={`curl https://api.hanzo.ai/v1/chat/completions \\
  -H "Authorization: Bearer $HANZO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "zen4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`}
              lang="bash"
              wrapper={{ title: 'cURL' }}
            />
            <CodeBlock
              code={`from hanzo import Hanzo

client = Hanzo()
response = client.chat.completions.create(
    model="zen4",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`}
              lang="python"
              wrapper={{ title: 'Python' }}
            />
          </div>
        </section>

        {/* ── All Services ────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Services
          </h2>
          <p className="text-[#a3a3a3] text-sm mb-6">
            Everything at <code className="text-[#fd4444] text-xs">api.hanzo.ai</code>
          </p>
          <div className="space-y-4">
            {serviceGroups.map((group) => (
              <div key={group.category}>
                <div className="flex items-center gap-2 mb-2">
                  <group.icon className="size-4" style={{ color: group.color }} />
                  <h3 className="text-sm font-semibold" style={{ color: group.color }}>
                    {group.category}
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {group.services.map((s) => (
                    <Link
                      key={s.name}
                      href={s.href}
                      className="rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] px-3 py-2.5 hover:border-[#333] transition-colors no-underline"
                    >
                      <div className="text-xs font-medium">{s.name}</div>
                      <div className="text-[10px] text-[#555] mt-0.5 leading-tight">{s.desc}</div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Developer Tools ─────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Developer Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link
              href="/docs/sdks"
              className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-5 hover:border-[#333] transition-colors no-underline"
            >
              <Code2 className="size-5 text-[#fd4444] mb-3" />
              <div className="font-medium text-sm">SDKs</div>
              <div className="text-xs text-[#666] mt-1">Python, TypeScript, Go, Rust, C</div>
            </Link>
            <Link
              href="/docs/openapi"
              className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-5 hover:border-[#333] transition-colors no-underline"
            >
              <Globe className="size-5 text-[#3b82f6] mb-3" />
              <div className="font-medium text-sm">API Reference</div>
              <div className="text-xs text-[#666] mt-1">OpenAPI specs for every endpoint</div>
            </Link>
            <Link
              href="/docs/zap"
              className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-5 hover:border-[#333] transition-colors no-underline"
            >
              <Zap className="size-5 text-[#f59e0b] mb-3" />
              <div className="font-medium text-sm">ZAP Protocol</div>
              <div className="text-xs text-[#666] mt-1">Zero-copy RPC, 10-100x faster than MCP</div>
            </Link>
            <Link
              href="/docs/mcp"
              className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-5 hover:border-[#333] transition-colors no-underline"
            >
              <Terminal className="size-5 text-[#10b981] mb-3" />
              <div className="font-medium text-sm">MCP Tools</div>
              <div className="text-xs text-[#666] mt-1">260+ tools for AI models</div>
            </Link>
          </div>
        </section>

        {/* ── Zen of Hanzo / Philosophy ───────────────────────── */}
        <section className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-8 rounded-lg bg-[#fd4444]/10 flex items-center justify-center">
                <span className="text-lg">&#x2637;</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                The Zen of Hanzo
              </h2>
            </div>
            <p className="text-[#a3a3a3] text-sm leading-relaxed max-w-2xl mb-6">
              We build for the decentralized internet. Resilient, unstoppable
              applications that compose freely across any infrastructure.
              No vendor lock-in. No single points of failure.
              Infrastructure that adapts, scales, and endures.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg border border-[#1a1a1a]">
                <div className="text-[#fd4444] text-lg font-mono mb-1">&#x4E7E;</div>
                <div className="text-xs font-medium mb-1">Adaptability</div>
                <div className="text-[10px] text-[#555]">
                  Adapt to new contexts while maintaining principles
                </div>
              </div>
              <div className="text-center p-4 rounded-lg border border-[#1a1a1a]">
                <div className="text-[#3b82f6] text-lg font-mono mb-1">&#x5DF3;</div>
                <div className="text-xs font-medium mb-1">Composability</div>
                <div className="text-[10px] text-[#555]">
                  Disassemble rigid structures for reconfiguration
                </div>
              </div>
              <div className="text-center p-4 rounded-lg border border-[#1a1a1a]">
                <div className="text-[#10b981] text-lg font-mono mb-1">&#x4E2D;</div>
                <div className="text-xs font-medium mb-1">Integrity</div>
                <div className="text-[10px] text-[#555]">
                  Maintain integrity in all actions
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="https://hanzo.ai/zen"
                target="_blank"
                rel="noreferrer noopener"
                className="text-xs text-[#fd4444] border border-[#fd4444]/30 rounded-full px-4 py-2 hover:bg-[#fd4444]/10 transition-colors"
              >
                hanzo.ai/zen &rarr;
              </a>
              <Link
                href="/docs/zap"
                className="text-xs text-[#a3a3a3] border border-[#262626] rounded-full px-4 py-2 hover:text-[#fafafa] transition-colors no-underline"
              >
                ZAP: Post-quantum agent protocol
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <section className="text-center py-8">
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Start building
          </h2>
          <p className="text-[#a3a3a3] text-sm mb-6">
            Free tier with generous limits. No credit card required.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href="https://hanzo.id/signup?redirect_uri=https://console.hanzo.ai"
              className="inline-flex items-center gap-2 rounded-full bg-[#fd4444] px-6 py-3 text-sm font-medium text-white hover:bg-[#fd4444]/90 transition-colors"
            >
              Sign Up Free
              <ArrowRight className="size-4" />
            </a>
            <Link
              href="/docs/services"
              className="inline-flex items-center gap-2 rounded-full border border-[#333] px-6 py-3 text-sm font-medium hover:bg-[#111] transition-colors"
            >
              Browse Documentation
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
