import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

// THE NINE DOMAINS.
//
// A capability's identity comes from the document — the tag on its operations.
// What the document does not say is which DOMAIN it belongs under when a reader
// is shown all of them at once, because that is presentation, and presentation has
// no source in a router. hanzoai/openapi's `capabilities.yaml` is where that one
// editorial decision lives, and this module is the only reader of it.
//
// It is TRACKED here beside flows.yaml and sdks.yaml, not fetched at a pin. All
// three are files whose contents must AGREE with the document, and a file like
// that does not get a second upstream: pinning one lets it drift on the other
// repo's clock, which is exactly how flows.yaml once named three operationIds
// that resolved to nothing and stopped the flow pages building. Agreement is
// enforced here instead, by `check-capabilities`, in both directions — so the
// copy cannot quietly disagree with the document the pages are built from.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
export const CAPABILITIES = path.join(APP_ROOT, 'openapi-specs/capabilities.yaml');

export interface Domain {
  id: string;
  title: string;
  /** The one-line reading of what the domain is for, from the file. */
  role: string;
  /** Capability names, in the order the file writes them. */
  tags: string[];
}

/**
 * The sidebar icon per domain.
 *
 * Not in `capabilities.yaml`: that file is the taxonomy every surface shares —
 * the CLI's help, the tool list, this sidebar — and a lucide icon name is true
 * of none of them but this one. It is keyed by domain id, so a domain that
 * arrives without one gets a plain separator rather than a guessed picture.
 */
const ICONS: Record<string, string> = {
  identity: 'ShieldCheck',
  intelligence: 'Sparkle',
  data: 'Database',
  streams: 'Radio',
  observability: 'Activity',
  commerce: 'CreditCard',
  platform: 'Server',
  applications: 'LayoutGrid',
  chain: 'Link',
};

export const icon = (id: string): string => ICONS[id] ?? '';

export function domains(file: string = CAPABILITIES): Domain[] {
  const raw = parseYaml(fs.readFileSync(file, 'utf8'));
  const list = Array.isArray(raw?.domains) ? raw.domains : [];
  return list.map((d: any) => ({
    id: String(d?.id ?? ''),
    title: String(d?.title ?? d?.id ?? ''),
    role: String(d?.role ?? '').trim(),
    tags: (Array.isArray(d?.tags) ? d.tags : []).map((t: any) => String(t)),
  }));
}

/**
 * The door a capability answers on when it is NOT a `/v1` address.
 *
 * A wire adaptor binds a port, a discovery convention answers under
 * `/.well-known/`, a co-resident claims requests on another app's router, and a
 * stream consumer mounts nothing at all. None of those appears in an OpenAPI
 * document, because a document describes HTTP operations and these are not HTTP
 * operations — so a set derived from the document alone is missing every
 * capability `manifest/apps.go` ships this way, and a reader who has heard of
 * `kafka` finds nothing and concludes we do not have it.
 *
 * Named for the value, not for a verb: pubsub's own package doc says ONE bus,
 * MANY doors, so a door is what this is a map of. (`reach` was the first name
 * and it already means something else one module over — the COUNT of operations
 * an MCP door answers. One word, two meanings, in one directory.)
 *
 * Read in two directions, which is why it is one map rather than a list:
 *
 *   • a name here the document does NOT serve gets a page written from this line
 *     — the line IS the page's subject.
 *   • a name here the document DOES serve keeps its generated page and gains the
 *     line, because `pubsub` answering at `/v1/pubsub` AND on `:4222` is one
 *     capability with two doors, not two capabilities.
 */
export function doors(file: string = CAPABILITIES): Map<string, string> {
  const raw = parseYaml(fs.readFileSync(file, 'utf8'));
  const out = new Map<string, string>();
  for (const [k, v] of Object.entries(raw?.doors ?? {})) out.set(String(k), String(v).trim());
  return out;
}

/**
 * Capability -> domain, and the order a sidebar walks them in.
 *
 * The order is the FILE's: domains as written, capabilities as written within
 * each. Alphabetising the whole list is the arrangement that carries no information
 * — it puts `admission` above `ai` and `zt` beside nothing — and the file's
 * order is the only one anybody decided.
 */
export function domainOf(ds: Domain[] = domains()): Map<string, Domain> {
  const out = new Map<string, Domain>();
  for (const d of ds) for (const t of d.tags) if (!out.has(t)) out.set(t, d);
  return out;
}
