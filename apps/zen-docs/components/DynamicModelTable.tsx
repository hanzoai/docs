'use client'

import { useEffect, useState } from 'react'

const PRICING_API = 'https://pricing.hanzo.ai/v1/pricing'

interface ModelPricing {
  name: string
  tier?: string
  context?: number | null
  specs?: { params?: string; arch?: string }
  pricing: {
    input: number | null
    output: number | null
  } | null
}

interface PricingData {
  hanzoModels: ModelPricing[]
}

function fmtPrice(p: number | null | undefined): string {
  if (p == null) return '--'
  if (p >= 1) return `$${p.toFixed(2)}`
  if (p >= 0.01) return `$${p.toFixed(2)}`
  return `$${p.toFixed(p >= 0.001 ? 3 : 4)}`
}

function fmtCtx(ctx: number | null | undefined): string {
  if (!ctx) return '--'
  if (ctx >= 1_000_000) return `${Math.round(ctx / 1000)}K`
  if (ctx >= 1000) return `${Math.round(ctx / 1000)}K`
  return `${ctx}`
}

/**
 * Renders a dynamically-fetched pricing table for Zen models.
 *
 * Props:
 *   generation - "zen4" | "zen3" | "all" (default "all")
 *   showArch   - show Architecture column (default false)
 *   showContext - show Context column (default true)
 *   showTier   - show Tier column (default false)
 *   showParams - show Parameters column (default false)
 *   linkPrefix - base path for model links (default "/docs/models/")
 *   compact    - fewer columns for index pages
 */
export function DynamicModelTable({
  generation = 'all',
  showArch = false,
  showContext = true,
  showTier = false,
  showParams = false,
  linkPrefix = '/docs/models/',
  compact = false,
}: {
  generation?: 'zen4' | 'zen3' | 'all'
  showArch?: boolean
  showContext?: boolean
  showTier?: boolean
  showParams?: boolean
  linkPrefix?: string
  compact?: boolean
}) {
  const [data, setData] = useState<PricingData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(PRICING_API)
      .then((r) => { if (!r.ok) throw new Error(); return r.json() })
      .then(setData)
      .catch(() => setError(true))
  }, [])

  if (error) {
    return (
      <p className="text-sm text-fd-muted-foreground py-4">
        Unable to load live pricing. See <a href="/docs/api/pricing" className="text-fd-primary hover:underline">pricing docs</a> for current rates.
      </p>
    )
  }

  if (!data) {
    return <p className="text-sm text-fd-muted-foreground py-4">Loading pricing...</p>
  }

  let models = data.hanzoModels.filter((m) => m.pricing && !m.pricing.input === false)
  if (generation === 'zen4') {
    models = models.filter((m) => m.name.startsWith('zen4'))
  } else if (generation === 'zen3') {
    models = models.filter((m) => m.name.startsWith('zen3'))
  }

  if (compact) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-fd-border text-left">
              <th className="pb-2 pr-4 font-medium">Model</th>
              {showArch && <th className="pb-2 pr-4 font-medium">Architecture</th>}
              <th className="pb-2 pr-4 font-medium text-right">Input $/1M</th>
              <th className="pb-2 font-medium text-right">Output $/1M</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fd-border">
            {models.map((m) => (
              <tr key={m.name}>
                <td className="py-2 pr-4 font-mono text-sm">{m.name}</td>
                {showArch && <td className="py-2 pr-4 text-sm text-fd-muted-foreground">{m.specs?.arch}</td>}
                <td className="py-2 pr-4 text-sm text-right font-mono">{fmtPrice(m.pricing?.input)}</td>
                <td className="py-2 text-sm text-right font-mono">{fmtPrice(m.pricing?.output)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-fd-border text-left">
            <th className="pb-2 pr-4 font-medium">Model</th>
            {showParams && <th className="pb-2 pr-4 font-medium">Parameters</th>}
            {showArch && <th className="pb-2 pr-4 font-medium">Architecture</th>}
            {showContext && <th className="pb-2 pr-4 font-medium">Context</th>}
            {showTier && <th className="pb-2 pr-4 font-medium">Tier</th>}
            <th className="pb-2 pr-4 font-medium text-right">Input $/1M</th>
            <th className="pb-2 font-medium text-right">Output $/1M</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-fd-border">
          {models.map((m) => (
            <tr key={m.name}>
              <td className="py-2 pr-4">
                <a href={`${linkPrefix}${m.name}`} className="font-mono text-fd-primary hover:underline text-sm">
                  {m.name}
                </a>
              </td>
              {showParams && (
                <td className="py-2 pr-4 text-sm text-fd-muted-foreground">
                  {m.specs?.params}
                </td>
              )}
              {showArch && (
                <td className="py-2 pr-4 text-sm text-fd-muted-foreground">
                  {m.specs?.arch}
                </td>
              )}
              {showContext && (
                <td className="py-2 pr-4 text-sm text-fd-muted-foreground">
                  {fmtCtx(m.context)}
                </td>
              )}
              {showTier && (
                <td className="py-2 pr-4 text-sm text-fd-muted-foreground">
                  {m.tier}
                </td>
              )}
              <td className="py-2 pr-4 text-sm text-right font-mono">{fmtPrice(m.pricing?.input)}</td>
              <td className="py-2 text-sm text-right font-mono">{fmtPrice(m.pricing?.output)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * Cost examples calculated from live pricing data.
 */
export function DynamicCostExamples() {
  const [data, setData] = useState<PricingData | null>(null)

  useEffect(() => {
    fetch(PRICING_API)
      .then((r) => { if (!r.ok) throw new Error(); return r.json() })
      .then(setData)
      .catch(() => {})
  }, [])

  if (!data) return null

  const find = (name: string) => data.hanzoModels.find((m) => m.name === name)
  const mini = find('zen4-mini')
  const coderFlash = find('zen4-coder-flash')
  const embed = find('zen3-embedding')
  const flagship = find('zen4')
  const vl = find('zen3-vl')

  const examples = [
    mini && { task: '100 chat messages', model: 'zen4-mini', tokens: '50K in + 50K out', cost: ((mini.pricing?.input ?? 0) * 0.05 + (mini.pricing?.output ?? 0) * 0.05) },
    coderFlash && { task: '1,000 code completions', model: 'zen4-coder-flash', tokens: '500K in + 500K out', cost: ((coderFlash.pricing?.input ?? 0) * 0.5 + (coderFlash.pricing?.output ?? 0) * 0.5) },
    embed && { task: '10K embeddings', model: 'zen3-embedding', tokens: '1M in', cost: (embed.pricing?.input ?? 0) },
    flagship && { task: 'Heavy daily usage', model: 'zen4', tokens: '1M in + 1M out', cost: ((flagship.pricing?.input ?? 0) + (flagship.pricing?.output ?? 0)) },
    vl && { task: 'Vision analysis (1K images)', model: 'zen3-vl', tokens: '500K in + 200K out', cost: ((vl.pricing?.input ?? 0) * 0.5 + (vl.pricing?.output ?? 0) * 0.2) },
  ].filter(Boolean) as Array<{ task: string; model: string; tokens: string; cost: number }>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-fd-border text-left">
            <th className="pb-2 pr-4 font-medium">Task</th>
            <th className="pb-2 pr-4 font-medium">Model</th>
            <th className="pb-2 pr-4 font-medium">~Tokens</th>
            <th className="pb-2 font-medium text-right">~Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-fd-border">
          {examples.map((ex) => (
            <tr key={ex.task}>
              <td className="py-2 pr-4 text-fd-muted-foreground">{ex.task}</td>
              <td className="py-2 pr-4 font-mono">{ex.model}</td>
              <td className="py-2 pr-4 text-fd-muted-foreground">{ex.tokens}</td>
              <td className="py-2 text-right font-mono">${ex.cost.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
