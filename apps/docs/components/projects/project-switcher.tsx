'use client';

import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@hanzo/docs-base-ui/components/ui/select';

import { SECTIONS, type DocSection, type SectionGroup } from '@/generated/sections';

/** Flatten all items for route matching */
const ALL_ITEMS = SECTIONS.flatMap((g) => g.items);

/** The value held when the path matches no section. A select needs a value, so
 *  "everything" is a sentinel rather than null. */
const ALL = '__all__';

/** value -> label, the whole vocabulary of this switcher. Base UI resolves the
 *  trigger's text from `items`; given no map it prints the value itself, which
 *  is how every docs page came to show `__all__` where the section name goes. */
const LABELS: Record<string, string> = {
  [ALL]: 'All capabilities',
  ...Object.fromEntries(ALL_ITEMS.map((item) => [item.route, item.name])),
};

/** Deduplicate by route — keep first occurrence */
const DEDUPED_SECTIONS: SectionGroup[] = (() => {
  const seen = new Set<string>();
  return SECTIONS.map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      if (seen.has(item.route)) return false;
      seen.add(item.route);
      return true;
    }),
  })).filter((g) => g.items.length > 0);
})();

function findCurrentSection(pathname: string): DocSection | null {
  let best: DocSection | null = null;
  for (const item of ALL_ITEMS) {
    if (pathname.startsWith(item.route)) {
      if (!best || item.route.length > best.route.length) {
        best = item;
      }
    }
  }
  return best;
}

export function ProjectSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const current = findCurrentSection(pathname ?? '');
  const value = current?.route ?? ALL;

  // No eyebrow above the trigger: it read "Docs" inside the docs sidebar, over a
  // control that now names the section itself.
  return (
    <Select
      items={LABELS}
      value={value}
      onValueChange={(next) => {
        if (next && next !== ALL) router.push(next);
        else if (next === ALL) router.push('/docs/openapi');
      }}
    >
      <SelectTrigger aria-label="Section switcher">
        <LayoutGrid className="h-3.5 w-3.5 shrink-0 text-fd-muted-foreground mr-1.5" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        <SelectItem value={ALL}>{LABELS[ALL]}</SelectItem>
        {DEDUPED_SECTIONS.map((group, idx) => (
          <SelectGroup key={group.label}>
            {idx > 0 && <SelectSeparator />}
            <SelectLabel>{group.label}</SelectLabel>
            {group.items.map((item) => (
              <SelectItem key={item.route} value={item.route}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
