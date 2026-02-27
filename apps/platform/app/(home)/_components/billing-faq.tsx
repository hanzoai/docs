const billingFaqs = [
  {
    q: 'What is included in each VM plan?',
    a: 'Each plan includes dedicated vCPU, RAM, SSD storage, and bandwidth as listed. All plans include root SSH access, a browser-based terminal, automated backups, and monitoring. You can run any Linux workload — Docker, Kubernetes, databases, web servers, AI models, etc.',
  },
  {
    q: 'What is the difference between shared and dedicated vCPU?',
    a: 'Shared vCPU plans share underlying physical CPU cores with other tenants — ideal for bursty workloads like web apps and APIs. Dedicated vCPU plans (Premium and Power) give you guaranteed CPU time with no contention — essential for sustained compute like model training, CI/CD, and database servers.',
  },
  {
    q: 'How does Kubernetes pod pricing work?',
    a: 'You pay $0.005/hr per vCPU allocated to your pods. Memory and storage are billed separately. Bring your own cluster or provision one through Hanzo Platform. We support managed K8s on DigitalOcean, AWS, and Hetzner, plus bare-metal clusters.',
  },
  {
    q: 'How does AI model pricing work?',
    a: 'AI models are priced per million tokens (input and output separately). Open-source models like Zen 1B are free. Larger models like Zen 7B, Claude Sonnet, and GPT-4o are billed at listed rates. You can also bring your own API keys and skip our token pricing entirely.',
  },
  {
    q: 'Can I scale up or down at any time?',
    a: 'Yes. Resize your VM, add or remove Kubernetes nodes, or change plans at any time from the dashboard at app.platform.hanzo.ai. Changes take effect immediately and billing is prorated.',
  },
  {
    q: 'Is there a free tier?',
    a: 'The Zen 1B AI model is free to use with no limits. For compute, new accounts get a 14-day free trial on the Nano plan. No credit card required to start.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept credit and debit cards (Visa, Mastercard, Amex, Discover) processed via Square. We also natively accept cryptocurrency payments (BTC, ETH, SOL, USDC) — crypto credits are applied instantly. Bank and wire transfers are available for larger amounts. All payments are handled by Hanzo Commerce.',
  },
  {
    q: 'Do you offer enterprise pricing?',
    a: 'Yes. For teams needing custom deployments, dedicated infrastructure, SLAs, volume discounts, or private cloud, contact us at team@hanzo.ai. We support hybrid deployments across multiple providers and regions.',
  },
  {
    q: 'Can I bring my own infrastructure?',
    a: 'Absolutely. Hanzo Platform can manage clusters and VMs you already own. Register existing Kubernetes clusters, Docker Swarm nodes, or bare VMs. You only pay for the platform management — no markup on your infrastructure costs.',
  },
  {
    q: 'How does billing work for containers?',
    a: 'Docker containers are billed at $0.003/hr per container while running. Stopped containers are not billed. Kubernetes pods are billed by vCPU allocation. Storage is always billed at $0.10/GB/mo regardless of container state.',
  },
];

export function BillingFaq() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-fd-foreground mb-8 text-center">
        Billing FAQ
      </h2>
      <div className="flex flex-col gap-4">
        {billingFaqs.map((faq) => (
          <details
            key={faq.q}
            className="group p-5 rounded-xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm transition-all hover:border-brand"
          >
            <summary className="text-sm font-semibold text-fd-foreground cursor-pointer list-none flex items-center justify-between gap-3">
              {faq.q}
              <span className="text-brand transition-transform group-open:rotate-45 text-lg shrink-0">+</span>
            </summary>
            <p className="mt-3 text-sm text-fd-muted-foreground leading-relaxed">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
