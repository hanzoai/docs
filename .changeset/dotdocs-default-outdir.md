---
"fumadocs-mdx": minor
"@fumadocs/content": minor
---

Two brand-neutral / zero-config fixes:

- **Default `outDir` is now `.docs`** (was `docs`), matching the `collections/*` → `./.docs/*` tsconfig alias used by every template and example. A fresh fork now resolves `import { docs } from 'collections/server'` out of the box with no `createMDX({ outDir })` override.
- **BREAKING: the doc-collection method `toFumadocsSource()` is renamed `toDocsSource()`** to keep the public API brand-neutral. Update `lib/source.ts`: `source: docs.toDocsSource()`.
