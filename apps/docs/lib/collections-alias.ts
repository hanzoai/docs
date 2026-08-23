import { fileURLToPath } from 'node:url';

// The virtual content-collection modules `@hanzo/docs-mdx` generates into
// ./.docs, named once so every bundler that must resolve them reads one list.
//
// Stating it twice is what made `pnpm lint` unrunnable: the alias lived only in
// next.config.ts, so lint died at `Cannot find module 'collections/server'`
// before reading a single page — a check that could never run, and so never
// reported that it wasn't running.
//
// TWO PROJECTIONS, because the bundlers disagree about the target and each
// fails on the other's form. Turbopack resolves an alias value against the
// project root and prepends `./`, so an absolute path becomes
// `./home/z/...` and every route 500s. Rolldown rejects a relative target
// outright. One list, projected twice, is the only way both are right.
const modules = ['server', 'browser', 'dynamic'];

const map = (target: (m: string) => string) =>
  Object.fromEntries(
    modules.flatMap((m) => [
      [`collections/${m}`, target(m)],
      [`@hanzo/mdx:collections/${m}`, target(m)],
    ]),
  );

/** Relative to the app root — what Turbopack's `resolveAlias` expects. */
export const collectionsAlias = map((m) => `./.docs/${m}.ts`);

/** Absolute, resolved from this file rather than the working directory — what
 *  rolldown expects, and independent of where a command is run from. */
export const collectionsAliasAbsolute = map((m) =>
  fileURLToPath(new URL(`../.docs/${m}.ts`, import.meta.url)),
);
