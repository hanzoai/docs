import fs from 'node:fs';
import path from 'node:path';
import { visit } from 'unist-util-visit';
import type { Transformer } from 'unified';
import type { Root } from 'mdast';

// Rewrite internal doc links so none 404.
//
// The docs merge ported OSS docs (services/iam,kms,platform + projects/*) whose
// prose links use their SOURCE-repo absolute paths (/self-hosting/x, /provider/x,
// /api-reference/x). Mounted under /docs/services/<svc> or /docs/projects/<org>/<repo>,
// those paths don't resolve. For every internal link we:
//   1. rewrite root-absolute non-/docs links to the page's section mount
//      (/self-hosting/overview on a kms page -> /docs/services/kms/self-hosting/overview),
//   2. resolve relative links against the current page,
//   3. keep links that already resolve (incl. _redirects sources),
//   4. fall back to the section root for links whose target genuinely doesn't
//      exist (dead upstream refs) — a valid page, never a 404.
//
// The set of valid URLs is derived from the content tree (verified byte-for-byte
// against the built output) plus the CF Pages _redirects sources.

const CONTENT_DIR = path.resolve('content/docs');
const REDIRECTS = path.resolve('public/_redirects');

function urlFromContentPath(p: string): string {
  let rel = path.relative(CONTENT_DIR, p);
  if (rel.endsWith('.mdx')) rel = rel.slice(0, -4);
  const parts = rel
    .split(path.sep)
    .filter((seg) => !(seg.startsWith('(') && seg.endsWith(')')));
  if (parts.length && parts[parts.length - 1] === 'index') parts.pop();
  return '/docs' + (parts.length ? '/' + parts.join('/') : '');
}

let VALID: Set<string> | null = null;
function validUrls(): Set<string> {
  if (VALID) return VALID;
  const set = new Set<string>();
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const fp = path.join(dir, e.name);
      if (e.isDirectory()) walk(fp);
      else if (e.name.endsWith('.mdx')) set.add(urlFromContentPath(fp));
    }
  };
  if (fs.existsSync(CONTENT_DIR)) walk(CONTENT_DIR);
  set.add('/docs');
  // Redirect sources resolve at the edge — treat them as valid link targets.
  if (fs.existsSync(REDIRECTS)) {
    for (const line of fs.readFileSync(REDIRECTS, 'utf8').split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const src = t.split(/\s+/)[0];
      if (src && src.startsWith('/') && !src.includes('*')) set.add(src.replace(/\/$/, ''));
    }
  }
  VALID = set;
  return set;
}

// Section mount for a content file: the root the ported repo was mounted at.
function sectionRoot(fileUrl: string): string {
  const p = fileUrl.split('/'); // ['', 'docs', 'services', 'iam', ...]
  if (p[1] === 'docs' && p[2] === 'services' && p[3]) return `/docs/services/${p[3]}`;
  if (p[1] === 'docs' && p[2] === 'projects' && p[3] && p[4])
    return `/docs/projects/${p[3]}/${p[4]}`;
  if (p[1] === 'docs' && p[2]) return `/docs/${p[2]}`;
  return '/docs';
}

function normalize(u: string): string {
  if (u.length > 1 && u.endsWith('/')) u = u.slice(0, -1);
  return u;
}

function resolveRelative(pageUrl: string, rel: string): string {
  const base = pageUrl.split('/').slice(0, -1); // page's directory segments
  for (const seg of rel.split('/')) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') base.pop();
    else base.push(seg);
  }
  return normalize(base.join('/') || '/');
}

function fixOne(url: string, pageUrl: string, root: string, valid: Set<string>): string {
  if (!url) return url;
  // external / non-navigational
  if (/^([a-z][a-z0-9+.-]*:|\/\/|#|mailto:|tel:)/i.test(url)) return url;
  if (url.startsWith('{')) return url; // MDX expression href
  const hashIdx = url.search(/[#?]/);
  const suffix = hashIdx >= 0 ? url.slice(hashIdx) : '';
  let p = hashIdx >= 0 ? url.slice(0, hashIdx) : url;
  if (p === '') return url; // pure anchor/query

  let cand: string;
  if (p === '/docs' || p.startsWith('/docs/')) cand = normalize(p);
  else if (p.startsWith('/')) cand = normalize(root + p);
  else cand = resolveRelative(pageUrl, p);

  let target: string;
  if (valid.has(cand)) target = cand;
  else if (valid.has(normalize(p))) target = normalize(p);
  else target = root; // dead upstream ref -> section index, never a 404

  return target + suffix;
}

export function remarkFixInternalLinks(): Transformer<Root, Root> {
  return (tree, file) => {
    const filePath = file.path ?? file.history?.[0] ?? '';
    if (!filePath.includes(`content${path.sep}docs`) && !filePath.includes('content/docs'))
      return;
    const valid = validUrls();
    const pageUrl = urlFromContentPath(filePath);
    const root = sectionRoot(pageUrl);

    visit(tree, (node: any) => {
      if (node.type === 'link' && typeof node.url === 'string') {
        node.url = fixOne(node.url, pageUrl, root, valid);
      } else if (
        node.type === 'mdxJsxFlowElement' ||
        node.type === 'mdxJsxTextElement'
      ) {
        for (const attr of node.attributes ?? []) {
          if (
            attr.type === 'mdxJsxAttribute' &&
            (attr.name === 'href' || attr.name === 'url') &&
            typeof attr.value === 'string'
          ) {
            attr.value = fixOne(attr.value, pageUrl, root, valid);
          }
        }
      }
    });
  };
}
