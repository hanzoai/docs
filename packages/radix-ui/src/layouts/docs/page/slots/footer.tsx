'use client';

import { useTranslations } from '@/contexts/i18n';
import { cn } from '@/utils/cn';
import { isActive } from '@/utils/urls';
import { useFooterItems } from '@/utils/use-footer-items';
import { usePathname } from '@hanzo/docs-core/framework';
import Link from '@hanzo/docs-core/link';
import type * as PageTree from '@hanzo/docs-core/page-tree';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type ComponentProps, useMemo } from 'react';

type Item = Pick<PageTree.Item, 'name' | 'description' | 'url'>;

export interface FooterProps extends ComponentProps<'div'> {
  /**
   * Items including information for the next and previous page
   */
  items?: {
    previous?: Item;
    next?: Item;
  };
}

export function Footer({ items, children, className, ...props }: FooterProps) {
  const footerList = useFooterItems();
  const pathname = usePathname();
  const { previous, next } = useMemo(() => {
    if (items) return items;

    const idx = footerList.findIndex((item) => isActive(item.url, pathname));

    if (idx === -1) return {};
    return {
      previous: footerList[idx - 1],
      next: footerList[idx + 1],
    };
  }, [footerList, items, pathname]);

  return (
    <>
      <div
        className={cn(
          // One track statement replaces three rules that all said the same
          // thing in different places: a container query on this element, a
          // column count picked in JS from how many links exist, and a
          // `@max-lg:col-span-full` on the card to undo the count again when
          // the container got narrow.
          //
          // auto-fit measures the COLUMN, so it needs none of them. Two links
          // sit side by side wherever two 16rem columns fit and stack where
          // they do not; one link collapses the empty track and takes the full
          // width on its own. `min(100%,16rem)` keeps the floor from
          // overflowing a container narrower than the floor itself.
          'grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))]',
          className,
        )}
        {...props}
      >
        {previous && <FooterItem item={previous} index={0} />}
        {next && <FooterItem item={next} index={1} />}
      </div>
      {children}
    </>
  );
}

function FooterItem({ item, index }: { item: Item; index: 0 | 1 }) {
  const t = useTranslations();
  const Icon = index === 0 ? ChevronLeft : ChevronRight;

  return (
    <Link
      href={item.url}
      className={cn(
        // The column is stated rather than left implicit, so the track cannot be
        // floored at the min-content width of whatever a caller puts in here.
        //
        // It is NOT what saves the truncating description below — measured, a
        // bare `grid` ellipsises that line just as well, because `truncate`
        // carries `overflow: hidden` and a scroll container contributes zero
        // min-content width. The guard is for the siblings that have no
        // overflow of their own.
        'grid grid-cols-[minmax(0,1fr)] gap-2 rounded-lg border p-4 text-sm transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground',
        index === 1 && 'text-end',
      )}
    >
      <div
        className={cn(
          'inline-flex items-center gap-1.5 font-medium',
          index === 1 && 'flex-row-reverse',
        )}
      >
        <Icon className="-mx-1 size-4 shrink-0 rtl:rotate-180" />
        <p>{item.name}</p>
      </div>
      <p className="text-fd-muted-foreground truncate">
        {item.description ?? (index === 0 ? t.previousPage : t.nextPage)}
      </p>
    </Link>
  );
}
