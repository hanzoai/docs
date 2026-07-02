/**
 * Generate `content/docs/services/meta.json` FROM the shared `@hanzo/products`
 * catalog, so docs' "All Services" taxonomy is DERIVED, never hand-maintained.
 *
 * ONE source of truth (the commerce-backed catalog, via @hanzo/products' snapshot),
 * ONE generator, checked in. The nav groups every EXISTING docs page under the 10
 * canonical console categories (the reconciled taxonomy). Docs-only pages (real MDX
 * that back no catalog product) are preserved under a trailing "More" group, so
 * nothing already documented is orphaned, and no nav entry ever points at a page
 * that does not exist.
 *
 * Wired into `build:pre`. Guarded: if `@hanzo/products` is not yet installed it
 * keeps the committed meta.json and exits 0 — it never breaks the build.
 *
 * Run manually:  bun ./scripts/gen-services-nav.ts   (or `pnpm gen:services`)
 */
import { readdirSync, statSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const here = dirname(fileURLToPath(import.meta.url))
const servicesDir = join(here, "..", "content", "docs", "services")

let products: typeof import("@hanzo/products")
try {
  products = await import("@hanzo/products")
} catch {
  console.warn("[gen-services-nav] @hanzo/products not installed — keeping committed meta.json")
  process.exit(0)
}
const { SNAPSHOT, docsServicesMeta, docsCoverage } = products

// Existing docs slugs = top-level *.mdx (minus the index landing) + nested service dirs.
const existing: string[] = []
for (const name of readdirSync(servicesDir)) {
  const st = statSync(join(servicesDir, name))
  if (st.isDirectory()) existing.push(name)
  else if (name.endsWith(".mdx") && name !== "index.mdx") existing.push(name.replace(/\.mdx$/, ""))
}

const coverage = docsCoverage(SNAPSHOT, existing)
const meta = docsServicesMeta(SNAPSHOT, {
  existingSlugs: existing, // list only pages that exist — never a broken nav link
  extraSlugs: coverage.extra.slice().sort(), // preserve docs-only pages under "More"
})

writeFileSync(join(servicesDir, "meta.json"), JSON.stringify(meta, null, 2) + "\n")

const groups = meta.pages.filter((p) => p.startsWith("---")).length
const navPages = meta.pages.filter((p) => !p.startsWith("---")).length
console.log(`[gen-services-nav] meta.json: ${navPages} nav pages across ${groups} groups (${SNAPSHOT.length} catalog products)`)

if (coverage.missing.length) {
  console.log(`[gen-services-nav] ${coverage.missing.length} catalog products have NO docs page yet:`)
  const byCat: Record<string, string[]> = {}
  for (const m of coverage.missing) (byCat[m.category] ??= []).push(m.docsSlug)
  for (const [c, s] of Object.entries(byCat)) console.log(`   ${c}: ${s.join(", ")}`)
}
