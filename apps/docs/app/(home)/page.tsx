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
  MessageCircle,
  Monitor,
  Search,
  Shield,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CodeBlock } from '@/components/code-block';

/* -- Ecosystem grid -- big clickable squares -------------------------------- */

const ecosystem = [
  {
    name: 'Hanzo Cloud',
    desc: 'LLM gateway for 200+ models. Load balancing, caching, and observability.',
    icon: Cloud,
    href: '/docs/services/cloud',
    tag: 'AI',
  },
  {
    name: 'Hanzo Chat',
    desc: 'Multi-model AI chat with MCP tools, file uploads, and 14 Zen models.',
    icon: MessageCircle,
    href: '/docs/chat',
    tag: 'AI',
  },
  {
    name: 'Hanzo Dev',
    desc: 'AI coding agent with IDE integration, debugging, and MCP tools.',
    icon: Terminal,
    href: '/docs/dev',
    tag: 'AI',
  },
  {
    name: 'Hanzo Bot',
    desc: '743+ skills, 35+ channel adapters. Deploy AI bots anywhere.',
    icon: Bot,
    href: '/docs/services/bot',
    tag: 'AI',
  },
  {
    name: 'Hanzo Flow',
    desc: 'Visual workflow automation. Drag-and-drop AI pipelines.',
    icon: Workflow,
    href: '/docs/services/flow',
    tag: 'Automation',
  },
  {
    name: 'Hanzo Platform',
    desc: 'PaaS with git push deploy. Docker containers, SSL, scaling.',
    icon: Globe,
    href: '/docs/services/paas',
    tag: 'Infra',
  },
  {
    name: 'Hanzo Console',
    desc: 'Observability dashboard. Tracing, evals, and cost tracking.',
    icon: Monitor,
    href: '/docs/services/console',
    tag: 'Ops',
  },
  {
    name: 'Hanzo Space',
    desc: 'S3-compatible object storage with CDN and versioning.',
    icon: HardDrive,
    href: '/docs/services/s3',
    tag: 'Infra',
  },
  {
    name: 'Hanzo Search',
    desc: 'AI-powered search with generative UI and RAG.',
    icon: Search,
    href: '/docs/services/search',
    tag: 'AI',
  },
  {
    name: 'Hanzo Guard',
    desc: 'AI safety, PII detection, and content moderation.',
    icon: Shield,
    href: '/docs/services/guard',
    tag: 'Security',
  },
  {
    name: 'Hanzo IAM',
    desc: 'Identity, SSO, OAuth2, SAML. Unified auth for everything.',
    icon: Database,
    href: '/docs/services/iam',
    tag: 'Platform',
  },
  {
    name: 'Zen',
    desc: '44 frontier models, 4B to 1T+. Open weights on HuggingFace.',
    icon: Sparkles,
    href: 'https://zenlm.org',
    tag: 'Models',
    external: true,
  },
];

/* -- Developer quick links -------------------------------------------------- */

const devLinks = [
  {
    name: 'SDKs',
    desc: 'Python, TypeScript, Go, Rust, C',
    href: '/docs/sdks',
    icon: Code2,
  },
  {
    name: 'API Reference',
    desc: 'OpenAPI specs for all 33 services',
    href: '/docs/openapi',
    icon: FileJson2,
  },
  {
    name: 'MCP + ZAP',
    desc: '260+ tools + zero-copy RPC protocol',
    href: '/docs/mcp',
    icon: Terminal,
  },
  {
    name: 'Extensions',
    desc: 'IDE, browser, and desktop extensions',
    href: '/docs/projects/hanzoai/extension',
    icon: Zap,
  },
];

/* -- Page ------------------------------------------------------------------- */

export default function Page() {
  return (
    <main className="pb-6 md:pb-12">
      {/* -- Hero ---------------------------------------------------------- */}
      <section className="relative flex flex-col items-center text-center mx-auto w-full max-w-[1400px] px-6 pt-24 pb-16 md:pt-36 md:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_600px_300px_at_50%_0%,rgba(255,255,255,0.04),transparent_70%)]" />

        <Badge
          variant="outline"
          className="relative mb-8 rounded-full border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-[#a3a3a3] backdrop-blur font-normal"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white mr-2" />
          One API &middot; 33 Services &middot; 200+ Models
        </Badge>

        <h1 className="relative text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
          <span className="text-white">Hanzo AI Cloud</span>
        </h1>
        <p className="relative mt-5 max-w-xl text-[#737373] text-lg md:text-xl leading-relaxed">
          AI infrastructure for developers.
          Build, deploy, and scale intelligent applications.
        </p>

        {/* -- Install command -- the main CTA ------------------------------ */}
        <div className="relative mt-10 w-full max-w-lg">
          <Card className="border-white/[0.08] bg-white/[0.03] p-1 shadow-none gap-0 py-0 rounded-2xl">
            <CardContent className="flex items-center gap-3 rounded-xl bg-[#0a0a0a] px-5 py-4 font-mono text-sm">
              <span className="text-[#525252] select-none">$</span>
              <span className="text-white flex-1 text-left">curl hanzo.sh | sh</span>
              <button
                className="text-[#525252] hover:text-white transition-colors"
                title="Copy"
                onClick={undefined}
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              </button>
            </CardContent>
          </Card>
          <p className="text-xs text-[#404040] mt-3">
            Installs the <code className="text-[#666] bg-white/5 px-1 py-0.5 rounded">hanzo</code> CLI.
            Then <code className="text-[#666] bg-white/5 px-1 py-0.5 rounded">hanzo login</code> to get started.
          </p>
        </div>

        <div className="relative flex flex-row items-center gap-3 mt-8 flex-wrap justify-center">
          <Button asChild size="lg" className="rounded-full bg-white px-7 text-black hover:bg-neutral-200">
            <Link href="/docs/services">
              Get Started
              <ArrowRight className="size-4 ml-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full border-white/15 px-7 text-white hover:bg-white/5 bg-transparent">
            <Link href="/docs/openapi">
              API Reference
            </Link>
          </Button>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 space-y-24">

        {/* -- Quick Start Guide ------------------------------------------- */}
        <section>
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Quick Start
          </h2>
          <p className="text-[#737373] text-sm mb-8">
            Install the CLI, log in, and start using every Hanzo service from your terminal.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CodeBlock
              code={`# Install the Hanzo CLI
curl hanzo.sh | sh

# Log in (opens browser for OAuth)
hanzo login

# You're ready — try some things:
hanzo chat "Explain quantum computing"
hanzo models list
hanzo keys create my-project
hanzo deploy ./my-app`}
              lang="bash"
              wrapper={{ title: 'Terminal' }}
            />
            <CodeBlock
              code={`# Or use the Python SDK directly
pip install hanzoai

# Use with any OpenAI-compatible code
from hanzoai import Hanzo

client = Hanzo()  # reads HANZO_API_KEY
response = client.chat.completions.create(
    model="zen4",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`}
              lang="python"
              wrapper={{ title: 'Python SDK' }}
            />
          </div>
        </section>

        {/* -- Ecosystem -- big clickable cards ----------------------------- */}
        <section>
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Ecosystem
          </h2>
          <p className="text-[#737373] text-sm mb-8">
            Everything you need to build with AI. Click any card to jump to its docs.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {ecosystem.map((item) => {
              const isExternal = !!(item as { external?: boolean }).external;
              const linkProps = isExternal
                ? { target: '_blank' as const, rel: 'noreferrer noopener' }
                : {};
              return (
                <Card
                  key={item.name}
                  className="group relative border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 shadow-none py-0 gap-0 rounded-2xl min-h-[140px] sm:min-h-[160px]"
                >
                  {isExternal ? (
                    <a href={item.href} {...linkProps} className="absolute inset-0 z-10" />
                  ) : (
                    <Link href={item.href} className="absolute inset-0 z-10" />
                  )}
                  <CardHeader className="p-5 sm:p-6 pb-0 gap-0 grid-rows-none">
                    <div className="flex items-center justify-between mb-3">
                      <div className="rounded-xl bg-white/[0.06] p-2">
                        <item.icon className="size-5 text-[#666] group-hover:text-white transition-colors" />
                      </div>
                      <Badge variant="ghost" className="text-[10px] uppercase tracking-wider text-[#333] font-medium border-none px-0">
                        {item.tag}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm font-semibold text-white mb-1.5">
                      {item.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-[#525252] leading-relaxed group-hover:text-[#737373] transition-colors">
                      {item.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="p-5 sm:p-6 pt-3">
                    <span className="flex items-center gap-1 text-[10px] font-medium text-[#333] group-hover:text-white transition-colors">
                      {isExternal ? 'Visit' : 'View docs'} <ArrowRight className="size-3" />
                    </span>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

        {/* -- Developer Tools --------------------------------------------- */}
        <section>
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Developer Tools
          </h2>
          <p className="text-[#737373] text-sm mb-8">
            SDKs, APIs, and protocols for every stack.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {devLinks.map((t) => (
              <Card
                key={t.name}
                className="group relative border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 shadow-none py-0 gap-0 rounded-2xl"
              >
                <Link href={t.href} className="absolute inset-0 z-10" />
                <CardContent className="p-6">
                  <t.icon className="size-5 text-[#525252] mb-4 group-hover:text-white transition-colors" />
                  <CardTitle className="font-semibold text-sm text-white mb-1">{t.name}</CardTitle>
                  <CardDescription className="text-xs text-[#525252] group-hover:text-[#737373] transition-colors">{t.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* -- What the CLI can do ----------------------------------------- */}
        <Card className="border-white/[0.08] bg-white/[0.02] shadow-none py-0 gap-0 rounded-2xl overflow-hidden">
          <CardContent className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-white/[0.06] p-2.5">
                <Terminal className="size-5 text-[#a3a3a3]" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  The <code className="font-mono">hanzo</code> CLI
                </CardTitle>
                <CardDescription className="text-xs text-[#525252] mt-0.5">One tool for everything</CardDescription>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { cmd: 'hanzo chat', desc: 'Chat with any model interactively' },
                { cmd: 'hanzo models list', desc: 'Browse 200+ available models' },
                { cmd: 'hanzo keys create', desc: 'Create and manage API keys' },
                { cmd: 'hanzo deploy', desc: 'Deploy apps with git push' },
                { cmd: 'hanzo logs', desc: 'Stream logs from any service' },
                { cmd: 'hanzo spaces', desc: 'Manage S3-compatible storage' },
                { cmd: 'hanzo secrets', desc: 'Manage secrets and env vars' },
                { cmd: 'hanzo bot', desc: 'Deploy and manage AI bots' },
                { cmd: 'hanzo flow', desc: 'Run workflow automations' },
              ].map((item) => (
                <Card key={item.cmd} className="border-white/[0.06] bg-white/[0.02] shadow-none py-0 gap-0 rounded-lg">
                  <CardContent className="px-4 py-3">
                    <div className="text-xs font-mono font-medium text-white mb-1">{item.cmd}</div>
                    <div className="text-[11px] text-[#525252]">{item.desc}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* -- Zen Models Banner ------------------------------------------- */}
        <Card className="border-white/[0.08] bg-white/[0.02] shadow-none py-0 gap-0 rounded-2xl overflow-hidden">
          <CardContent className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="size-5 text-[#a3a3a3]" />
              <CardTitle className="text-2xl font-bold tracking-tight">
                Zen
              </CardTitle>
              <Badge variant="secondary" className="text-xs text-[#525252] font-mono bg-white/5 px-2 py-0.5 rounded-full border-transparent">
                44 models
              </Badge>
            </div>
            <p className="text-[#737373] text-sm leading-relaxed max-w-2xl mb-6">
              Frontier AI models from 4B edge to 1T+ reasoning. MoDE (Mixture of Diverse Experts) architecture.
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
                <Card key={m.name} className="border-white/[0.06] bg-white/[0.02] shadow-none py-0 gap-0 rounded-lg">
                  <CardContent className="p-3">
                    <div className="text-xs font-mono font-medium text-white mb-1">{m.name}</div>
                    <div className="text-[10px] text-[#525252]">{m.spec}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Button asChild variant="outline" size="sm" className="rounded-full border-white/20 text-white hover:bg-white/5 bg-transparent text-xs px-4 py-2 h-auto">
                <a
                  href="https://zenlm.org"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  zenlm.org &rarr;
                </a>
              </Button>
              <a
                href="https://huggingface.co/zenlm"
                target="_blank"
                rel="noreferrer noopener"
                className="text-xs text-[#525252] hover:text-white transition-colors"
              >
                HuggingFace &rarr;
              </a>
            </div>
          </CardContent>
        </Card>

        {/* -- CTA --------------------------------------------------------- */}
        <section className="relative text-center py-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_400px_200px_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)]" />
          <h2 className="relative text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Start building
          </h2>
          <p className="relative text-[#525252] text-sm mb-3">
            Free tier with generous limits. No credit card required.
          </p>
          <div className="relative font-mono text-sm text-[#666] mb-8">
            curl hanzo.sh | sh
          </div>
          <div className="relative flex items-center justify-center gap-3 flex-wrap">
            <Button asChild size="lg" className="rounded-full bg-white px-8 text-black hover:bg-neutral-200">
              <a href="https://hanzo.id/signup?redirect_uri=https://console.hanzo.ai">
                Sign Up Free
                <ArrowRight className="size-4 ml-1" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full border-white/15 px-8 text-white hover:bg-white/5 bg-transparent">
              <Link href="/docs/services">
                Browse Documentation
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
