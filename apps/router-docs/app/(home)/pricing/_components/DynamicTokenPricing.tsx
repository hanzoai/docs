'use client'

import { useEffect, useState } from 'react'
import { SparklesIcon } from 'lucide-react'

const PRICING_API = 'https://pricing.hanzo.ai/v1/pricing'

interface ModelPricing {
  name: string
  pricing: { input: number | null; output: number | null } | null
}

interface ThirdPartyModel {
  name: string
  pricing: { input: number; output: number }
}

interface PricingData {
  hanzoModels: ModelPricing[]
  thirdPartyModels?: ThirdPartyModel[]
}

/**
 * Converts $/1M tokens to $/1K tokens for display.
 */
function perMToPerK(perM: number): string {
  const perK = perM / 1000
  if (perK >= 0.01) return `$${perK.toFixed(2)}/1K`
  if (perK >= 0.001) return `$${perK.toFixed(3)}/1K`
  return `$${perK.toFixed(4)}/1K`
}

export function DynamicTokenPricing() {
  const [data, setData] = useState<PricingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(PRICING_API)
      .then((r) => { if (!r.ok) throw new Error(); return r.json() })
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Find representative models for the 3 tiers
  let gpt5Price = '$0.03/1K'
  let claudePrice = '$0.025/1K'
  let openSourcePrice = '$0.002/1K'

  if (data) {
    const gpt5 = data.thirdPartyModels?.find((m) => m.name === 'GPT-5')
    if (gpt5) {
      // Average of input + output per 1K
      const avg = (gpt5.pricing.input + gpt5.pricing.output) / 2
      gpt5Price = perMToPerK(avg)
    }

    const claude = data.thirdPartyModels?.find((m) => m.name === 'Claude Opus 4.6')
    if (claude) {
      // Use input price as representative
      claudePrice = perMToPerK(claude.pricing.input)
    }

    // Open source = zen4-mini (cheapest Zen model)
    const mini = data.hanzoModels.find((m) => m.name === 'zen4-mini')
    if (mini?.pricing) {
      const avg = ((mini.pricing.input ?? 0) + (mini.pricing.output ?? 0)) / 2
      openSourcePrice = perMToPerK(avg)
    }
  }

  return (
    <div className="p-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        <SparklesIcon className="w-5 h-5 text-brand" />
        <h3 className="text-sm font-bold text-fd-foreground">Tokens</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-fd-muted-foreground">GPT-5</span>
          <span className="text-fd-foreground font-semibold">{loading ? '...' : gpt5Price}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-fd-muted-foreground">Claude Opus</span>
          <span className="text-fd-foreground font-semibold">{loading ? '...' : claudePrice}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-fd-muted-foreground">Open source</span>
          <span className="text-fd-foreground font-semibold">{loading ? '...' : openSourcePrice}</span>
        </div>
      </div>
      <p className="mt-3 text-xs text-fd-muted-foreground/70">
        Or bring your own API keys for $0 token cost.
      </p>
    </div>
  )
}
