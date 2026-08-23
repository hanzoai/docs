import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// WHAT THE PUBLISHED CLIENTS ACTUALLY CALL THINGS.
//
// An SDK sample on a docs page is a projection of THE DOCUMENT: openapi-generator
// derives a method name from an operationId, and openapi-surfaces reproduces that
// derivation. That is right by construction and still not enough, because a
// published client is a projection of the document AT ITS OWN LOCK, and the locks
// are independent — `hanzoai/js-sdk` and `hanzoai/python-sdk` both pin cloud
// `5a5552b2`, several releases behind what the reference is built from.
//
// While the locks agreed, the derived name and the shipped name were the same
// string and nobody had to think about it. Then cloud dropped the default version
// from its operationIds — `get_v1_audit` became `get_audit`, 2011 ids in one
// release — and the derived name became the name the NEXT client will carry,
// while `pip install hanzoai` still ships `get_v1_audit`. Both are true; only one
// of them runs today.
//
// So the registries are asked. This vendors each published client's method names
// and its version, and the SDK column says so when the method it prints is not
// one that client has. The note is computed from the difference, so it appears
// only while the difference exists and disappears the day the clients are
// regenerated — nobody has to remember to delete it.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const OUT = path.join(APP_ROOT, 'openapi-specs/sdk-clients.json');

export interface SdkClient {
  /** The SDK id in `openapi-surfaces`, so a column can find its own client. */
  lang: string;
  /** How a reader installs it — the registry coordinate, not a guess. */
  pkg: string;
  registry: string;
  version: string;
  /** Every method the published client declares. */
  methods: string[];
}

export interface SdkClients {
  captured: string;
  clients: SdkClient[];
}

/**
 * The two clients the SDK matrix calls generally available, read from the
 * registry that serves them. A language with no row here simply gets no note —
 * an unread client is not evidence of agreement, and the page claims nothing
 * about one.
 */
const SOURCES = [
  { lang: 'typescript', pkg: 'hanzoai', registry: 'npm' },
  { lang: 'python', pkg: 'hanzoai', registry: 'PyPI' },
] as const;

async function npmClient(pkg: string): Promise<Omit<SdkClient, 'lang' | 'registry'> | null> {
  const meta: any = await (await fetch(`https://registry.npmjs.org/${pkg}`)).json();
  const version = meta?.['dist-tags']?.latest;
  const tarball = meta?.versions?.[version]?.dist?.tarball;
  if (!tarball) return null;
  const buf = Buffer.from(await (await fetch(tarball)).arrayBuffer());
  // The generated client declares each method in its `.d.ts`; reading the
  // declarations rather than the implementation keeps this to one shape.
  const text = await untar(buf, (name) => name.startsWith('package/dist/api/') && name.endsWith('.d.ts'));
  const methods = [...text.matchAll(/^\s{4}([a-z][A-Za-z0-9]*)\(/gm)].map((m) => m[1]);
  return { pkg, version, methods: [...new Set(methods)].sort() };
}

async function pypiClient(pkg: string): Promise<Omit<SdkClient, 'lang' | 'registry'> | null> {
  const meta: any = await (await fetch(`https://pypi.org/pypi/${pkg}/json`)).json();
  const version = meta?.info?.version;
  const wheel = (meta?.urls ?? []).find((u: any) => String(u.filename).endsWith('.whl'));
  if (!wheel || !version) return null;
  const buf = Buffer.from(await (await fetch(wheel.url)).arrayBuffer());
  const text = await unzip(buf, (name) => name.startsWith('hanzoai/cloud/api/') && name.endsWith('.py'));
  const methods = [...text.matchAll(/^ {4}def ([a-z][a-z0-9_]*)\(/gm)]
    .map((m) => m[1])
    .filter((n) => !n.endsWith('_with_http_info') && !n.endsWith('_without_preload_content'));
  return { pkg, version, methods: [...new Set(methods)].sort() };
}

/** Concatenated contents of the archive members `keep` selects. */
async function untar(buf: Buffer, keep: (name: string) => boolean): Promise<string> {
  const { Readable } = await import('node:stream');
  const zlib = await import('node:zlib');
  const raw: Buffer = await new Promise((res, rej) =>
    zlib.gunzip(buf, (e, out) => (e ? rej(e) : res(out))),
  );
  void Readable;
  let out = '';
  for (let off = 0; off + 512 <= raw.length; ) {
    const name = raw.toString('utf8', off, off + 100).replace(/\0.*$/, '');
    if (!name) break;
    const size = parseInt(raw.toString('ascii', off + 124, off + 136).replace(/\0.*$/, '').trim(), 8) || 0;
    const body = off + 512;
    if (keep(name)) out += raw.toString('utf8', body, body + size) + '\n';
    off = body + Math.ceil(size / 512) * 512;
  }
  return out;
}

async function unzip(buf: Buffer, keep: (name: string) => boolean): Promise<string> {
  const zlib = await import('node:zlib');
  let out = '';
  // Walk the central directory, which is the only place a zip states its own
  // entry list; scanning for local headers guesses at where members begin.
  const eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (eocd < 0) return out;
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  for (let i = 0; i < count && p + 46 <= buf.length; i++) {
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const name = buf.toString('utf8', p + 46, p + 46 + nameLen);
    const method = buf.readUInt16LE(p + 10);
    const size = buf.readUInt32LE(p + 20);
    const local = buf.readUInt32LE(p + 42);
    if (keep(name) && local + 30 <= buf.length) {
      const lnLen = buf.readUInt16LE(local + 26);
      const leLen = buf.readUInt16LE(local + 28);
      const start = local + 30 + lnLen + leLen;
      const data = buf.subarray(start, start + size);
      out += (method === 8 ? zlib.inflateRawSync(data) : data).toString('utf8') + '\n';
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  return out;
}

export async function syncSdkClients(): Promise<void> {
  const have = fs.existsSync(OUT) ? load() : null;
  const clients: SdkClient[] = [];
  for (const s of SOURCES) {
    try {
      const got = s.registry === 'npm' ? await npmClient(s.pkg) : await pypiClient(s.pkg);
      if (got?.methods.length) clients.push({ lang: s.lang, registry: s.registry, ...got });
      else console.warn(`[sdk] ${s.registry}:${s.pkg} declared no methods this build`);
    } catch (e) {
      console.warn(`[sdk] ${s.registry}:${s.pkg} unreachable: ${(e as Error).message}`);
    }
  }
  // A registry that answers with nothing is a registry having a bad day, not a
  // client that lost its methods — same rule as the server's tool list.
  if (!clients.length) {
    if (!have) throw new Error('[sdk] no published client could be read and none is vendored');
    console.log(`[sdk] no registry answered — keeping the vendored clients captured ${have.captured}`);
    return;
  }
  fs.writeFileSync(
    OUT,
    JSON.stringify({ captured: new Date().toISOString().slice(0, 10), clients }, null, 0) + '\n',
  );
  cached = undefined; // the file just moved under the cache
  console.log(
    `[sdk] ${clients.map((c) => `${c.pkg}@${c.version} (${c.registry}, ${c.methods.length} methods)`).join(', ')}`,
  );
}

/**
 * Read once. Every operation page asks whether the published clients declare its
 * method, so this is called per operation — twice, now that the capability table
 * asks too — and a fresh parse each time is 2,248 reads of the same file to
 * answer the same question. The file does not change during a build.
 */
let cached: SdkClients | undefined;

export function load(): SdkClients {
  if (cached) return cached;
  if (!fs.existsSync(OUT)) return (cached = { captured: '', clients: [] });
  const raw = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  return (cached = { captured: String(raw.captured ?? ''), clients: raw.clients ?? [] });
}

if (import.meta.main) {
  syncSdkClients().catch((e) => {
    console.error('[sdk] failed', e);
    process.exit(1);
  });
}
