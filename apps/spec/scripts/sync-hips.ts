/**
 * Sync HIPs from the canonical hanzoai/hips repo into this app's content/docs.
 *
 * Single source of truth: hanzoai/hips. This app RENDERS them — it never owns
 * or hand-edits HIP text. The synced files are generated; do not edit them here.
 *
 * Source resolution (first that exists wins):
 *   1. $HIPS_REPO_DIR                      (explicit override)
 *   2. ../../../hips/HIPs                   (sibling checkout in the workspace)
 *   3. shallow git clone of hanzoai/hips    (CI / clean builds)
 */
import { execSync } from 'node:child_process'
import {
  existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync, mkdirSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'content', 'docs')

function resolveHipsDir(): { dir: string; cleanup?: () => void } {
  const candidates = [
    process.env.HIPS_REPO_DIR,
    join(__dirname, '..', '..', '..', '..', 'hips', 'HIPs'),
  ].filter(Boolean) as string[]
  for (const dir of candidates) if (existsSync(dir)) return { dir }

  const tmp = mkdtempSync(join(tmpdir(), 'hips-'))
  execSync(`git clone --depth 1 https://github.com/hanzoai/hips.git ${tmp}`, { stdio: 'inherit' })
  return { dir: join(tmp, 'HIPs'), cleanup: () => rmSync(tmp, { recursive: true, force: true }) }
}

function parseFrontmatter(raw: string): { fm: Record<string, string>; body: string } {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!m) return { fm: {}, body: raw }
  const fm: Record<string, string> = {}
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':')
    if (i > 0) fm[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '')
  }
  return { fm, body: m[2] }
}

const esc = (s: string) => s.replace(/"/g, '\\"')

function main() {
  const { dir, cleanup } = resolveHipsDir()
  mkdirSync(OUT, { recursive: true })

  const files = readdirSync(dir).filter((f) => /^hip-\d+.*\.mdx?$/.test(f)).sort()
  const entries: { num: number; slug: string; title: string; status: string }[] = []

  for (const file of files) {
    const { fm, body } = parseFrontmatter(readFileSync(join(dir, file), 'utf8'))
    const num = parseInt(fm.hip ?? file.match(/\d+/)?.[0] ?? '0', 10)
    const title = fm.title ?? file
    const status = fm.status ?? 'Draft'
    const slug = file.replace(/\.mdx?$/, '')
    const desc = [fm.type, fm.category, status].filter(Boolean).join(' · ')

    // Hanzo Docs frontmatter (title + description); HIP metadata preserved as a lede.
    const out = `---
title: "HIP-${num}: ${esc(title)}"
description: "${esc(desc)}"
---

${body.replace(/^#\s+HIP-?\d+[:\s].*\n/, '').trimStart()}
`
    writeFileSync(join(OUT, `${slug}.mdx`), out)
    entries.push({ num, slug, title, status })
  }

  entries.sort((a, b) => a.num - b.num)
  writeFileSync(
    join(OUT, 'meta.json'),
    JSON.stringify({ title: 'HIPs', pages: ['index', ...entries.map((e) => e.slug)] }, null, 2),
  )

  // Landing index listing every HIP.
  const rows = entries
    .map((e) => `| [HIP-${e.num}](/docs/${e.slug}) | ${esc(e.title)} | ${e.status} |`)
    .join('\n')
  writeFileSync(
    join(OUT, 'index.mdx'),
    `---
title: Hanzo Standards (HIPs)
description: Canonical Hanzo Improvement Proposals, synced from hanzoai/hips.
index: true
---

These are the Hanzo Improvement Proposals — the binding standards for the Hanzo,
Lux, and Zoo ecosystems. They are synced verbatim from the canonical
[hanzoai/hips](https://github.com/hanzoai/hips) repository; this site renders
them, it does not own them.

| HIP | Title | Status |
|-----|-------|--------|
${rows}
`,
  )

  cleanup?.()
  console.log(`Synced ${entries.length} HIPs → content/docs`)
}

main()
