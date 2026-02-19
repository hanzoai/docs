import Link from 'next/link';
import { cn } from '@/lib/cn';
import { cva } from 'class-variance-authority';
import {
  ShieldCheckIcon,
  CodeIcon,
  NetworkIcon,
  LockIcon,
  ServerIcon,
  KeyIcon,
  WalletIcon,
  GlobeIcon,
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

const languages = [
  { name: 'Rust', icon: '\u{1F980}', color: 'text-orange-500', href: '/docs/sdks/rust' },
  { name: 'Go', icon: '\u{1F439}', color: 'text-cyan-500', href: '/docs/sdks/go' },
  { name: 'TypeScript', icon: '\u{1F4DC}', color: 'text-blue-500', href: '/docs/sdks/typescript' },
  { name: 'Python', icon: '\u{1F40D}', color: 'text-yellow-500', href: '/docs/sdks/python' },
  { name: 'C++', icon: '\u{26A1}', color: 'text-blue-400', href: '/docs/sdks/cpp' },
  { name: 'C', icon: '\u{1F527}', color: 'text-gray-500', href: '/docs/sdks/c' },
];

export default function Page() {
  return (
    <main className="text-landing-foreground pt-4 pb-6 dark:text-landing-foreground-dark md:pb-12">
      {/* Hero Section */}
      <div className="relative flex min-h-[600px] h-[70vh] max-h-[900px] border rounded-2xl overflow-hidden mx-auto w-full max-w-[1400px] bg-gradient-to-br from-brand/10 via-transparent to-brand-secondary/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="flex flex-col z-2 px-4 size-full md:p-12 max-md:items-center max-md:text-center">
          <div className="flex items-center gap-2 mt-12 text-xs text-brand font-medium rounded-full p-2 border border-brand/50 w-fit">
            <ShieldCheckIcon className="size-4" />
            Zero Trust Networking for AI
          </div>
          <h1 className={cn(headingVariants({ variant: 'h1' }), 'my-8 leading-tight')}>
            <span className="text-brand">Hanzo ZT</span> - Zero Trust
            <br />
            Overlay Networking
          </h1>
          <p className="text-lg text-fd-muted-foreground max-w-2xl mb-8">
            Zero-trust overlay networking with ZAP transport. NAT traversal, mTLS encryption,
            billing enforcement. SDKs for Rust, Go, TypeScript, Python, C++, and C.
          </p>
          <div className="flex flex-row items-center justify-center gap-4 flex-wrap w-fit">
            <Link href="/docs" className={cn(buttonVariants(), 'max-sm:text-sm')}>
              Get Started
            </Link>
            <a
              href="https://github.com/hanzozt"
              target="_blank"
              rel="noreferrer noopener"
              className={cn(buttonVariants({ variant: 'secondary' }), 'max-sm:text-sm')}
            >
              View on GitHub
            </a>
          </div>

          {/* Architecture Diagram */}
          <div className="mt-12 w-full max-w-3xl mx-auto">
            <div className="bg-fd-card border rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-2 border-b bg-fd-muted/50">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-red-500" />
                  <div className="size-3 rounded-full bg-yellow-500" />
                  <div className="size-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-fd-muted-foreground ml-2">architecture</span>
              </div>
              <pre className="p-4 text-sm overflow-x-auto font-mono leading-relaxed">
                <code>{`App --> ZAP Client --> ZT Transport --> ZT Fabric --> ZT Service
            |                        |
      Cap'n Proto RPC         x509 mTLS overlay
      (zero-copy binary)      (NAT traversal built-in)`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-10 mt-12 px-6 mx-auto w-full max-w-[1400px] md:px-12 lg:grid-cols-2">
        <p className="text-2xl tracking-tight leading-snug font-light col-span-full md:text-3xl xl:text-4xl">
          Hanzo ZT provides <span className="text-brand font-medium">zero-trust networking</span> with
          built-in <span className="text-brand font-medium">billing enforcement</span> and
          <span className="text-brand font-medium"> mTLS encryption</span> for every connection.
        </p>

        {/* Zero Trust Architecture */}
        <div className={cn(cardVariants())}>
          <LockIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Zero Trust Architecture
          </h3>
          <ul className="space-y-3 text-fd-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-brand">x509 mTLS</span> overlay network with certificate pinning
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand">NAT traversal</span> built-in, no open ports required
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand">Identity-first</span> connections, never trust the network
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand">Controller-managed</span> certificate lifecycle and rotation
            </li>
          </ul>
        </div>

        {/* ZAP Transport */}
        <div className={cn(cardVariants({ variant: 'secondary' }))}>
          <NetworkIcon className="size-8 mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            ZAP Transport
          </h3>
          <p className="mb-4">
            Cap'n Proto RPC over ZT fabric with 4-byte length-prefix framing and zero-copy
            message passing for maximum throughput.
          </p>
          <pre className="bg-black/20 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`// ZAP over ZT transport
let transport = ZtTransport::new(
    zt_network_id,
    zt_node_id,
    ZtConfig { mTLS: true }
)?;
let client = ZapClient::connect(transport)?;`}
          </pre>
        </div>

        {/* Hanzo IAM Auth */}
        <div className={cn(cardVariants())}>
          <KeyIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Hanzo IAM Auth
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            JWT authentication via hanzo.id with external JWT auth support through the ZT controller.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg border">
              <p className="font-medium">hanzo.id JWT</p>
              <p className="text-xs text-fd-muted-foreground">Native auth</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">External JWT</p>
              <p className="text-xs text-fd-muted-foreground">BYO identity</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">mTLS certs</p>
              <p className="text-xs text-fd-muted-foreground">Mutual auth</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">API keys</p>
              <p className="text-xs text-fd-muted-foreground">Service-to-service</p>
            </div>
          </div>
        </div>

        {/* Billing Enforcement */}
        <div className={cn(cardVariants())}>
          <WalletIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Billing Enforcement
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            No free tier. Balance check before dial, usage recording after every session. Built into the transport layer.
          </p>
          <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`// Billing is enforced at the transport layer
// 1. Check balance before connection
// 2. Meter bytes transferred
// 3. Record usage after session close
dial -> balance_check -> connect -> meter -> close -> record`}
          </pre>
        </div>

        {/* 6 Language SDKs */}
        <div className={cn(cardVariants(), 'col-span-full')}>
          <CodeIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-6' }))}>
            6 Language SDKs
          </h3>
          <div className="flex flex-wrap gap-4">
            {languages.map((lang) => (
              <Link
                key={lang.name}
                href={lang.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:border-brand transition-colors"
              >
                <span className="text-xl">{lang.icon}</span>
                <span className="font-medium">{lang.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* MCP + ZAP Integration */}
        <div className={cn(cardVariants())}>
          <GlobeIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            MCP + ZAP Integration
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            ZAP transport trait implementation with zt:// URL scheme and seamless gateway integration.
          </p>
          <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`// Connect via ZT URL scheme
let client = mcp::connect("zt://network-id/node-id")?;

// ZAP transport is automatic
let tools = client.list_tools().await?;`}
          </pre>
        </div>

        {/* Zero Trust + ZAP */}
        <div className={cn(cardVariants())}>
          <ServerIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            ZT Controller
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            Centralized network management with decentralized data plane. Manage identities, networks, and policies.
          </p>
          <ul className="space-y-2 text-sm text-fd-muted-foreground">
            <li>Network provisioning and membership</li>
            <li>Certificate authority and rotation</li>
            <li>Policy-based access control</li>
            <li>Usage metering and billing hooks</li>
          </ul>
        </div>

        {/* Quick Start */}
        <div className={cn(cardVariants({ variant: 'secondary' }), 'col-span-full')}>
          <h2 className={cn(headingVariants({ variant: 'h2', className: 'mb-6' }))}>
            Quick Start
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Rust</h4>
              <pre className="bg-black/20 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`cargo add hanzo-zt`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">Go</h4>
              <pre className="bg-black/20 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`go get github.com/hanzozt/sdk-golang`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">TypeScript</h4>
              <pre className="bg-black/20 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`npm install @hanzo/zt`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">Python</h4>
              <pre className="bg-black/20 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`pip install hanzo-zt`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">C++</h4>
              <pre className="bg-black/20 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`# CMakeLists.txt
FetchContent_Declare(
  hanzo_zt
  GIT_REPOSITORY
    github.com/hanzozt/zt-sdk-cpp
  GIT_TAG main
)`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">C</h4>
              <pre className="bg-black/20 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`# Link with ZT libraries
cc -o app app.c -lzt -lzt_zap`}
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
            Secure your AI infrastructure with zero-trust networking. Hanzo ZT provides the overlay
            network, authentication, and billing enforcement your services need.
          </p>
          <div className="flex flex-row items-center justify-center gap-4">
            <Link href="/docs" className={cn(buttonVariants())}>
              Read the Docs
            </Link>
            <a
              href="https://github.com/hanzozt"
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
