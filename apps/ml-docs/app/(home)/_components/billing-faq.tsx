const billingFaqs = [
  {
    q: 'Is Hanzo Bot really free?',
    a: 'Yes. The self-hosted version is 100% free and open source. You bring your own API keys for LLM providers (OpenAI, Anthropic, etc.) and run it on your own Mac, Windows, or Linux machine. No limits, no trials, no credit card.',
  },
  {
    q: 'What does the $5/mo Cloud plan include?',
    a: 'A full Linux desktop VM running in Hanzo Cloud with access to 100+ AI models via the Hanzo LLM Gateway. Your bot is always on, backed up daily, and accessible from any device. All chat integrations are included.',
  },
  {
    q: 'Why is Cloud Pro $25/mo?',
    a: 'Cloud Pro runs a full macOS or Windows VM, which requires significantly more resources than a Linux container. You also get priority model access, faster inference, advanced browser automation, and team collaboration features.',
  },
  {
    q: 'How does usage-based pricing work?',
    a: 'Cloud plans include generous free tiers for messages, tokens, and storage. Beyond those limits, you pay only for what you use. The first 1,000 messages/mo are free, then $0.001/message. Token costs vary by model. Storage is 1 GB free, then $0.10/GB/mo.',
  },
  {
    q: 'Can I use my own API keys with Cloud plans?',
    a: 'Yes! Cloud plans include access to 100+ models, but you can also bring your own API keys if you prefer. Mix and match freely. When using your own keys, you pay the provider directly and skip our token pricing.',
  },
  {
    q: 'How does the free trial work?',
    a: 'Cloud plans include a 14-day free trial. No credit card required to start. Your bot and all its data persist after the trial — just add a payment method to continue.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept credit and debit cards (Visa, Mastercard, Amex, Discover) processed via Square. We also natively accept cryptocurrency payments (BTC, ETH, SOL, USDC) — crypto credits are applied instantly. Wire transfers are available for larger amounts and processed within 1-2 business days. All payments are handled by Hanzo Commerce.',
  },
  {
    q: 'Can I run multiple bots?',
    a: 'Absolutely. Each bot is an independent instance with its own memory, personality, and configuration. Pricing is per bot. Most people start with one and add more as they find new use cases.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. Self-hosted bots keep all data on your machine. Cloud bots run in isolated VMs with encrypted storage. We never train on your data. Enterprise customers can use their own infrastructure.',
  },
  {
    q: 'Can I switch plans or cancel anytime?',
    a: 'Yes. Upgrade, downgrade, or cancel at any time from your dashboard at app.hanzo.bot. Changes take effect at the next billing cycle. No lock-in contracts.',
  },
  {
    q: 'Do you offer enterprise pricing?',
    a: 'Yes. For teams needing custom deployments, SLAs, dedicated infrastructure, or volume licensing, contact us at team@hanzo.ai.',
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
