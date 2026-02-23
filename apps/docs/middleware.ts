import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Edge middleware required for @opennextjs/cloudflare deployment.
// Without this, Next.js creates a Node.js middleware proxy that
// opennextjs-cloudflare rejects. This passthrough edge middleware
// satisfies the requirement.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // Only match API routes — all other routes are static.
  matcher: ['/api/:path*'],
};
