import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOCUMENT, loadDocument } from './openapi-doc';
import { doors, domains } from './capabilities';

// THE THIRD GUARD: the set of capabilities is the same set everywhere.
//
// check-endpoints says no page may name a route the document does not serve.
// check-keys says no page may spell a credential cloud does not mint. This says
// the same kind of thing one level up: the CAPABILITIES the document serves, the
// capabilities the sidebar groups, and the capability pages on disk are one set,
// not three that happen to agree today.
//
// Checked BOTH WAYS on both joins, because each direction catches a different
// failure and neither implies the other:
//
//   • a capability the document serves with no page — a product ships and the
//     docs never mention it. This is what a derived-from-the-address product
//     rule was doing silently to 385 operations.
//   • a page for a capability the document does not serve — a rename in cloud
//     leaves the old page published, still reachable, still wrong. Nothing else
//     in the build would notice: the page compiles, the links resolve, and the
//     endpoints it names may even still exist under the new owner.
//
// So a rename in hanzoai/cloud turns THIS build red rather than publishing a
// stale page under a name nothing answers to.
//
// The fourth relation is NOT a failure, and saying why matters. A name the
// taxonomy groups that the document does not serve used to fail here, when both
// described the same 116 capabilities. They no longer do: `openapi.yaml` is the
// GA contract and drops everything below it (HIP-0139 §8.1 — a beta capability
// appears in no public page), while `capabilities.yaml` is stage-independent,
// because which DOMAIN a capability belongs to does not change when it ships.
// So the taxonomy is a superset by construction, and failing on the difference
// would mean every capability still in beta breaks the docs build. It is
// counted and printed instead.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const PAGES = path.join(APP_ROOT, 'content/docs/openapi');

export interface Result {
  /** How many capabilities are shipped: the document's tags plus `doors:`. */
  served: number;
  /** Served, but no page was generated for it. */
  unpaged: string[];
  /** A page exists, but the document serves no such capability. */
  orphaned: string[];
  /** Served, but `capabilities.yaml` files it under no domain. */
  ungrouped: string[];
  /** Grouped by `capabilities.yaml`, below GA, so this document does not serve
   *  it. Reported, never failed — see the note above. */
  belowGa: string[];
  /** `<page> -> /docs/openapi/<name>` where no such capability page exists. */
  dangling: string[];
}

/**
 * THE FOURTH JOIN: a link INTO the capability tree resolves to a page in it.
 *
 * The three joins above are about sets — served, grouped, paged. This is about
 * the sentences: an authored page saying "see [Storage](/docs/openapi/storage)"
 * is wrong the moment cloud renames the capability to `s3`, and nothing else in
 * the build can tell. check-routes reads `meta.json`, not prose. check-endpoints
 * reads `/v1/...` on `api.hanzo.ai`, not doc routes. So a rename left five dead
 * links across `architecture/`, `console.mdx` and `mission-control.mdx` —
 * `analytics`, `automations`, `storage`, `zt` — each rendering as a link a
 * reader clicks into a 404.
 *
 * It is the same failure the other three exist to prevent, one level down, and
 * it is caught the same way: by asking the tree rather than by remembering.
 */
function danglingLinks(onDisk: Set<string>): string[] {
  const CONTENT = path.join(APP_ROOT, 'content/docs');
  const out: string[] = [];
  const walk = (dir: string): void => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      // Ported upstream docs are mirrored, not ours to hold to our tree.
      if (e.isDirectory()) {
        if (e.name !== 'projects') walk(p);
      } else if (e.isFile() && /\.mdx?$/.test(e.name)) {
        let text: string;
        try {
          text = fs.readFileSync(p, 'utf8');
        } catch {
          continue; // a submodule left un-checked-out is a symlink to nothing
        }
        for (const m of text.matchAll(/\/docs\/openapi\/([a-z0-9][a-z0-9-]*)/g)) {
          if (!onDisk.has(m[1])) out.push(`${path.relative(CONTENT, p)} -> ${m[1]}`);
        }
      }
    }
  };
  walk(CONTENT);
  return [...new Set(out)].sort();
}

export function checkCapabilities(): Result {
  const doc = loadDocument(DOCUMENT);
  // The capability set is the document's tag set — the same value the pages are
  // keyed by, read from the same place, so the two cannot drift apart here.
  //
  // Plus the capabilities that answer somewhere other than `/v1`. A port, a
  // `/.well-known/` convention and a co-resident claim are not HTTP operations,
  // so no document can carry them; `capabilities.yaml`'s `doors:` names them,
  // and they are expected to have pages for exactly the same reason every other
  // GA capability is. Without this every one of them is `orphaned` — a page for
  // a name the document does not serve — which is the check telling the truth
  // about the wrong question.
  const off = doors();
  const served = new Set([...doc.products.map((p) => p.name), ...off.keys()]);

  const onDisk = new Set(
    fs.existsSync(PAGES)
      ? fs
          .readdirSync(PAGES, { withFileTypes: true })
          .filter((e) => e.isDirectory() && fs.existsSync(path.join(PAGES, e.name, 'index.mdx')))
          .map((e) => e.name)
      : [],
  );

  const grouped = new Set(domains().flatMap((d) => d.tags));

  return {
    served: served.size,
    unpaged: [...served].filter((c) => !onDisk.has(c)).sort(),
    orphaned: [...onDisk].filter((c) => !served.has(c)).sort(),
    ungrouped: [...served].filter((c) => !grouped.has(c)).sort(),
    belowGa: [...grouped].filter((c) => !served.has(c)).sort(),
    dangling: danglingLinks(onDisk),
  };
}

export function report(r: Result): void {
  const say = (label: string, names: string[], fix: string) => {
    if (!names.length) return;
    console.error(`   ${names.length} ${label}: ${names.join(', ')}`);
    console.error(`     -> ${fix}`);
  };
  say('capabilities are served but have no page', r.unpaged, 'the generator did not write one — a bug here');
  say(
    'capability pages name nothing the document serves',
    r.orphaned,
    'cloud renamed or retired the capability; the stale pages must go',
  );
  say(
    'capabilities are served but grouped under no domain',
    r.ungrouped,
    'place each one in openapi-specs/capabilities.yaml, and upstream in hanzoai/openapi',
  );
  say(
    'links point into the capability tree at a name that is not there',
    r.dangling,
    'cloud renamed the capability; repoint the link at the name it answers to now',
  );
}

if (import.meta.main) {
  const r = checkCapabilities();
  report(r);
  const bad = r.unpaged.length + r.orphaned.length + r.ungrouped.length + r.dangling.length;
  console.log(`[capabilities] ${r.served} served, ${bad} disagreements`);
  process.exit(bad ? 1 : 0);
}
