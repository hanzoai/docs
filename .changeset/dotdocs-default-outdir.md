---
"fumadocs-mdx": patch
---

Default `outDir` is now `.docs` (was `docs`), matching the `collections/*` → `./.docs/*` tsconfig alias used by every template and example. This makes a fresh fork resolve `import { docs } from 'collections/server'` out of the box with no `createMDX({ outDir })` override.
