import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// THE SPECIFICATION A CAPABILITY CARRIES.
//
// The document says what a capability SERVES — addresses, schemas, prose per
// route. It does not say what the capability IS: the store it owns, how a
// request becomes a tenant, what it meters, what it publishes on the bus. That
// is the capability's HIP, and HIP-0139 makes writing one part of shipping a
// capability.
//
// A HIP declares which capability it specifies in its front matter
// (`capability: kms`, or a list), so the join needs no table and no guessing:
// the corpus states it, exactly as cloud's tag states the owner of a route.
//
// Pinned by commit, exactly like the document and the CLI's command table. The
// corpus is written continuously by whoever ships a capability, so a page must
// say WHICH corpus it was built from or "what the spec says" becomes a moving
// claim. Never a live host: three sources, all yielding the same bytes — the
// pin over https, a sibling checkout, and the committed `hips.json`.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const PIN_FILE = path.join(APP_ROOT, 'openapi-specs/hips.pin');
const OUT = path.join(APP_ROOT, 'openapi-specs/hips.json');
const SIBLING = path.resolve(APP_ROOT, '../../../hips/HIPs');
const RAW = (pin: string, file: string) =>
  `https://raw.githubusercontent.com/hanzoai/hips/${pin}/HIPs/${file}`;

/** One `##` section of a HIP, with the `###` prose beneath it left intact. */
export interface Section {
  heading: string;
  body: string;
}

export interface Hip {
  /** The HIP number as written, e.g. `0139`. */
  hip: string;
  /** The corpus filename, so a page can link back to the text it renders. */
  file: string;
  title: string;
  /** `Draft`, `Active`, `Final`, … — whether the TEXT is settled. */
  status: string;
  /** Every `##` section, in the order the HIP writes them. */
  sections: Section[];
}

export interface Corpus {
  pin: string;
  /** capability name -> the HIP that specifies it. */
  capabilities: Record<string, Hip>;
}

const front = (src: string): Record<string, string> => {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const out: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/);
    if (kv) out[kv[1].toLowerCase()] = kv[2].trim();
  }
  return out;
};

/**
 * `capability: kms` and `capability: [sandboxes, exec]` are both legal, so the
 * value is read as the set of names it contains rather than as one string.
 */
const declared = (value: string): string[] => value.match(/[A-Za-z0-9_.-]+/g) ?? [];

/**
 * Split a HIP into its `##` sections.
 *
 * HIP-0139 requires a capability HIP to state its store, its tenancy, what it
 * meters and what it publishes — but it requires them as CONTENT, "each in its
 * own section where the template has one", and the template has no Store,
 * Tenancy or Metering heading. Authors put them in freely-titled `###`
 * subsections under Specification. So there is nothing to key on, and a
 * generator that went looking for `## Store` would render an empty page for
 * every HIP in the corpus.
 *
 * The sections are therefore taken AS WRITTEN. The page shows the specification
 * its author actually wrote, and the `###` prose travels inside its `##`
 * section untouched.
 */
export function sections(src: string): Section[] {
  const body = src.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
  const out: Section[] = [];
  let heading = '';
  let buf: string[] = [];
  const flush = () => {
    const text = buf.join('\n').trim();
    if (heading && text) out.push({ heading, body: text });
    buf = [];
  };
  for (const line of body.split(/\r?\n/)) {
    const h = line.match(/^##\s+(.+?)\s*$/);
    if (h && !line.startsWith('###')) {
      flush();
      heading = h[1].trim();
    } else if (heading) {
      buf.push(line);
    }
  }
  flush();
  return out;
}

/**
 * A HIP that declares a capability it does not specify.
 *
 * HIP-0106 is The Hanzo Plugin Contract — the standard every plugin conforms
 * to — and it carries `capability: usage`. `usage` is "what your org ran and
 * what it cost"; the contract is not its specification, and rendering it as one
 * put 30 KB about plugin conformance, including the platform key contract, on
 * the usage reference. HIP-0139 §6 says one capability, one HIP; `coverage.py`
 * counts this as covering `usage`, which is how the ratchet came to be
 * satisfied by a HIP about something else.
 *
 * Named here with its reason rather than matched by a rule, because there is no
 * property of the text that separates a contract from a specification. The fix
 * is upstream: drop the `capability:` line from HIP-0106 and write one for
 * `usage`. The day that lands this set is empty and this comment goes with it.
 */
const NOT_A_SPECIFICATION = new Set(['0106']);

export function parseHip(src: string, file: string): { hip: Hip; capabilities: string[] } | null {
  const fm = front(src);
  if (!fm.capability || NOT_A_SPECIFICATION.has((fm.hip ?? '').trim())) return null;
  return {
    hip: {
      hip: fm.hip ?? '',
      file,
      title: fm.title ?? '',
      status: fm.status ?? '',
      sections: sections(src),
    },
    capabilities: declared(fm.capability),
  };
}

/**
 * Build the corpus from a set of `<name>.md` sources.
 *
 * Two HIPs claiming one capability is a defect the corpus's own `coverage.py`
 * names (CV005). It is not this build's to arbitrate, so the lower HIP number
 * wins — the earlier specification — deterministically, and the gate upstream
 * reports the duplicate.
 */
export function corpus(files: Map<string, string>, pin: string): Corpus {
  const capabilities: Record<string, Hip> = {};
  for (const [file, src] of files) {
    const parsed = parseHip(src, file);
    if (!parsed) continue;
    for (const name of parsed.capabilities) {
      const held = capabilities[name];
      if (!held || parsed.hip.hip < held.hip) capabilities[name] = parsed.hip;
    }
  }
  return { pin, capabilities };
}

async function sources(pin: string): Promise<Map<string, string>> {
  const files = new Map<string, string>();
  if (fs.existsSync(SIBLING)) {
    for (const name of fs.readdirSync(SIBLING)) {
      if (name.endsWith('.md')) files.set(name, fs.readFileSync(path.join(SIBLING, name), 'utf8'));
    }
    console.log(`[hips] using the sibling checkout (${files.size} HIPs)`);
    return files;
  }
  if (!pin) return files;
  // No listing endpoint without a token, so the index the corpus keeps of
  // itself is what names the files to fetch.
  try {
    const r = await fetch(RAW(pin, 'index.md'));
    if (!r.ok) return files;
    const index = await r.text();
    const names = [...index.matchAll(/\bhip-[0-9a-z-]+\.md\b/g)].map((m) => m[0]);
    for (const name of [...new Set(names)]) {
      const one = await fetch(RAW(pin, name));
      if (one.ok) files.set(name, await one.text());
    }
    console.log(`[hips] fetched ${files.size} HIPs @ ${pin.slice(0, 9)}`);
  } catch {
    /* fall through to the committed corpus */
  }
  return files;
}

/** Read the committed corpus. Every generator reads the HIPs through this. */
export function loadCorpus(): Corpus {
  try {
    return JSON.parse(fs.readFileSync(OUT, 'utf8')) as Corpus;
  } catch {
    return { pin: '', capabilities: {} };
  }
}

export async function syncHips(): Promise<void> {
  const pin = fs.existsSync(PIN_FILE) ? fs.readFileSync(PIN_FILE, 'utf8').trim() : '';
  const files = await sources(pin);
  if (!files.size) {
    console.warn('[hips] no source; keeping the committed corpus');
    return;
  }
  const built = corpus(files, pin);
  fs.writeFileSync(OUT, JSON.stringify(built, null, 2) + '\n');
  const n = Object.keys(built.capabilities).length;
  console.log(`[hips] ${n} capabilities carry a specification`);
}

if (import.meta.main) {
  syncHips().catch((e) => {
    console.error('[hips] failed', e);
    process.exit(1);
  });
}
