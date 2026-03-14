import Link from 'next/link';
import { cn } from '@/lib/cn';
import { cva } from 'class-variance-authority';
import {
  GlobeIcon,
  ShieldCheckIcon,
  ServerIcon,
  CloudIcon,
  LayersIcon,
  ScrollTextIcon,
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
            <GlobeIcon className="size-4" />
            Multi-Tenant DNS Management
          </div>
          <h1 className={cn(headingVariants({ variant: 'h1' }), 'my-8 leading-tight')}>
            <span className="text-brand">Hanzo DNS</span> — Route 53
            <br />
            for Your Infrastructure
          </h1>
          <p className="text-lg text-fd-muted-foreground max-w-2xl mb-8">
            Self-service DNS management with Cloudflare at edge, CoreDNS as engine,
            and full Hanzo Console integration. Multi-tenant, audited, and automated.
          </p>
          <div className="flex flex-row items-center justify-center gap-4 flex-wrap w-fit">
            <Link href="/docs" className={cn(buttonVariants(), 'max-sm:text-sm')}>
              Get Started
            </Link>
            <a
              href="https://github.com/hanzoai/dns"
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
                  <div className="size-3 rounded-full bg-red-500" />
                  <div className="size-3 rounded-full bg-yellow-500" />
                  <div className="size-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-fd-muted-foreground ml-2">terminal</span>
              </div>
              <pre className="p-4 text-sm overflow-x-auto font-mono">
                <code>{`$ curl -X POST https://dns.hanzo.ai/api/v1/sync \\
    -H "Authorization: Bearer $TOKEN" \\
    -d '{
      "zones": [{
        "zone": "example.com.",
        "records": [
          {"name": "www", "type": "A", "content": "10.0.0.1", "ttl": 300},
          {"name": "@", "type": "MX", "content": "mail.example.com.", "priority": 10}
        ]
      }]
    }'

{
  "results": [
    {"zone": "example.com.", "created": 2, "deleted": 0}
  ]
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-10 mt-12 px-6 mx-auto w-full max-w-[1400px] md:px-12 lg:grid-cols-2">
        <p className="text-2xl tracking-tight leading-snug font-light col-span-full md:text-3xl xl:text-4xl">
          Manage DNS with <span className="text-brand font-medium">multi-tenancy</span>,{' '}
          <span className="text-brand font-medium">Cloudflare edge sync</span>, and{' '}
          <span className="text-brand font-medium">full audit trails</span>.
        </p>

        {/* Multi-Tenant */}
        <div className={cn(cardVariants())}>
          <ShieldCheckIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Multi-Tenant Isolation
          </h3>
          <ul className="space-y-3 text-fd-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-brand">Org-scoped</span> zones with IAM integration
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand">RBAC</span> — owners manage, members view
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand">OIDC</span> JWT validation on all API endpoints
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand">Audit logs</span> for every change
            </li>
          </ul>
        </div>

        {/* Cloudflare */}
        <div className={cn(cardVariants({ variant: 'secondary' }))}>
          <CloudIcon className="size-8 mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Cloudflare at Edge
          </h3>
          <p className="mb-4">
            Per-record Cloudflare sync with proxy control. Get DDoS protection,
            CDN, and automatic SSL with a single toggle.
          </p>
          <pre className="bg-black/20 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`# Sync to Cloudflare with proxy enabled
createRecord({
  name: "www",
  type: "A",
  content: "10.0.0.1",
  syncToCloudflare: true,
  proxied: true
})`}
          </pre>
        </div>

        {/* CoreDNS */}
        <div className={cn(cardVariants())}>
          <ServerIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            CoreDNS Engine
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            Authoritative DNS powered by CoreDNS with the custom hanzodns plugin.
            In-memory store with REST API and bulk sync.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg border">
              <p className="font-medium">REST API</p>
              <p className="text-xs text-fd-muted-foreground">:8443 CRUD + bulk sync</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">DNS Server</p>
              <p className="text-xs text-fd-muted-foreground">:53 authoritative</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">OIDC Auth</p>
              <p className="text-xs text-fd-muted-foreground">JWT middleware</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Bulk Sync</p>
              <p className="text-xs text-fd-muted-foreground">Atomic zone replace</p>
            </div>
          </div>
        </div>

        {/* Operator */}
        <div className={cn(cardVariants())}>
          <LayersIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            K8s Operator
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            Kubernetes operator bridges PostgreSQL, CoreDNS, and Cloudflare.
            Three CRDs for declarative DNS management.
          </p>
          <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`apiVersion: dns.hanzo.ai/v1alpha1
kind: DnsZone
metadata:
  name: example-com
spec:
  zone: example.com.
  syncToCoreDNS: true`}
          </pre>
        </div>

        {/* Audit + Console */}
        <div className={cn(cardVariants(), 'col-span-full')}>
          <ScrollTextIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-6' }))}>
            Console Integration
          </h3>
          <div className="flex flex-wrap gap-4">
            {[
              { name: 'Zone Management', desc: 'Create, edit, delete zones' },
              { name: 'Record Table', desc: 'Inline edit with type validation' },
              { name: 'Audit Log', desc: 'Full change history per zone' },
              { name: 'DIG Tool', desc: 'Query DNS from the console' },
              { name: 'Bulk Import', desc: 'BIND zone file import' },
              { name: 'CF Sync', desc: 'Per-record Cloudflare control' },
            ].map((feature) => (
              <div
                key={feature.name}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border"
              >
                <span className="font-medium">{feature.name}</span>
                <span className="text-xs text-fd-muted-foreground">{feature.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={cn(cardVariants(), 'col-span-full text-center py-12')}>
          <h2 className={cn(headingVariants({ variant: 'h2', className: 'mb-4' }))}>
            Ready to Manage DNS?
          </h2>
          <p className="text-fd-muted-foreground mb-8 max-w-2xl mx-auto">
            Replace manual Cloudflare API calls with self-service DNS management.
            Full multi-tenancy, audit trails, and operator-driven reconciliation.
          </p>
          <div className="flex flex-row items-center justify-center gap-4">
            <Link href="/docs" className={cn(buttonVariants())}>
              Read the Docs
            </Link>
            <a
              href="https://github.com/hanzoai/dns"
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
