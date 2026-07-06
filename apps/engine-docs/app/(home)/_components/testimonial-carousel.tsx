'use client';

import { useMemo } from 'react';

interface Testimonial {
  quote: string;
  author: string;
  url: string;
}

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const half = Math.ceil(testimonials.length / 2);
  const topRow = testimonials.slice(0, half);
  const bottomRow = testimonials.slice(half);

  const row1 = useMemo(() => [...topRow, ...topRow], [topRow]);
  const row2 = useMemo(() => [...bottomRow, ...bottomRow], [bottomRow]);

  const pixelsPerItem = 336;
  const pixelsPerSecond = 50;
  const duration1 = (topRow.length * pixelsPerItem) / pixelsPerSecond;
  const duration2 = (bottomRow.length * pixelsPerItem) / pixelsPerSecond;

  return (
    <section className="mb-14 overflow-hidden -mx-6 px-6">
      <div className="flex items-center justify-between mb-5 px-6">
        <h2 className="text-xl font-semibold flex items-center gap-2.5">
          <span className="text-brand font-bold">&#x27E9;</span> What People Say
        </h2>
        <a href="/shoutouts" className="text-sm text-brand font-medium hover:text-[#00e5cc] transition-colors">
          View all →
        </a>
      </div>
      <div
        className="flex flex-col gap-2 -mx-6 overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
        }}
      >
        <div
          className="flex gap-4 w-max py-2 animate-[scroll-left_var(--duration)_linear_infinite] hover:[animation-play-state:paused]"
          style={{ '--duration': `${duration1}s` } as React.CSSProperties}
        >
          {row1.map((t, i) => (
            <a
              key={`r1-${i}`}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 min-w-[320px] max-w-[400px] rounded-xl border border-fd-border bg-[rgba(10,15,26,0.7)] backdrop-blur-sm no-underline text-fd-foreground transition-all duration-250 hover:border-brand hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,77,77,0.15)] shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.author)}&background=fd4444&color=fff&size=88&bold=true`}
                alt={t.author}
                className="w-11 h-11 rounded-full shrink-0 border-2 border-fd-border bg-fd-muted"
                loading="lazy"
              />
              <div className="flex flex-col gap-1.5 min-w-0">
                <p className="text-sm leading-snug text-fd-muted-foreground line-clamp-3">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <span className="text-xs font-semibold text-brand">@{t.author}</span>
              </div>
            </a>
          ))}
        </div>
        <div
          className="flex gap-4 w-max py-2 animate-[scroll-right_var(--duration)_linear_infinite] hover:[animation-play-state:paused]"
          style={{ '--duration': `${duration2}s` } as React.CSSProperties}
        >
          {row2.map((t, i) => (
            <a
              key={`r2-${i}`}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 min-w-[320px] max-w-[400px] rounded-xl border border-fd-border bg-[rgba(10,15,26,0.7)] backdrop-blur-sm no-underline text-fd-foreground transition-all duration-250 hover:border-brand hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,77,77,0.15)] shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.author)}&background=fd4444&color=fff&size=88&bold=true`}
                alt={t.author}
                className="w-11 h-11 rounded-full shrink-0 border-2 border-fd-border bg-fd-muted"
                loading="lazy"
              />
              <div className="flex flex-col gap-1.5 min-w-0">
                <p className="text-sm leading-snug text-fd-muted-foreground line-clamp-3">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <span className="text-xs font-semibold text-brand">@{t.author}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
