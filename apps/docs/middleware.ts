import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DEFAULT_HOST_SUFFIX = 'docs.hanzo.ai';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const hostSuffix = process.env.HANZO_DOCS_HOST_SUFFIX ?? DEFAULT_HOST_SUFFIX;

  if (!host.endsWith(hostSuffix)) {
    return NextResponse.next();
  }

  const subdomain = extractSubdomain(host, hostSuffix);
  if (!subdomain || subdomain === 'docs') {
    return NextResponse.next();
  }

  const org = process.env.HANZO_DOCS_DEFAULT_ORG ?? 'hanzoai';
  const url = request.nextUrl.clone();

  if (url.pathname === '/docs/projects' || url.pathname.startsWith('/docs/projects/')) {
    return NextResponse.next();
  }

  if (!url.pathname.startsWith('/docs/projects/')) {
    const suffix = url.pathname === '/' ? '' : url.pathname;
    url.pathname = `/docs/projects/${org}/${subdomain}${suffix}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

function extractSubdomain(host: string, suffix: string) {
  const normalizedHost = host.split(':')[0];
  if (!normalizedHost.endsWith(suffix)) return '';
  const trimmed = normalizedHost.slice(0, normalizedHost.length - suffix.length);
  if (!trimmed.endsWith('.')) return '';
  return trimmed.slice(0, -1);
}

export const config = {
  matcher: ['/((?!_next|api|assets|favicon.ico).*)'],
};
