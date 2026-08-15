'use client';

import { useState } from 'react';
import { ChevronDown, LayoutGrid } from 'lucide-react';
import { MeetHanzoMenu } from '@hanzogui/shell';

/**
 * The one shared "Meet Hanzo" affordance — a nav trigger that opens the
 * universal <MeetHanzoMenu> (the ecosystem mega-menu driven by HANZO_FLAGSHIP +
 * MEET_HANZO_GROUPS). Replaces the bespoke try-hanzo-dropdown so docs discovers
 * the whole ecosystem the same way every other Hanzo property does.
 *
 * `anchor` (56px) matches the Fumadocs nav row height so the panel drops
 * flush beneath the header.
 */
// Keep the ecosystem menu's product items INSIDE the docs when we have a docs
// page for them — instead of bouncing out to the hanzo.ai marketing home. Maps
// the registry link id → its docs path; anything not listed keeps the canonical
// ecosystem link. Passed to MeetHanzoMenu's `resolveHref` (opt-in; a no-op on
// shell versions before that prop exists, so it's safe to ship ahead).
const DOCS_HREFS: Record<string, string> = {
  models: '/docs/services/models',
  enso: '/docs/services/models',
  agents: '/docs/agents',
  mcp: '/docs/mcp',
  gateway: '/docs/llm',
  api: '/docs/api',
  keys: '/docs/api-keys',
};

/**
 * `compact` collapses the trigger to its icon below `lg`.
 *
 * The docs header is a fixed 56px row that also carries search, Sign In and Get API
 * Key. Below `lg` a text label does not fit beside them: Get API Key wraps and spills
 * out of the bar at 834, and clips off the right edge at 768 (measured). So the label
 * earns its space by breakpoint. The accessible name stays "Hanzo" at every width —
 * only the glyph changes, so nothing is lost to a screen reader or a keyboard user.
 */
export function MeetHanzo({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const panelId = 'meet-hanzo-menu';

  return (
    <>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        aria-label="Hanzo"
        className={`inline-flex shrink-0 items-center gap-1 rounded-full text-sm font-medium text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground ${
          compact ? 'size-9 justify-center lg:size-auto lg:px-3 lg:py-1.5' : 'px-3 py-1.5'
        }`}
      >
        {compact && <LayoutGrid className="size-4 lg:hidden" aria-hidden />}
        <span className={compact ? 'hidden lg:inline' : undefined}>Hanzo</span>
        <ChevronDown
          aria-hidden
          className={`size-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''} ${
            compact ? 'hidden lg:inline-block' : ''
          }`}
        />
      </button>
      <MeetHanzoMenu
        id={panelId}
        open={open}
        onClose={() => setOpen(false)}
        anchor={56}
        resolveHref={(href, id) => DOCS_HREFS[id] ?? href}
      />
    </>
  );
}
