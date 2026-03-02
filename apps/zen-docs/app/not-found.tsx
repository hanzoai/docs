import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      {/* Enso-inspired decorative circle */}
      <div className="mb-8 opacity-20">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="280 40"
          />
        </svg>
      </div>

      {/* 404 */}
      <p className="text-xs font-mono uppercase tracking-[0.3em] text-fd-muted-foreground mb-4">
        404
      </p>
      <h1 className="text-3xl font-semibold mb-3">Page not found</h1>
      <p className="text-fd-muted-foreground max-w-sm mb-10">
        This page doesn't exist, or it may have moved. Try the documentation or head home.
      </p>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-fd-primary text-fd-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition"
        >
          Go home
        </Link>
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-4 py-2 text-sm font-medium hover:bg-fd-muted transition"
        >
          Documentation
        </Link>
        <Link
          href="/docs/models"
          className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-4 py-2 text-sm font-medium hover:bg-fd-muted transition"
        >
          Browse models
        </Link>
      </div>

      {/* Brand footer */}
      <p className="mt-16 text-xs font-mono text-fd-muted-foreground opacity-50">
        zenlm.org
      </p>
    </main>
  );
}
