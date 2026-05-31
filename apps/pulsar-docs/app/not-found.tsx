import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-mono uppercase tracking-[0.3em] text-fd-muted-foreground mb-4">
        404
      </p>
      <h1 className="text-3xl font-semibold mb-3">Page not found</h1>
      <p className="text-fd-muted-foreground max-w-sm mb-10">
        That page doesn&apos;t exist or has moved. Try the documentation or head
        home.
      </p>

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
        <a
          href="https://github.com/luxfi/pulsar"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-4 py-2 text-sm font-medium hover:bg-fd-muted transition"
        >
          GitHub
        </a>
      </div>

      <p className="mt-16 text-xs font-mono text-fd-muted-foreground opacity-50">
        pulsar — threshold ML-DSA-65
      </p>
    </main>
  );
}
