#!/usr/bin/env node
/**
 * sync-pricing.mjs — Fetch live pricing from pricing.hanzo.ai and patch
 * the static fallback values in models.ts and pricing.ts.
 *
 * Exit codes:
 *   0 — changes written
 *   1 — no changes (prices already match)
 *   2 — error (API down, parse failure, etc.)
 *
 * Usage:
 *   node packages/zen-models/scripts/sync-pricing.mjs
 *   node packages/zen-models/scripts/sync-pricing.mjs --dry-run
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC = resolve(__dirname, '..', 'src')
const MODELS_PATH = resolve(SRC, 'models.ts')
const PRICING_PATH = resolve(SRC, 'pricing.ts')
const PRICING_API = 'https://pricing.hanzo.ai/v1/pricing'
const DRY_RUN = process.argv.includes('--dry-run')

/** API model names that map to different source IDs. */
const ID_ALIASES = {
  'zen4.6': 'zen4.1',
}

/** Third-party API names that differ from pricing.ts names. */
const TP_NAME_ALIASES = {
  'R1': 'DeepSeek R1',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Strip provider prefix from third-party model name.
 * API returns "Anthropic: Claude Opus 4.6" → we need "Claude Opus 4.6".
 */
function stripProvider(name) {
  const idx = name.indexOf(': ')
  return idx !== -1 ? name.slice(idx + 2) : name
}

/** Format a number for TypeScript source (null → 'null'). */
function fmt(v) {
  if (v == null) return 'null'
  return String(v)
}

/**
 * In `source`, find `id: 'modelId'` then replace the nearest `pricing: { ... }`
 * within 800 chars. Returns updated source or null if no match.
 */
function patchModelPricing(source, modelId, pricing) {
  const idNeedle = `id: '${modelId}'`
  const idx = source.indexOf(idNeedle)
  if (idx === -1) return null

  // Search within a bounded window after the id match
  const windowStart = idx
  const windowEnd = Math.min(idx + 800, source.length)
  const window = source.slice(windowStart, windowEnd)

  // Match:  pricing: { input: X, output: Y, cacheRead: Z, cacheWrite: W }
  const pricingRe = /pricing:\s*\{[^}]*\}/
  const match = window.match(pricingRe)
  if (!match) return null

  const newPricing = `pricing: { input: ${fmt(pricing.input)}, output: ${fmt(pricing.output)}, cacheRead: ${fmt(pricing.cacheRead)}, cacheWrite: ${fmt(pricing.cacheWrite)} }`

  const absoluteStart = windowStart + match.index
  const absoluteEnd = absoluteStart + match[0].length

  return source.slice(0, absoluteStart) + newPricing + source.slice(absoluteEnd)
}

/**
 * In `source`, find `name: 'modelName'` inside the thirdPartyModels array,
 * then replace the nearest `pricing: { ... }` within 400 chars.
 */
function patchThirdPartyPricing(source, modelName, pricing) {
  const nameNeedle = `name: '${modelName}'`
  const idx = source.indexOf(nameNeedle)
  if (idx === -1) return null

  const windowStart = idx
  const windowEnd = Math.min(idx + 400, source.length)
  const window = source.slice(windowStart, windowEnd)

  const pricingRe = /pricing:\s*\{[^}]*\}/
  const match = window.match(pricingRe)
  if (!match) return null

  const newPricing = `pricing: { input: ${fmt(pricing.input)}, output: ${fmt(pricing.output)}, cacheRead: ${fmt(pricing.cacheRead)}, cacheWrite: ${fmt(pricing.cacheWrite)} }`

  const absoluteStart = windowStart + match.index
  const absoluteEnd = absoluteStart + match[0].length

  return source.slice(0, absoluteStart) + newPricing + source.slice(absoluteEnd)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // 1. Fetch live pricing
  console.log(`Fetching ${PRICING_API} ...`)
  let data
  try {
    const res = await fetch(PRICING_API, { signal: AbortSignal.timeout(10_000) })
    if (!res.ok) {
      console.error(`API returned ${res.status}`)
      process.exit(2)
    }
    data = await res.json()
  } catch (err) {
    console.error('Failed to fetch pricing API:', err.message)
    process.exit(2)
  }

  let modelsSource = readFileSync(MODELS_PATH, 'utf8')
  let pricingSource = readFileSync(PRICING_PATH, 'utf8')
  const origModels = modelsSource
  const origPricing = pricingSource

  // 2. Patch Zen models in models.ts
  const hanzoModels = data.hanzoModels ?? []
  let zenUpdated = 0
  for (const model of hanzoModels) {
    if (!model.pricing || model.pricing.input == null) continue

    const pricing = {
      input: model.pricing.input,
      output: model.pricing.output,
      cacheRead: model.pricing.cacheRead ?? null,
      cacheWrite: model.pricing.cacheWrite ?? null,
    }

    // Try API name first, then alias if defined
    const sourceId = ID_ALIASES[model.name] ?? model.name
    const result = patchModelPricing(modelsSource, sourceId, pricing)
    if (result && result !== modelsSource) {
      modelsSource = result
      zenUpdated++
      const alias = sourceId !== model.name ? ` (alias ${sourceId})` : ''
      console.log(`  ✓ ${model.name}${alias}: input=${pricing.input}, output=${pricing.output}`)
    } else if (!result) {
      // Only warn for models we'd expect to find (skip non-chat models silently)
      if (model.pricing.input != null && model.pricing.output != null) {
        console.log(`  · ${model.name}: not in models.ts (skipped)`)
      }
    }
  }
  console.log(`Zen models: ${zenUpdated} updated`)

  // 3. Patch third-party models in pricing.ts
  // Only attempt to match models that exist in our static fallback list
  const thirdPartyModels = data.thirdPartyModels ?? []
  let tpUpdated = 0
  for (const model of thirdPartyModels) {
    if (!model.pricing) continue

    const pricing = {
      input: model.pricing.input,
      output: model.pricing.output,
      cacheRead: model.pricing.cacheRead ?? null,
      cacheWrite: model.pricing.cacheWrite ?? null,
    }

    // Try full name, then stripped name, then alias
    const shortName = stripProvider(model.name)
    const aliasName = TP_NAME_ALIASES[shortName]
    let result = patchThirdPartyPricing(pricingSource, model.name, pricing)
    if (!result && shortName !== model.name) {
      result = patchThirdPartyPricing(pricingSource, shortName, pricing)
    }
    if (!result && aliasName) {
      result = patchThirdPartyPricing(pricingSource, aliasName, pricing)
    }

    if (result && result !== pricingSource) {
      pricingSource = result
      tpUpdated++
      const displayName = aliasName ?? shortName
      console.log(`  ✓ ${displayName}: input=${pricing.input}, output=${pricing.output}`)
    }
    // Silently skip models not in our curated list
  }
  console.log(`Third-party models: ${tpUpdated} updated`)

  // 4. Write if changed
  const modelsChanged = modelsSource !== origModels
  const pricingChanged = pricingSource !== origPricing

  if (!modelsChanged && !pricingChanged) {
    console.log('\nNo pricing changes detected.')
    process.exit(1)
  }

  if (DRY_RUN) {
    console.log('\n[dry-run] Would write changes to:')
    if (modelsChanged) console.log(`  ${MODELS_PATH}`)
    if (pricingChanged) console.log(`  ${PRICING_PATH}`)
    process.exit(0)
  }

  if (modelsChanged) writeFileSync(MODELS_PATH, modelsSource)
  if (pricingChanged) writeFileSync(PRICING_PATH, pricingSource)

  console.log(`\nWrote changes to ${[modelsChanged && 'models.ts', pricingChanged && 'pricing.ts'].filter(Boolean).join(', ')}`)
  process.exit(0)
}

main()
