/**
 * Base pricing — syncs from pricing.hanzo.ai with static fallback.
 *
 * Each Base instance runs on a compute node. Pricing maps 1:1 to
 * Hanzo cloud VM tiers (same as platform.hanzo.ai and visor.hanzo.ai).
 */

export interface ComputePlan {
  id: string
  name: string
  vcpus: number
  memoryGB: number
  diskGB: number
  cpuType: 'shared' | 'dedicated'
  transferTB: number
  priceMonthly: number
  priceHourly: number
  features: string[]
  popular?: boolean
  freeTier?: boolean
}

/**
 * Static fallback — matches canonical marketing tiers used across
 * platform.hanzo.ai, visor.hanzo.ai, and base.hanzo.ai.
 */
export const COMPUTE_PLANS: ComputePlan[] = [
  {
    id: 'nano',
    name: 'Nano',
    vcpus: 1,
    memoryGB: 1,
    diskGB: 25,
    cpuType: 'shared',
    transferTB: 1,
    priceMonthly: 5,
    priceHourly: 0.007,
    freeTier: true,
    features: [
      '1 Base instance',
      'SSE realtime',
      'Email/password auth',
      '$5 free credit',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    vcpus: 1,
    memoryGB: 2,
    diskGB: 50,
    cpuType: 'shared',
    transferTB: 2,
    priceMonthly: 6,
    priceHourly: 0.009,
    features: [
      '3 Base instances',
      'SSE + WebSocket',
      'OAuth2 auth',
      'S3 file storage',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    vcpus: 2,
    memoryGB: 4,
    diskGB: 80,
    cpuType: 'shared',
    transferTB: 4,
    priceMonthly: 12,
    priceHourly: 0.018,
    popular: true,
    features: [
      '10 Base instances',
      'WebSocket + CRDT sync',
      'IAM + OAuth2',
      'Automated backups',
    ],
  },
  {
    id: 'performance',
    name: 'Performance',
    vcpus: 4,
    memoryGB: 8,
    diskGB: 160,
    cpuType: 'shared',
    transferTB: 5,
    priceMonthly: 24,
    priceHourly: 0.036,
    features: [
      '20 Base instances',
      'Multi-tenant platform',
      'Scheduled functions',
      'Priority support',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    vcpus: 4,
    memoryGB: 8,
    diskGB: 200,
    cpuType: 'dedicated',
    transferTB: 6,
    priceMonthly: 36,
    priceHourly: 0.054,
    features: [
      '50 Base instances',
      'Dedicated vCPUs',
      'Auto-scaling',
      'Point-in-time restore',
    ],
  },
  {
    id: 'power',
    name: 'Power',
    vcpus: 4,
    memoryGB: 16,
    diskGB: 320,
    cpuType: 'dedicated',
    transferTB: 7,
    priceMonthly: 49,
    priceHourly: 0.073,
    features: [
      'Unlimited instances',
      'Dedicated vCPUs',
      'Private networking',
      'Dedicated support',
    ],
  },
]

const PRICING_API =
  process.env.NEXT_PUBLIC_PRICING_API_URL ||
  'https://pricing.hanzo.ai/v1/pricing/cloud/plans'

/**
 * Fetch live pricing from the Hanzo pricing API.
 * Falls back to COMPUTE_PLANS on failure.
 */
export async function fetchComputePlans(): Promise<ComputePlan[]> {
  try {
    const res = await fetch(PRICING_API, {
      signal: AbortSignal.timeout(3_000),
    })
    if (!res.ok) throw new Error(`${res.status}`)

    const data = await res.json()
    const plans = data.plans ?? data

    if (!Array.isArray(plans) || plans.length === 0) {
      return COMPUTE_PLANS
    }

    return plans.map((p: any) => ({
      id: p.id,
      name: p.name,
      vcpus: p.vcpus ?? p.vCPUs ?? 1,
      memoryGB: p.memoryGB ?? p.memory_gb ?? 1,
      diskGB: p.diskGB ?? p.disk_gb ?? 25,
      cpuType: p.cpuType ?? 'shared',
      transferTB: p.transferTB ?? 1,
      priceMonthly: p.priceMonthly ?? p.price_monthly ?? 0,
      priceHourly: p.priceHourly ?? p.price_hourly ?? 0,
      features: p.features ?? [],
      popular: p.popular ?? false,
      freeTier: p.freeTier ?? false,
    }))
  } catch {
    return COMPUTE_PLANS
  }
}
