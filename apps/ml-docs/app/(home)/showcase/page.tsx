import showcaseData from '@/data/showcase.json';

const categoryLabels: Record<string, string> = {
  'power-user': 'Power User',
  'automation': 'Automation',
  'productivity': 'Productivity',
  'integration': 'Integration',
  'developer': 'Developer',
  'personal': 'Personal',
  'family': 'Family',
  'smart-home': 'Smart Home',
  'creative': 'Creative',
};

export const metadata = {
  title: 'Showcase — What People Are Building with Hanzo Bot',
};

export default function ShowcasePage() {
  return (
    <main className="relative z-[1] max-w-[1200px] mx-auto px-6 py-10">
      <div className="stars" />
      <div className="nebula" />

      <header className="text-center mb-12 animate-[fadeInUp_0.6s_ease-out]">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          <span className="text-brand">&#x27E9;</span> What People Are Building
        </h1>
        <p className="text-fd-muted-foreground text-lg">Real projects, real automation, real magic.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-5 mb-14">
        {showcaseData.map((item) => (
          <a
            key={item.id}
            href={`https://x.com/${item.author}/status/${item.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-4 p-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.7)] backdrop-blur-sm no-underline text-fd-foreground transition-all hover:border-brand hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(255,77,77,0.15)]"
          >
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://unavatar.io/x/${item.author}`}
                alt={item.author}
                className="w-12 h-12 rounded-full shrink-0 border-2 border-fd-border bg-fd-muted object-cover"
                loading="lazy"
              />
              <div className="flex flex-col gap-0.5 flex-1">
                <span className="font-semibold text-brand text-sm">@{item.author}</span>
                <span className="text-xs text-fd-muted-foreground">
                  {categoryLabels[item.category] || item.category}
                </span>
              </div>
              <span className="text-sm text-fd-muted-foreground">&#x2764;&#xFE0F; {item.likes}</span>
            </div>
            <p className="text-sm leading-relaxed text-fd-muted-foreground whitespace-pre-line">{item.quote}</p>
            {item.images && item.images.length > 0 && (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2 mt-3">
                {item.images.map((img: string, idx: number) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={idx}
                    src={img}
                    alt="Screenshot"
                    className="w-full h-auto rounded-lg border border-fd-border object-cover max-h-[200px]"
                    loading="lazy"
                  />
                ))}
              </div>
            )}
            <span className="text-sm text-fd-muted-foreground pt-3 border-t border-fd-border transition-colors group-hover:text-brand">
              View on X →
            </span>
          </a>
        ))}
      </div>

      <section className="text-center p-12 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.7)] backdrop-blur-sm mb-12">
        <h2 className="text-2xl font-semibold mb-2">Built something cool?</h2>
        <p className="text-fd-muted-foreground mb-6">Share your Hanzo Bot creation with the community</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="https://twitter.com/intent/tweet?text=Check%20out%20what%20I%20built%20with%20%40hanzoai%20%23hanzobot"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-br from-brand to-[#991b1b] no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,77,77,0.4)]"
          >
            Share on X
          </a>
          <a
            href="/skills"
            className="px-6 py-3 rounded-xl font-semibold text-[#00e5cc] border border-[#00e5cc] bg-[rgba(0,229,204,0.15)] no-underline transition-all hover:-translate-y-0.5 hover:bg-[rgba(0,229,204,0.25)]"
          >
            Browse Skills
          </a>
          <a
            href="https://discord.gg/hanzo"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl font-semibold text-[#5865F2] border border-[#5865F2] bg-[rgba(88,101,242,0.15)] no-underline transition-all hover:-translate-y-0.5 hover:bg-[rgba(88,101,242,0.25)]"
          >
            Join Discord
          </a>
        </div>
      </section>

      <p className="text-center text-fd-muted-foreground text-sm">
        Looking for more? Check out{' '}
        <a href="https://github.com/hanzoai/bot" target="_blank" rel="noopener noreferrer" className="text-[#00e5cc] no-underline hover:underline">
          even more examples in our docs
        </a>{' '}→
      </p>
    </main>
  );
}
