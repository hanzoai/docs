import Link from 'next/link';

// The landing page's unit of navigation: one DOMAIN, not one product.
//
// A card grid treats ten domains as ten equal tiles, which is exactly the shape
// that tells a reader nothing — every tile is the same size, so the page has no
// opinion about where to start, and the reader has to read all ten to find the
// one they came for. This is the other arrangement: a handful of sections, each
// one wide enough to say what the domain IS, show the single line of code that
// proves it, and then list its products inline for anyone who already knows the
// name they want.
//
// So there are three depths on one page, and a reader stops at whichever matches
// what they already know:
//
//   the sentence   — "what is this domain for", for someone who does not know
//   the snippet    — the shortest true call, for someone who wants to try it
//   the link row   — every product in the domain, for someone who knows the name
//
// Monochrome by construction. Hanzo's tokens carry no hue (--color-brand is
// hsl(0,0%,96%) on hsl(0,0%,4%)), so the only emphasis available is WEIGHT,
// BORDER and SPACE. That is a constraint worth keeping honest rather than
// working around: nothing here introduces a colour to mean "important", because
// a page that needs colour to establish hierarchy has not established it.

/** One product inside a domain: the name a reader would search for, and its page. */
export interface ProductLink {
  name: string;
  href: string;
}

export interface ProductSectionProps {
  /** The domain's name — the thing a reader is scanning for. */
  title: string;
  /** Where the domain's own overview lives. The title links here. */
  href: string;
  /** One sentence. What this domain is for, in the reader's terms, not ours. */
  children: React.ReactNode;
  /**
   * The shortest true call into this domain — one line, actually runnable.
   * Optional: a domain with no honest one-liner should show nothing rather
   * than a decorative fragment that does not run.
   */
  snippet?: string;
  /** The next step, phrased as the thing the reader would do. */
  action?: { label: string; href: string };
  /** Every product in the domain, inline. */
  links?: ProductLink[];
}

export function ProductSection({
  title,
  href,
  children,
  snippet,
  action,
  links,
}: ProductSectionProps) {
  return (
    <section className="not-prose border-t border-fd-border py-10 first:border-t-0 first:pt-0">
      <div className="grid gap-x-12 gap-y-6 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        {/* Left rail: what it is. Narrow on purpose — a domain that needs a
            paragraph to introduce itself is really two domains. */}
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-fd-foreground">
            <Link href={href} className="hover:underline underline-offset-4">
              {title}
            </Link>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">
            {children}
          </p>
          {action ? (
            <Link
              href={action.href}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-fd-foreground hover:underline underline-offset-4"
            >
              {action.label}
              {/* Marks the link as forward motion without spending a colour on it. */}
              <span aria-hidden="true">→</span>
            </Link>
          ) : null}
        </div>

        {/* Right rail: how to touch it. */}
        <div className="min-w-0">
          {snippet ? (
            <pre className="overflow-x-auto rounded-lg border border-fd-border bg-fd-card px-4 py-3 text-[13px] leading-relaxed text-fd-foreground">
              <code>{snippet}</code>
            </pre>
          ) : null}

          {links?.length ? (
            <ul className="mt-4 flex flex-wrap items-center gap-x-1 gap-y-2">
              {links.map((l, i) => (
                <li key={l.href} className="flex items-center">
                  {/* A separator BETWEEN items, never trailing — and aria-hidden,
                      because a screen reader announcing "dot" between twenty
                      product names is noise, and the <li> boundary already
                      carries the separation. */}
                  {i > 0 ? (
                    <span
                      aria-hidden="true"
                      className="mx-2 text-fd-muted-foreground/50"
                    >
                      ·
                    </span>
                  ) : null}
                  <Link
                    href={l.href}
                    className="text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/**
 * Wraps the sections so the hairlines between them are the layout, rather than
 * each section guessing its own margin. `first:border-t-0` on the child means
 * the group can start flush under a heading.
 */
export function ProductSections({ children }: { children: React.ReactNode }) {
  return <div className="not-prose my-10">{children}</div>;
}
