import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// EVERY PAGE IS IN THE SIDEBAR, AND EVERY SIDEBAR ENTRY IS A PAGE.
//
// Fumadocs routes a page whether or not any `meta.json` lists it. A section that
// nobody added to the root file still publishes, still answers, and is still
// indexed by search engines -- it is simply unreachable by navigation, and
// invisible to anything that walks the tree. That is not a hypothetical: two
// sections appeared during the rebuild that wrote this file, and the only
// symptom was their absence from a sidebar nobody was looking at.
//
// Two rules, and deliberately not the same rule at every level:
//
//   ROOT, both directions. Every section on disk is named by the root
//   `meta.json` and everything it names is there. A missing section is a whole
//   region of the site with no way in.
//
//   EVERYWHERE, one direction. No `meta.json` may name a page that is not there.
//   The reverse is NOT checked below the root, because a folder curating its own
//   list is a real editorial act: a capability folder holds one page plus up to
//   381 operations and lists only the first, since a sidebar folder with 381
//   entries is a tree nobody opens. Those pages are reached from the capability
//   page's own endpoint table, and `llms.txt` indexes them from the pages rather
//   than the tree, so nothing is lost by their absence from the sidebar.
//
// The root file has no `...` wildcard on purpose. A wildcard makes "everything
// routes" true by construction and "somebody decided where this goes" false, and
// the second is the property worth having.
//
// `projects/` is skipped: its meta files are ported from the upstream
// repositories along with the pages, the same exemption check-endpoints and
// check-keys make, for the same reason -- they are not ours to hold to our
// shape.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.resolve(SCRIPT_DIR, '../content/docs');

export interface Routes {
  checked: number;
  /** A top-level section on disk that the root meta.json does not name. */
  unlisted: string[];
  /** `<dir>/<name>` named by a meta.json, absent from disk. */
  dangling: string[];
}

/** What a meta.json names, with separators and external links dropped. */
function listed(dir: string): string[] | null {
  const file = path.join(dir, 'meta.json');
  if (!fs.existsSync(file)) return null;
  try {
    const pages = JSON.parse(fs.readFileSync(file, 'utf8'))?.pages;
    if (!Array.isArray(pages)) return null;
    return pages
      .filter((p: unknown): p is string => typeof p === 'string')
      .filter((p) => !p.startsWith('---') && !p.startsWith('[') && !p.includes('://'))
      .map((p) => p.replace(/^\.\//, ''));
  } catch {
    return null;
  }
}

/** Whether a directory holds any page at all, at any depth. */
function routes(dir: string): boolean {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isFile() && e.name.endsWith('.mdx')) return true;
    if (e.isDirectory() && routes(path.join(dir, e.name))) return true;
  }
  return false;
}

/**
 * What a folder actually holds: pages by basename, plus subdirectories that
 * hold a page.
 *
 * A directory with no page beneath it routes nothing, so there is nothing for a
 * sidebar to name -- and deleting a section leaves exactly that: empty parents
 * git does not remove because it only tracks files. Counting those as unlisted
 * asks someone to add a husk to the sidebar or notice it is a husk, which is a
 * question about the filesystem, not about the docs.
 */
function onDisk(dir: string): { names: string[]; dirs: string[] } {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return {
    names: entries
      .filter((e) => e.isFile() && e.name.endsWith('.mdx') && e.name !== 'index.mdx')
      .map((e) => e.name.slice(0, -4)),
    dirs: entries
      .filter((e) => e.isDirectory() && routes(path.join(dir, e.name)))
      .map((e) => e.name),
  };
}

export function checkRoutes(): Routes {
  const unlisted: string[] = [];
  const dangling: string[] = [];
  let checked = 0;

  const walk = (dir: string): void => {
    const meta = listed(dir);
    const { names, dirs } = onDisk(dir);
    const here = [...names, ...dirs];
    checked += here.length;

    // A folder with no meta.json states no order, which is a choice Fumadocs
    // reads as "alphabetical, everything" -- complete by default, so there is
    // nothing to check. Only a folder that DOES list its pages can leave one out.
    const rel = path.relative(CONTENT, dir);
    if (meta && !rel.startsWith('projects')) {
      if (dir === CONTENT) {
        const named = new Set(meta);
        for (const name of here) if (!named.has(name)) unlisted.push(name);
      }
      // Dangling is measured against what EXISTS, not against what routes. A
      // submodule that a checkout did not recurse into is an empty directory,
      // and the sidebar naming it is right -- the pages arrive with the
      // submodule. `export.require` is what proves those pages actually shipped.
      const have = new Set([
        ...here,
        ...fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name),
      ]);
      for (const name of meta) {
        if (name === 'index') continue;
        if (!have.has(name)) dangling.push(path.join(rel, name));
      }
    }
    for (const sub of dirs) walk(path.join(dir, sub));
  };

  walk(CONTENT);
  return { checked, unlisted: unlisted.sort(), dangling: dangling.sort() };
}

export function report(r: Routes): void {
  if (r.unlisted.length) {
    console.error(`   ${r.unlisted.length} top-level sections the root meta.json does not name:`);
    console.error(`     ${r.unlisted.slice(0, 20).join(', ')}`);
    console.error('     -> add each to content/docs/meta.json, or delete it');
  }
  if (r.dangling.length) {
    console.error(`   ${r.dangling.length} named by a meta.json and not on disk:`);
    console.error(`     ${r.dangling.slice(0, 20).join(', ')}`);
    console.error('     -> the sidebar points at a page that does not exist');
  }
}

if (import.meta.main) {
  const r = checkRoutes();
  report(r);
  console.log(`[routes] ${r.checked} entries, ${r.unlisted.length + r.dangling.length} disagreements`);
  process.exit(r.unlisted.length + r.dangling.length ? 1 : 0);
}
