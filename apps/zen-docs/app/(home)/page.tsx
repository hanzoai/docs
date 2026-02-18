import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          ⚡ Zen LM
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Frontier AI models for code, reasoning, and multimodal understanding
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="font-semibold text-lg mb-2">zen-max</h3>
            <p className="text-sm text-muted-foreground">671B MoE • 71.3% SWE-bench</p>
          </div>
          <div className="p-6 rounded-lg border bg-card ring-2 ring-primary">
            <h3 className="font-semibold text-lg mb-2">zen-coder-flash ⭐</h3>
            <p className="text-sm text-muted-foreground">31B MoE • 59.2% SWE-bench</p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="font-semibold text-lg mb-2">zen-nano</h3>
            <p className="text-sm text-muted-foreground">0.6B • Edge deployment</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/docs"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
          >
            Read Docs
          </Link>
          <Link
            href="https://huggingface.co/zenlm"
            className="px-6 py-3 border rounded-lg font-medium hover:bg-muted transition"
          >
            HuggingFace
          </Link>
          <Link
            href="https://github.com/zenlm"
            className="px-6 py-3 border rounded-lg font-medium hover:bg-muted transition"
          >
            GitHub
          </Link>
        </div>
      </div>
    </main>
  );
}
