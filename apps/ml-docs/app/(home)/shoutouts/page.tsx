import allTestimonials from '@/data/testimonials-extra.json';

export const metadata = {
  title: 'Shoutouts — Hanzo Bot',
};

export default function ShoutoutsPage() {
  return (
    <main className="relative z-[1] max-w-[1200px] mx-auto px-6 py-10">
      <div className="stars" />
      <div className="nebula" />

      <header className="text-center mb-12 animate-[fadeInUp_0.6s_ease-out]">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          <span className="text-brand">&#x27E9;</span> Shoutouts
        </h1>
        <p className="text-fd-muted-foreground text-lg">What the community is saying about Hanzo Bot</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5 animate-[fadeInUp_0.6s_ease-out_0.15s_both]">
        {allTestimonials.map((t, i) => (
          <a
            key={i}
            href={t.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3.5 p-5 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.7)] backdrop-blur-sm no-underline text-fd-foreground transition-all hover:border-brand hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(255,77,77,0.15)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={(t as any).avatar || `https://unavatar.io/x/${t.author}`}
              alt={t.author}
              className="w-12 h-12 rounded-full shrink-0 border-2 border-fd-border bg-fd-muted"
              loading="lazy"
            />
            <div className="flex flex-col gap-2 min-w-0">
              <p className="text-sm leading-relaxed text-fd-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <span className="text-sm font-semibold text-brand">@{t.author}</span>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
