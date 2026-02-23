import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from '@hanzo/docs/core/negotiation';

// Required for @opennextjs/cloudflare — proxy must run on edge, not Node.js.
export const runtime = 'edge';

const { rewrite: rewriteLLM } = rewritePath('/docs/*path', '/llms.mdx/*path');

const DEFAULT_HOST_SUFFIX = 'docs.hanzo.ai';

const SKIP_PATTERN = /^\/(\_next|api|assets|favicon\.ico)(\/|$)/;

function extractSubdomain(host: string, suffix: string): string {
  const normalizedHost = host.split(':')[0];
  if (!normalizedHost.endsWith(suffix)) return '';
  const trimmed = normalizedHost.slice(0, normalizedHost.length - suffix.length);
  if (!trimmed.endsWith('.')) return '';
  return trimmed.slice(0, -1);
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal/static paths
  if (SKIP_PATTERN.test(pathname)) {
    return NextResponse.next();
  }

  // Subdomain-based project routing (e.g. mcp.docs.hanzo.ai -> /docs/projects/hanzoai/mcp/...)
  const host = request.headers.get('host') ?? '';
  const hostSuffix = process.env.HANZO_DOCS_HOST_SUFFIX ?? DEFAULT_HOST_SUFFIX;

  if (host.endsWith(hostSuffix)) {
    const subdomain = extractSubdomain(host, hostSuffix);
    if (subdomain && subdomain !== 'docs') {
      const org = process.env.HANZO_DOCS_DEFAULT_ORG ?? 'hanzoai';
      if (pathname !== '/docs/projects' && !pathname.startsWith('/docs/projects/')) {
        const suffix = pathname === '/' ? '' : pathname;
        const url = request.nextUrl.clone();
        url.pathname = `/docs/projects/${org}/${subdomain}${suffix}`;
        return NextResponse.rewrite(url);
      }
    }
  }

  // Content negotiation: serve .mdx for markdown-preferring clients (LLMs)
  if (isMarkdownPreferred(request)) {
    const result = rewriteLLM(pathname);
    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl));
    }
  }

  return NextResponse.next();
}
