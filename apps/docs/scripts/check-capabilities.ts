import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOCUMENT, loadDocument } from './openapi-doc';
import { domains } from './capabilities';

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

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const PAGES = path.join(APP_ROOT, 'content/docs/openapi');

export interface Result {
  /** How many capabilities the document declares. */
  served: number;
  /** Served, but no page was generated for it. */
  unpaged: string[];
  /** A page exists, but the document serves no such capability. */
  orphaned: string[];
  /** Served, but `capabilities.yaml` files it under no domain. */
  ungrouped: string[];
  /** Grouped by `capabilities.yaml`, but the document serves no such name. */
  unserved: string[];
}

export function checkCapabilities(): Result {
  const doc = loadDocument(DOCUMENT);
  // The capability set is the document's tag set — the same value the pages are
  // keyed by, read from the same place, so the two cannot drift apart here.
  const served = new Set(doc.products.map((p) => p.name));

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
    unserved: [...grouped].filter((c) => !served.has(c)).sort(),
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
    'names are grouped under a domain but served by nothing',
    r.unserved,
    'drop each one from openapi-specs/capabilities.yaml, and upstream in hanzoai/openapi',
  );
}

if (import.meta.main) {
  const r = checkCapabilities();
  report(r);
  const bad = r.unpaged.length + r.orphaned.length + r.ungrouped.length + r.unserved.length;
  console.log(`[capabilities] ${r.served} served, ${bad} disagreements`);
  process.exit(bad ? 1 : 0);
}
