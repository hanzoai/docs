import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  Cloud,
  Code2,
  Database,
  FileJson2,
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

/* ── Products ────────────────────────────────────────────────────── */

const flagshipProducts = [
  {
    name: 'Cloud',
    tagline: 'LLM Gateway',
    description: 'Unified API for 200+ models from every major provider. Load balancing, caching, rate limiting, and observability built in.',
    href: '/docs/services/cloud',
    icon: Cloud,
  },
  {
    name: 'Chat',
    tagline: 'AI Chat',
    description: 'Multi-model conversations with MCP tool integration, file uploads, persistent history, and 14 Zen models.',
    href: '/docs/chat',
    icon: MessageCircle,
  },
  {
    name: 'Dev',
    tagline: 'AI Coding Agent',
    description: 'Code generation, debugging, and refactoring powered by Zen Coder. IDE integration with MCP tools.',
    href: '/docs/dev',
    icon: Terminal,
  },
  {
    name: 'Platform',
    tagline: 'PaaS',
    description: 'Git push deploy with automatic builds, SSL, and scaling. Docker containers with zero config.',
    href: '/docs/services/paas',
    icon: Globe,
  },
];

const devTools = [
  {
    name: 'SDKs',
    description: 'Python, TypeScript, Go, Rust, C',
    href: '/docs/sdks',
    icon: Code2,
  },
  {
    name: 'API Reference',
    description: 'OpenAPI specs for every endpoint',
    href: '/docs/openapi',
    icon: FileJson2,
  },
  {
    name: 'MCP Tools',
    description: '260+ tools for AI models',
    href: '/docs/mcp',
    icon: Terminal,
  },
  {
    name: 'ZAP Protocol',
    description: 'Zero-copy RPC, 10-100x faster than MCP',
    href: '/docs/zap',
    icon: Zap,
  },
];

/* ── All 33 services ─────────────────────────────────────────────── */

const serviceGroups = [
  {
    category: 'AI & Intelligence',
    services: [
      { name: 'Cloud', desc: 'LLM gateway, 200+ models', href: '/docs/services/cloud' },
      { name: 'Chat', desc: 'Multi-model AI chat', href: '/docs/services/chat' },
      { name: 'Search', desc: 'AI search & generative UI', href: '/docs/services/search' },
      { name: 'Bot', desc: '743+ skills assistant', href: '/docs/services/bot' },
      { name: 'Nexus', desc: 'Agent orchestration', href: '/docs/services/nexus' },
      { name: 'Vector', desc: 'Embeddings & RAG', href: '/docs/services/vector' },
      { name: 'ML', desc: 'MLOps & model registry', href: '/docs/services/ml' },
    ],
  },
  {
    category: 'Automation',
    services: [
      { name: 'Flow', desc: 'Visual workflow builder', href: '/docs/services/flow' },
      { name: 'Auto', desc: 'Event-driven tasks', href: '/docs/services/auto' },
      { name: 'Operative', desc: 'Computer use agent', href: '/docs/services/operative' },
    ],
  },
  {
    category: 'Platform',
    services: [
      { name: 'IAM', desc: 'Identity & SSO', href: '/docs/services/iam' },
      { name: 'Identity', desc: 'User profiles', href: '/docs/services/identity' },
      { name: 'Commerce', desc: 'Headless commerce', href: '/docs/services/commerce' },
      { name: 'Gateway', desc: 'API routing', href: '/docs/services/gateway' },
      { name: 'Guard', desc: 'AI safety & PII', href: '/docs/services/guard' },
      { name: 'Console', desc: 'LLM observability', href: '/docs/services/console' },
      { name: 'KMS', desc: 'Secrets management', href: '/docs/services/kms' },
      { name: 'Analytics', desc: 'Usage tracking', href: '/docs/services/analytics' },
    ],
  },
  {
    category: 'Infrastructure',
    services: [
      { name: 'PaaS', desc: 'Git push deploy', href: '/docs/services/paas' },
      { name: 'Platform', desc: 'Container orchestration', href: '/docs/services/platform' },
      { name: 'S3', desc: 'Object storage', href: '/docs/services/s3' },
      { name: 'DB', desc: 'PostgreSQL managed', href: '/docs/services/db' },
      { name: 'KV', desc: 'Redis key-value', href: '/docs/services/kv' },
      { name: 'MQ', desc: 'Message queues', href: '/docs/services/mq' },
      { name: 'Stream', desc: 'Kafka streaming', href: '/docs/services/stream' },
      { name: 'PubSub', desc: 'Real-time messaging', href: '/docs/services/pubsub' },
      { name: 'Edge', desc: 'Edge functions', href: '/docs/services/edge' },
      { name: 'Registry', desc: 'Container registry', href: '/docs/services/registry' },
      { name: 'Visor', desc: 'Container networking', href: '/docs/services/visor' },
    ],
  },
  {
    category: 'Operations',
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
      <section className="relative flex flex-col items-center text-center mx-auto w-full max-w-[1400px] px-6 pt-24 pb-20 md:pt-36 md:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_600px_300px_at_50%_0%,rgba(255,255,255,0.04),transparent_70%)]" />

        <div className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-[#a3a3a3] mb-8 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          One API &middot; 33 Services &middot; 200+ Models
        </div>

        <h1 className="relative text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
          <span className="text-white">Hanzo AI Cloud</span>
        </h1>
        <p className="relative mt-5 max-w-xl text-[#737373] text-lg md:text-xl leading-relaxed">
          AI infrastructure for developers.
          Build, deploy, and scale intelligent applications.
        </p>

        <div className="relative flex flex-row items-center gap-3 mt-10 flex-wrap justify-center">
          <Link
            href="/docs/services"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-medium text-black hover:bg-neutral-200 transition-colors"
          >
            Get Started
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/docs/openapi"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-white hover:bg-white/5 transition-colors"
          >
            API Reference
          </Link>
          <a
            href="https://console.hanzo.ai"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-[#a3a3a3] hover:text-white hover:bg-white/5 transition-colors"
          >
            <Key className="size-3.5" />
            Get API Key
          </a>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 space-y-20">

        {/* ── Quick Start ─────────────────────────────────────── */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Quick Start
              </h2>
              <p className="text-[#737373] text-sm mt-2">
                One API key. OpenAI-compatible. Start in 30 seconds.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-mono text-[#a3a3a3]">
              pip install hanzoai
            </div>
          </div>
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
              code={`from hanzoai import Hanzo

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

        {/* ── Flagship Products ────────────────────────────────── */}
        <section>
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Products
          </h2>
          <p className="text-[#737373] text-sm mb-8">
            Everything you need to build with AI.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flagshipProducts.map((p) => (
              <Link
                key={p.name}
                href={p.href}
                className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 no-underline"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-xl bg-white/[0.06] p-2.5">
                    <p.icon className="size-5 text-[#a3a3a3] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-white">{p.name}</div>
                    <div className="text-xs text-[#525252] font-mono">{p.tagline}</div>
                  </div>
                </div>
                <p className="text-sm text-[#737373] leading-relaxed group-hover:text-[#a3a3a3] transition-colors">
                  {p.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[#525252] group-hover:text-white transition-colors">
                  Learn more <ArrowRight className="size-3" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Developer Tools ─────────────────────────────────── */}
        <section>
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Developer Tools
          </h2>
          <p className="text-[#737373] text-sm mb-8">
            SDKs, APIs, and protocols for every stack.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {devTools.map((t) => (
              <Link
                key={t.name}
                href={t.href}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 no-underline"
              >
                <t.icon className="size-5 text-[#525252] mb-4 group-hover:text-white transition-colors" />
                <div className="font-semibold text-sm text-white mb-1">{t.name}</div>
                <div className="text-xs text-[#525252] group-hover:text-[#737373] transition-colors">{t.description}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Zen Models Banner ────────────────────────────────── */}
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="size-5 text-[#a3a3a3]" />
              <h2 className="text-2xl font-bold tracking-tight">
                Zen LM
              </h2>
              <span className="text-xs text-[#525252] font-mono bg-white/5 px-2 py-0.5 rounded-full">
                44 models
              </span>
            </div>
            <p className="text-[#737373] text-sm leading-relaxed max-w-2xl mb-6">
              Frontier AI models from 4B edge to 1T+ reasoning. MoDE (Mixture of Distilled Experts) architecture.
              Text, code, vision, audio, video, 3D, and safety. Open weights on HuggingFace.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
              {[
                { name: 'zen4', spec: '~400B MoDE' },
                { name: 'zen4-coder', spec: '~200B MoDE' },
                { name: 'zen4-thinking', spec: 'Deep CoT' },
                { name: 'zen3-omni', spec: '72B Multimodal' },
                { name: 'zen3-nano', spec: '4B Edge' },
                { name: 'zen3-guard', spec: '8B Safety' },
              ].map((m) => (
                <div key={m.name} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="text-xs font-mono font-medium text-white mb-1">{m.name}</div>
                  <div className="text-[10px] text-[#525252]">{m.spec}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="https://zenlm.org"
                target="_blank"
                rel="noreferrer noopener"
                className="text-xs font-medium text-white border border-white/20 rounded-full px-4 py-2 hover:bg-white/5 transition-colors"
              >
                zenlm.org &rarr;
              </a>
              <a
                href="https://huggingface.co/zenlm"
                target="_blank"
                rel="noreferrer noopener"
                className="text-xs text-[#525252] hover:text-white transition-colors"
              >
                HuggingFace &rarr;
              </a>
            </div>
          </div>
        </section>

        {/* ── All 33 Services ─────────────────────────────────── */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                33 Services
              </h2>
              <p className="text-[#737373] text-sm mt-2">
                Everything at <code className="text-xs text-white/70 bg-white/5 px-1.5 py-0.5 rounded">api.hanzo.ai</code>
              </p>
            </div>
            <Link
              href="/docs/services"
              className="text-sm text-[#525252] hover:text-white transition-colors hidden sm:block"
            >
              All services &rarr;
            </Link>
          </div>
          <div className="space-y-6">
            {serviceGroups.map((group) => (
              <div key={group.category}>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#525252] mb-3">
                  {group.category}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {group.services.map((s) => (
                    <Link
                      key={s.name}
                      href={s.href}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-200 no-underline"
                    >
                      <div className="text-xs font-medium text-white">{s.name}</div>
                      <div className="text-[10px] text-[#404040] mt-0.5 leading-tight">{s.desc}</div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <section className="relative text-center py-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_400px_200px_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)]" />
          <h2 className="relative text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Start building
          </h2>
          <p className="relative text-[#525252] text-sm mb-8">
            Free tier with generous limits. No credit card required.
          </p>
          <div className="relative flex items-center justify-center gap-3 flex-wrap">
            <a
              href="https://hanzo.id/signup?redirect_uri=https://console.hanzo.ai"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-medium text-black hover:bg-neutral-200 transition-colors"
            >
              Sign Up Free
              <ArrowRight className="size-4" />
            </a>
            <Link
              href="/docs/services"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-8 py-3 text-sm font-medium text-white hover:bg-white/5 transition-colors"
            >
              Browse Documentation
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
