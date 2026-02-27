import Link from 'next/link';
import { cn } from '@/lib/cn';
import { cva } from 'class-variance-authority';
import {
  BoxesIcon,
  ContainerIcon,
  GlobeIcon,
  GitBranchIcon,
  LayersIcon,
  ActivityIcon,
  ServerIcon,
  CloudIcon,
  ShieldCheckIcon,
  ZapIcon,
  ArrowRightIcon,
  TerminalIcon,
  MonitorIcon,
  NetworkIcon,
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
  'inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-medium tracking-tight transition-all duration-200',
  {
    variants: {
      variant: {
        primary: 'bg-brand text-brand-foreground hover:bg-brand-200 shadow-lg shadow-brand/25 hover:shadow-brand/40',
        secondary: 'border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

const cardVariants = cva('rounded-2xl text-sm p-6 bg-origin-border shadow-lg transition-all duration-300', {
  variants: {
    variant: {
      secondary: 'bg-brand-secondary text-brand-secondary-foreground',
      default: 'border bg-fd-card hover:border-brand/30 hover:shadow-brand/5',
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
      <div className="relative flex min-h-[600px] h-[75vh] max-h-[900px] border rounded-2xl overflow-hidden mx-auto w-full max-w-[1400px] bg-gradient-to-br from-brand/10 via-transparent to-brand-secondary/10">
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/20 rounded-full blur-3xl animate-pulse-fast" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-secondary/20 rounded-full blur-3xl animate-pulse-fast" style={{ animationDelay: '500ms' }} />
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="flex flex-col z-2 px-4 size-full md:p-12 max-md:items-center max-md:text-center">
          <div className="flex items-center gap-2 mt-12 text-xs text-brand font-medium rounded-full p-2 border border-brand/50 w-fit">
            <BoxesIcon className="size-4" />
            Cloud Platform
          </div>
          <h1 className={cn(headingVariants({ variant: 'h1' }), 'my-8 leading-tight')}>
            <span className="text-brand">Deploy Anywhere.</span>
            <br />
            One Dashboard.
          </h1>
          <p className="text-lg text-fd-muted-foreground max-w-2xl mb-8">
            Kubernetes, Docker Swarm, Docker Compose, or bare VMs — deploy and manage everything
            from a single platform. Multi-cluster fleet management, git-powered builds, and
            real-time monitoring.
          </p>
          <div className="flex flex-row items-center justify-center gap-4 flex-wrap w-fit">
            <a href="https://app.platform.hanzo.ai" className={cn(buttonVariants(), 'max-sm:text-sm')}>
              Get Started Free
              <ArrowRightIcon className="size-4" />
            </a>
            <Link href="/docs" className={cn(buttonVariants({ variant: 'secondary' }), 'max-sm:text-sm')}>
              Read the Docs
            </Link>
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
                <code>{`$ hanzo deploy --cluster prod-k8s

  Connecting to cluster prod-k8s (kubernetes)...
  Building image from Dockerfile...
  Pushing to ghcr.io/acme/api:v2.4.1

  Deploying:
  ✓ Created namespace acme-prod
  ✓ Applied deployment (3 replicas)
  ✓ Configured ingress api.acme.com
  ✓ Provisioned TLS certificate
  ✓ Health checks passing

  Live at https://api.acme.com
  Dashboard: https://app.platform.hanzo.ai/clusters/prod-k8s`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Orchestrators Strip */}
      <div className="flex flex-wrap items-center justify-center gap-8 mt-16 px-6 mx-auto max-w-[1400px]">
        {[
          { icon: BoxesIcon, label: 'Kubernetes' },
          { icon: ContainerIcon, label: 'Docker Swarm' },
          { icon: LayersIcon, label: 'Docker Compose' },
          { icon: MonitorIcon, label: 'Virtual Machines' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3 px-6 py-3 rounded-full border bg-fd-card/50 text-fd-muted-foreground hover:text-fd-foreground hover:border-brand/30 transition-colors">
            <item.icon className="size-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-8 mt-16 px-6 mx-auto w-full max-w-[1400px] md:px-12 lg:grid-cols-2 xl:grid-cols-3">
        <p className="text-2xl tracking-tight leading-snug font-light col-span-full md:text-3xl xl:text-4xl">
          Everything you need to <span className="text-brand font-medium">deploy</span>,{' '}
          <span className="text-brand font-medium">scale</span>, and{' '}
          <span className="text-brand font-medium">monitor</span> your infrastructure.
        </p>

        {/* Kubernetes */}
        <div className={cn(cardVariants())}>
          <BoxesIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-3' }))}>
            Kubernetes Orchestration
          </h3>
          <p className="text-fd-muted-foreground">
            Full Kubernetes management — deployments, statefulsets, cronjobs, ingress,
            and auto-scaling. Connect any cluster or provision new ones.
          </p>
        </div>

        {/* Docker */}
        <div className={cn(cardVariants())}>
          <ContainerIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-3' }))}>
            Docker Swarm & Compose
          </h3>
          <p className="text-fd-muted-foreground">
            Deploy Docker Swarm services or Compose stacks with a single click.
            Perfect for smaller teams that want simplicity without sacrificing power.
          </p>
        </div>

        {/* VMs */}
        <div className={cn(cardVariants())}>
          <MonitorIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-3' }))}>
            VM Management
          </h3>
          <p className="text-fd-muted-foreground">
            Launch and manage virtual machines on AWS, DigitalOcean, and Hetzner.
            Built-in browser terminal, volume management, and SSH access.
          </p>
        </div>

        {/* Git Builds */}
        <div className={cn(cardVariants())}>
          <GitBranchIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-3' }))}>
            Git-Powered Builds
          </h3>
          <p className="text-fd-muted-foreground">
            Push to deploy. Tekton pipelines with Kaniko for rootless container builds.
            Supports GitHub, GitLab, and Bitbucket with automatic webhooks.
          </p>
        </div>

        {/* Fleet */}
        <div className={cn(cardVariants())}>
          <NetworkIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-3' }))}>
            Multi-Cluster Fleet
          </h3>
          <p className="text-fd-muted-foreground">
            Manage dozens of clusters from one dashboard. Register existing clusters
            or auto-provision new ones on DigitalOcean with a single command.
          </p>
        </div>

        {/* Monitoring */}
        <div className={cn(cardVariants())}>
          <ActivityIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-3' }))}>
            Real-Time Monitoring
          </h3>
          <p className="text-fd-muted-foreground">
            Stream container logs in real-time. Built-in metrics, resource utilization,
            and deployment history with full audit trail.
          </p>
        </div>
      </div>

      {/* Architecture section */}
      <div className="mt-20 px-6 mx-auto w-full max-w-[1400px] md:px-12">
        <div className={cn(cardVariants({ variant: 'secondary' }), 'p-8 md:p-12')}>
          <h2 className={cn(headingVariants({ variant: 'h2', className: 'mb-6' }))}>
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', icon: GitBranchIcon, title: 'Push Code', desc: 'Push to your Git repo or connect a container registry' },
              { step: '02', icon: ZapIcon, title: 'Build', desc: 'Tekton pipelines build your image with Kaniko' },
              { step: '03', icon: ServerIcon, title: 'Deploy', desc: 'Deployed to your cluster — K8s, Swarm, or Compose' },
              { step: '04', icon: GlobeIcon, title: 'Live', desc: 'Automatic TLS, custom domains, and health monitoring' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold opacity-30">{item.step}</span>
                  <item.icon className="size-6" />
                </div>
                <h4 className="font-medium text-lg">{item.title}</h4>
                <p className="text-sm opacity-80">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security & Access Control */}
      <div className="mt-16 px-6 mx-auto w-full max-w-[1400px] md:px-12">
        <div className={cn(cardVariants(), 'col-span-full')}>
          <ShieldCheckIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h2', className: 'mb-6' }))}>
            Enterprise Access Control
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Organizations', desc: 'Multi-org with team management' },
              { title: 'RBAC', desc: 'Owner, Admin, Developer, Viewer roles' },
              { title: 'Cluster Permissions', desc: 'Per-cluster access control' },
              { title: 'Environment Protection', desc: 'Approval workflows for production' },
            ].map((item) => (
              <div key={item.title} className="p-4 rounded-xl border bg-fd-muted/20">
                <p className="font-medium mb-1">{item.title}</p>
                <p className="text-xs text-fd-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="mt-20 px-6 mx-auto w-full max-w-[1400px] md:px-12">
        <h2 className={cn(headingVariants({ variant: 'h2', className: 'text-center mb-4' }))}>
          Simple, Transparent Pricing
        </h2>
        <p className="text-center text-fd-muted-foreground mb-10 max-w-2xl mx-auto">
          Start free. Scale as you grow. No hidden fees.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Nano', cpu: '1 vCPU', ram: '1 GB', storage: '25 GB SSD', price: '$5', bandwidth: '1 TB' },
            { name: 'Micro', cpu: '1 vCPU', ram: '2 GB', storage: '50 GB SSD', price: '$10', bandwidth: '2 TB' },
            { name: 'Small', cpu: '2 vCPU', ram: '4 GB', storage: '80 GB SSD', price: '$20', bandwidth: '4 TB', popular: true },
            { name: 'Medium', cpu: '4 vCPU', ram: '8 GB', storage: '160 GB SSD', price: '$40', bandwidth: '5 TB' },
            { name: 'Power', cpu: '8 vCPU', ram: '16 GB', storage: '320 GB SSD', price: '$80', bandwidth: '6 TB' },
            { name: 'Power Dedicated', cpu: '8 vCPU', ram: '32 GB', storage: '500 GB NVMe', price: '$160', bandwidth: '7 TB' },
          ].map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'rounded-2xl border p-6 bg-fd-card transition-all duration-300 hover:border-brand/30',
                plan.popular && 'border-brand/50 shadow-lg shadow-brand/10 ring-1 ring-brand/20',
              )}
            >
              {plan.popular && (
                <span className="inline-block text-xs font-medium text-brand bg-brand/10 rounded-full px-3 py-1 mb-3">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-fd-muted-foreground text-sm">/mo</span>
              </div>
              <div className="space-y-2 text-sm text-fd-muted-foreground">
                <p>{plan.cpu}</p>
                <p>{plan.ram} RAM</p>
                <p>{plan.storage}</p>
                <p>{plan.bandwidth} Transfer</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-fd-muted-foreground mt-6">
          GPU instances and custom configurations available.{' '}
          <Link href="/docs/pricing/compute" className="text-brand hover:underline">
            View full pricing
          </Link>
        </p>
      </div>

      {/* CTA */}
      <div className="mt-20 px-6 mx-auto w-full max-w-[1400px] md:px-12">
        <div className={cn(cardVariants(), 'text-center py-16')}>
          <h2 className={cn(headingVariants({ variant: 'h2', className: 'mb-4' }))}>
            Ready to Deploy?
          </h2>
          <p className="text-fd-muted-foreground mb-8 max-w-2xl mx-auto">
            Start deploying in minutes. Connect your cluster or launch a new one.
            No credit card required for the free tier.
          </p>
          <div className="flex flex-row items-center justify-center gap-4">
            <a href="https://app.platform.hanzo.ai" className={cn(buttonVariants())}>
              Get Started Free
              <ArrowRightIcon className="size-4" />
            </a>
            <Link href="/docs" className={cn(buttonVariants({ variant: 'secondary' }))}>
              Read the Docs
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
