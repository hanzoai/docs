'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

// The sidebar filter.
//
// The sidebar used to carry a full "Search ⌘K" box while the top bar carried a
// magnifier for the same dialog — two controls, one job, six inches apart. The
// dialog now lives only at the top, and this takes the sidebar's slot doing the
// job the sidebar actually needs: revealing a page that the tree does not show.
//
// The tree deliberately lists 12 rows so it fits one screen, which means every
// other page is a click deep. Typing here searches ALL of them by title and path
// and stands IN PLACE of the tree — `data-sidebar-tree` is hidden while a query
// is active, so results do not push the tree off screen. Empty the box and the
// tree returns.
//
// A filter, not a search: it matches page titles and URLs only, instantly and
// offline. Full-text lives behind ⌘K, and the footer says so rather than leaving
// a reader to wonder why the body text they remember does not match.
export function SidebarFilter({ pages }: { pages: [string, string][] }) {
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();

  const hits = useMemo(() => {
    if (!query) return [];
    const out: { url: string; title: string; rank: number }[] = [];
    for (const [url, title] of pages) {
      const t = title.toLowerCase();
      // Rank so an exact prefix beats a word match beats a path-only match; a
      // reader typing "kv" wants Hanzo KV first, not every page under /docs/kv.
      const rank = t.startsWith(query) ? 0 : t.includes(query) ? 1 : url.includes(query) ? 2 : -1;
      if (rank >= 0) out.push({ url, title, rank });
      if (out.length > 400) break;
    }
    return out.sort((a, b) => a.rank - b.rank || a.title.length - b.title.length).slice(0, 40);
  }, [query, pages]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 rounded-lg border bg-fd-secondary/50 px-2.5 py-1.5">
        <Search className="size-4 shrink-0 text-fd-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter pages"
          aria-label="Filter pages in the sidebar"
          className="w-full bg-transparent text-sm text-fd-foreground outline-none placeholder:text-fd-muted-foreground"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ('')}
            aria-label="Clear filter"
            className="text-xs text-fd-muted-foreground transition-colors hover:text-fd-foreground"
          >
            Esc
          </button>
        )}
      </div>

      {/* Hides the tree for as long as there is a query. Scoped to the sidebar so
          it cannot leak into the mobile drawer's own copy of the tree. */}
      {query && (
        <style>{`#nd-sidebar [data-sidebar-tree] { display: none; }`}</style>
      )}

      {query && (
        <div className="flex flex-col gap-0.5">
          {hits.length === 0 ? (
            <p className="px-2 py-3 text-sm text-fd-muted-foreground">
              Nothing matches “{q}”.
            </p>
          ) : (
            hits.map(({ url, title }) => (
              <Link
                key={url}
                href={url}
                onClick={() => setQ('')}
                className="flex flex-col rounded-lg px-2 py-1.5 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground"
              >
                <span className="text-fd-foreground">{title}</span>
                <span className="truncate text-[11px] opacity-60">{url}</span>
              </Link>
            ))
          )}
          <p className="px-2 pt-2 text-[11px] text-fd-muted-foreground">
            Titles and paths only — press ⌘K to search page text.
          </p>
        </div>
      )}
    </div>
  );
}
