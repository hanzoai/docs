'use client';

import { Search } from 'lucide-react';
import { useSearchContext } from '@hanzo/docs-base-ui/contexts/search';

/**
 * The one way to search, at the top of the sidebar.
 *
 * This slot used to hold a filter that matched page titles and URLs offline and
 * stood in place of the tree. It was a second search that could not find what
 * the first one could: a reader who remembered a sentence rather than a title
 * got nothing, with no hint that full text lived somewhere else.
 *
 * So it is not a second search any more — it is the same dialog ⌘K opens,
 * wearing the shape of a field. Full text, every page, and the AI answer on the
 * same surface, because "find the page" and "answer my question" are one
 * intention and the reader should not have to pick a mode before they know
 * which one they wanted.
 *
 * It renders as a BUTTON, not an input. An input would take focus and swallow
 * the first keystrokes before the dialog mounted, and a field you cannot type
 * into is worse than a button that looks like one.
 */
export function SidebarSearch() {
  const { setOpenSearch } = useSearchContext();

  return (
    <button
      type="button"
      onClick={() => setOpenSearch(true)}
      // Icon, label, shortcut. The label used to claim the middle with `flex-1`;
      // the middle track claims it now, so the label is just text and the two
      // fixed ends cannot be squeezed by it.
      className="w-full rounded-lg border bg-fd-secondary/50 px-2.5 py-1.5 text-start transition-colors hover:bg-fd-accent"
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto minmax(0, 1fr) auto',
        alignItems: 'center',
        columnGap: 8,
      }}
    >
      <Search className="size-4 text-fd-muted-foreground" />
      <span className="text-sm text-fd-muted-foreground">Search or ask AI</span>
      <kbd className="rounded border px-1.5 py-0.5 text-[10px] text-fd-muted-foreground">⌘K</kbd>
    </button>
  );
}
