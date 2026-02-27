/**
 * Base pricing — syncs from pricing.hanzo.ai with static fallback.
 *
 * Each Base instance runs on a compute node. Pricing maps 1:1 to
 * Hanzo PaaS cloud VM tiers (DO infra + 20% markup).
 */

export interface ComputePlan {
  id: string
  name: string
  vcpus: number
  memoryGB: number
  diskGB: number
  cpuType: string
  transferTB: number
  priceMonthly: number
  priceHourly: number
  features: string[]
  popular?: boolean
  freeTier?: boolean
}

/**
 * Static fallback — must match canonical values from
 * platform/pkg/platform/src/billing/pricing.ts and
 * paas/apps/web/app/api/v1/pricing/cloud/plans/route.ts
 */
export const COMPUTE_PLANS: ComputePlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    vcpus: 1,
    memoryGB: 1,
    diskGB: 25,
    cpuType: 'Shared',
    transferTB: 1,
    priceMonthly: 6,
    priceHourly: 0.009,
    freeTier: true,
    features: [
      '1 Base instance',
      'SSE realtime',
      'Email/password auth',
      '$5 free credit',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    vcpus: 1,
    memoryGB: 2,
    diskGB: 50,
    cpuType: 'Shared',
    transferTB: 2,
    priceMonthly: 14,
    priceHourly: 0.021,
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
    cpuType: 'Shared',
    transferTB: 4,
    priceMonthly: 29,
    priceHourly: 0.043,
    popular: true,
    features: [
      '10 Base instances',
      'WebSocket + CRDT',
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
    cpuType: 'Shared',
    transferTB: 5,
    priceMonthly: 58,
    priceHourly: 0.086,
    features: [
      '20 Base instances',
      'Multi-tenant platform',
      'Scheduled functions',
      'Priority support',
    ],
  },
  {
    id: 'pro',
    name: 'Professional',
    vcpus: 8,
    memoryGB: 16,
    diskGB: 320,
    cpuType: 'AMD',
    transferTB: 6,
    priceMonthly: 115,
    priceHourly: 0.171,
    features: [
      '50 Base instances',
      'Dedicated AMD vCPUs',
      'Auto-scaling',
      '99.99% SLA',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    vcpus: 16,
    memoryGB: 32,
    diskGB: 500,
    cpuType: 'Intel Dedicated',
    transferTB: 8,
    priceMonthly: 384,
    priceHourly: 0.571,
    features: [
      'Unlimited instances',
      'Dedicated Intel vCPUs',
      'Custom networking',
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
      cpuType: p.cpuType ?? 'Shared',
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
