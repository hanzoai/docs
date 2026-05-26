/**
 * @zenlm/models — Pricing configuration.
 *
 * Zen models are priced at a sustainable multiplier over inference cost.
 * Third-party models available via the Hanzo API are priced with standard markup.
 *
 * Live pricing fetched from pricing.hanzo.ai; static values are fallbacks only.
 */

/** Markup applied to third-party model pass-through pricing. */
export const MARKUP = 1.2

/** Multiplier applied to Zen model inference costs. */
export const ZEN_MULTIPLIER = 3

/** Tool pricing (per-unit costs). */
export const tools = [
  { name: 'Web Search', unit: 'per query', price: 0.005 },
  { name: 'Code Interpreter', unit: 'per session minute', price: 0.03 },
  { name: 'File Storage', unit: 'per GB/month', price: 0.2 },
  { name: 'Image Generation', unit: 'per image', price: 0.04 },
  { name: 'Speech-to-Text', unit: 'per minute', price: 0.006 },
  { name: 'Text-to-Speech', unit: 'per 1M characters', price: 15 },
] as const

/** Infrastructure compute tiers ($/mo). Syncs from pricing.hanzo.ai. */
export const compute = [
  { name: 'Nano', vcpus: 1, cpuType: 'shared', memory: '1 GB', storage: '25 GB', transfer: '1 TB', price: 5 },
  { name: 'Starter', vcpus: 1, cpuType: 'shared', memory: '2 GB', storage: '50 GB', transfer: '2 TB', price: 6 },
  { name: 'Standard', vcpus: 2, cpuType: 'shared', memory: '4 GB', storage: '80 GB', transfer: '4 TB', price: 12 },
  { name: 'Performance', vcpus: 4, cpuType: 'shared', memory: '8 GB', storage: '160 GB', transfer: '5 TB', price: 24 },
  { name: 'Premium', vcpus: 4, cpuType: 'dedicated', memory: '8 GB', storage: '200 GB', transfer: '6 TB', price: 36 },
  { name: 'Power', vcpus: 4, cpuType: 'dedicated', memory: '16 GB', storage: '320 GB', transfer: '7 TB', price: 49 },
] as const

/** GPU tiers. */
export const gpu = [
  { name: 'GPU Standard', gpu: '1x H100', vram: '80 GB', price: 3.48 },
  { name: 'GPU Pro', gpu: '2x H100', vram: '160 GB', price: 6.96 },
  { name: 'GPU Ultra', gpu: '4x H100', vram: '320 GB', price: 13.92 },
] as const

/** Third-party models available via Hanzo API (static fallback). */
export const thirdPartyModels = [
  {
    name: 'Claude Opus 4.6',
    openrouterId: 'anthropic/claude-opus-4.6',
    features: ['1000K context window', 'Most capable model'],
    contextWindow: 1_000_000,
    pricing: { input: 5, output: 25, cacheRead: 0.5, cacheWrite: 6.25 },
  },
  {
    name: 'Claude Sonnet 4.6',
    openrouterId: 'anthropic/claude-sonnet-4.6',
    features: ['1000K context window', 'Best balance of speed and intelligence'],
    contextWindow: 1_000_000,
    pricing: { input: 3, output: 15, cacheRead: 0.3, cacheWrite: 3.75 },
  },
  {
    name: 'Claude Haiku 4.5',
    openrouterId: 'anthropic/claude-haiku-4.5',
    features: ['200K context window', 'Fastest and most affordable'],
    contextWindow: 200_000,
    pricing: { input: 1, output: 5, cacheRead: 0.1, cacheWrite: 1.25 },
  },
  {
    name: 'GPT-5',
    openrouterId: 'openai/gpt-5',
    features: ['400K context window', 'OpenAI flagship'],
    contextWindow: 400_000,
    pricing: { input: 1.25, output: 10, cacheRead: 0.125, cacheWrite: null },
  },
  {
    name: 'GPT-5 Mini',
    openrouterId: 'openai/gpt-5-mini',
    features: ['400K context window', 'Fast and affordable'],
    contextWindow: 400_000,
    pricing: { input: 0.25, output: 2, cacheRead: 0.025, cacheWrite: null },
  },
  {
    name: 'DeepSeek R1',
    openrouterId: 'deepseek/deepseek-r1',
    features: ['64K context window', 'Reasoning model'],
    contextWindow: 64_000,
    pricing: { input: 0.7, output: 2.5, cacheRead: null, cacheWrite: null },
  },
  {
    name: 'DeepSeek V3',
    openrouterId: 'deepseek/deepseek-chat',
    features: ['164K context window', 'Fast and efficient'],
    contextWindow: 163_840,
    pricing: { input: 0.229, output: 0.914, cacheRead: null, cacheWrite: null },
  },
] as const

// ---------------------------------------------------------------------------
// Dynamic pricing fetch from pricing.hanzo.ai
// ---------------------------------------------------------------------------

const PRICING_API = 'https://pricing.hanzo.ai/v1/pricing'

export interface PricingApiModel {
  name: string
  fullName?: string
  description?: string
  features?: string[]
  tier?: string
  context?: number | null
  specs?: { params?: string; arch?: string }
  endpoint?: string
  pricingUnit?: string
  contactSales?: boolean
  pricing: {
    input: number | null
    output: number | null
    perUnit?: number
    cacheRead?: number | null
    cacheWrite?: number | null
  } | null
}

export interface PricingApiThirdParty {
  id: string
  name: string
  provider: string
  contextWindow?: number | null
  features?: string[]
  isFree?: boolean
  featured?: boolean
  pricing: {
    input: number
    output: number
    cacheRead?: number | null
    cacheWrite?: number | null
  }
}

export interface PricingData {
  updated?: string
  hanzoModels: PricingApiModel[]
  thirdPartyModels?: PricingApiThirdParty[]
  tools?: Array<{ name: string; unit: string; price: number }>
  infrastructure?: any
  cloud?: any
}

/**
 * Fetch live pricing from pricing.hanzo.ai.
 * Returns full pricing data including Zen models, third-party models, and tools.
 * Falls back to null on failure — callers should use static data as fallback.
 */
export async function fetchPricing(): Promise<PricingData | null> {
  try {
    const res = await fetch(PRICING_API, {
      signal: AbortSignal.timeout(3_000),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

/**
 * Fetch live model pricing from pricing.hanzo.ai/v1/pricing/models.
 * Returns array of all models (Zen + third-party) with pricing.
 * Falls back to null on failure.
 */
export async function fetchModelPricing(): Promise<Array<PricingApiModel | PricingApiThirdParty> | null> {
  try {
    const res = await fetch(`${PRICING_API.replace(/\/pricing$/, '')}/pricing/models`, {
      signal: AbortSignal.timeout(3_000),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.models ?? null
  } catch {
    return null
  }
}
