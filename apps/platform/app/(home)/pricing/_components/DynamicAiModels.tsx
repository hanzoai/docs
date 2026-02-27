'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

const PRICING_API = 'https://pricing.hanzo.ai/v1/pricing'

interface ModelPricing {
  name: string
  pricing: { input: number | null; output: number | null } | null
}

interface ThirdPartyModel {
  name: string
  featured?: boolean
  pricing: { input: number; output: number }
}

interface PricingData {
  hanzoModels: ModelPricing[]
  thirdPartyModels?: ThirdPartyModel[]
}

function fmtPrice(p: number | null | undefined): string {
  if (p == null) return '--'
  if (p >= 1) return `$${p.toFixed(2)}`
  return `$${p.toFixed(2)}`
}

/** Featured models to show on the platform pricing page */
const FEATURED = ['zen4-mini', 'zen4', 'zen4-coder', 'Claude Sonnet 4.6', 'GPT-5', 'DeepSeek R1']

export function DynamicAiModels() {
  const [data, setData] = useState<PricingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(PRICING_API)
      .then((r) => { if (!r.ok) throw new Error(); return r.json() })
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="overflow-x-auto rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm">
        <div className="p-8 text-center text-sm text-fd-muted-foreground">Loading model pricing...</div>
      </div>
    )
  }

  // Build the display list from live data or fall through to nothing
  const models: Array<{ name: string; input: string; output: string; free?: boolean }> = []

  if (data) {
    for (const name of FEATURED) {
      // Check Zen models first
      const zen = data.hanzoModels.find((m) => m.name === name)
      if (zen?.pricing) {
        models.push({
          name,
          input: fmtPrice(zen.pricing.input),
          output: fmtPrice(zen.pricing.output),
        })
        continue
      }
      // Check third-party models
      const tp = data.thirdPartyModels?.find((m) => m.name === name)
      if (tp) {
        models.push({
          name,
          input: fmtPrice(tp.pricing.input),
          output: fmtPrice(tp.pricing.output),
        })
      }
    }
  }

  if (models.length === 0) {
    return (
      <div className="overflow-x-auto rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm">
        <div className="p-8 text-center text-sm text-fd-muted-foreground">
          Model pricing available at{' '}
          <a href="https://zenlm.org/docs/api/pricing" className="text-brand hover:underline">zenlm.org</a>.
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-fd-border">
            <th className="text-left p-4 text-fd-foreground font-semibold">Model</th>
            <th className="p-4 text-right text-fd-foreground font-semibold">Input / 1M tokens</th>
            <th className="p-4 text-right text-fd-foreground font-semibold">Output / 1M tokens</th>
          </tr>
        </thead>
        <tbody>
          {models.map((model) => (
            <tr key={model.name} className="border-b border-fd-border/50 last:border-b-0 hover:bg-[rgba(255,255,255,0.02)]">
              <td className="p-4 text-fd-foreground font-medium">
                {model.name}
                {model.free && (
                  <span className="ml-2 text-xs font-bold text-brand-secondary bg-brand-secondary/10 rounded-full px-2 py-0.5">
                    Free
                  </span>
                )}
              </td>
              <td className={cn('p-4 text-right font-semibold', model.free ? 'text-brand-secondary' : 'text-fd-foreground')}>
                {model.input}
              </td>
              <td className={cn('p-4 text-right font-semibold', model.free ? 'text-brand-secondary' : 'text-fd-foreground')}>
                {model.output}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
