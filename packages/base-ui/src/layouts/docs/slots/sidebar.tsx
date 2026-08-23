'use client';
import * as Base from '@/components/sidebar/base';
import { cn } from '@/utils/cn';
import { type ComponentProps, type ReactNode, useMemo, useRef, useState } from 'react';
import { cva } from 'class-variance-authority';
import {
  createPageTreeRenderer,
  type SidebarPageTreeComponents,
} from '@/components/sidebar/page-tree';
import { createLinkItemRenderer } from '@/components/sidebar/link-item';
import { buttonVariants } from '@/components/ui/button';
import { Check, ChevronDown, ChevronsUpDown, Languages, SidebarIcon } from 'lucide-react';
import { mergeRefs } from '@/utils/merge-refs';
import { useDocsLayout } from '../client';
import { LinkItem } from '@/layouts/shared';
import { isLayoutTabActive, type LayoutTab } from '@/layouts/shared';
import { usePathname } from '@hanzo/docs-core/framework';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Link from '@hanzo/docs-core/link';

const itemVariants = cva(
  'relative flex flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground wrap-anywhere [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        link: 'transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none data-[active=true]:bg-fd-primary/10 data-[active=true]:text-fd-primary data-[active=true]:hover:transition-colors',
        button:
          'transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none',
      },
      highlight: {
        true: "data-[active=true]:before:content-[''] data-[active=true]:before:bg-fd-primary data-[active=true]:before:absolute data-[active=true]:before:w-px data-[active=true]:before:inset-y-2.5 data-[active=true]:before:inset-s-2.5",
      },
    },
  },
);

export interface SidebarProps extends ComponentProps<'aside'> {
  components?: Partial<SidebarPageTreeComponents>;
  banner?: ReactNode;
  footer?: ReactNode;

  /**
   * Support collapsing the sidebar on desktop mode
   *
   * @defaultValue true
   */
  collapsible?: boolean;
}

export type SidebarProviderProps = Base.SidebarProviderProps;

export const { useSidebar } = Base;

export function SidebarProvider(props: SidebarProviderProps) {
  return <Base.SidebarProvider {...props} />;
}

export function Sidebar({ footer, banner, collapsible = true, components, ...rest }: SidebarProps) {
  const {
    menuItems,
    slots,
    props: { tabs, nav, tabMode },
  } = useDocsLayout();
  const iconLinks = menuItems.filter((item) => item.type === 'icon');
  const viewport = (
    <Base.SidebarViewport>
      {/* Marked so a sidebar filter can stand in for the tree while typing,
          instead of appearing above it and pushing it off screen. */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-0.5" data-sidebar-tree>
        {menuItems
          .filter((v) => v.type !== 'icon')
          .map((item, i, list) => (
            <SidebarLinkItem key={i} item={item} className={cn(i === list.length - 1 && 'mb-4')} />
          ))}
        <SidebarPageTree {...components} />
      </div>
    </Base.SidebarViewport>
  );

  return (
    <>
      <SidebarContent {...rest}>
        {/* gap-2, not the drawer's gap-3: this rail has a fixed height budget
            and the drawer does not, so a point spent here is a point the tree
            below never gets. */}
        <div className="grid grid-cols-[minmax(0,1fr)] gap-2 p-4 pb-2">
          <div className="flex">
            {slots.navTitle && (
              <slots.navTitle className="inline-flex text-[0.9375rem] items-center gap-2.5 font-medium me-auto" />
            )}
            {nav?.children}
            {collapsible && (
              <SidebarCollapseTrigger
                className={cn(
                  buttonVariants({
                    color: 'ghost',
                    size: 'icon-sm',
                    className: 'mb-auto text-fd-muted-foreground',
                  }),
                )}
              >
                <SidebarIcon />
              </SidebarCollapseTrigger>
            )}
          </div>
          {/* No search box here. This slot rendered a full "Search ⌘K" field while
              the header rendered a magnifier opening the SAME dialog — two controls
              for one job, a few inches apart, and the sidebar's copy cost a row of
              the one screen it gets. The dialog lives in the header; the sidebar's
              banner is free for a filter over the tree. The mobile drawer below
              keeps its own trigger, since it has no header to borrow from. */}
          {tabs.length > 0 && tabMode === 'auto' && <SidebarTabsDropdown tabs={tabs} />}
          {banner}
        </div>
        {viewport}
        {(slots.languageSelect || iconLinks.length > 0 || slots.themeSwitch || footer) && (
          <div className="grid grid-cols-[minmax(0,1fr)] p-4 pt-2">
            {slots.languageSelect && (
              <slots.languageSelect.root
                variant="secondary"
                className="text-fd-muted-foreground text-start justify-start bg-fd-secondary/50 mb-2"
              >
                <Languages className="size-4.5" />
                <slots.languageSelect.text />
                <ChevronDown className="ms-auto size-3.5" />
              </slots.languageSelect.root>
            )}
            {/* The pill is sized for icon links on the left with the theme switch
                pushed to the right edge. With no icon links configured, `ms-auto`
                still pushed the switch right but the border stayed full width —
                a wide empty box with one control clinging to its end. `empty:hidden`
                never caught it because the switch is a child. Shrink to fit when
                the switch is all there is. */}
            <div
              className={cn(
                'flex text-fd-muted-foreground items-center border bg-fd-secondary/50 p-0.5 pe-0 rounded-lg empty:hidden',
                iconLinks.length === 0 && 'w-fit ms-auto',
              )}
            >
              {iconLinks.map((item, i) => (
                <LinkItem
                  key={i}
                  item={item}
                  className={cn(buttonVariants({ size: 'icon-sm', color: 'ghost' }))}
                  aria-label={item.label}
                >
                  {item.icon}
                </LinkItem>
              ))}
              {slots.themeSwitch && (
                <slots.themeSwitch className="px-1 py-0 border-y-0 border-e-0 rounded-none ms-auto *:rounded-md" />
              )}
            </div>
            {footer}
          </div>
        )}
      </SidebarContent>
      <SidebarDrawer>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-3 p-4 pb-2">
          <div className="flex text-fd-muted-foreground items-center gap-1.5">
            <div className="flex flex-1">
              {iconLinks.map((item, i) => (
                <LinkItem
                  key={i}
                  item={item}
                  className={cn(
                    buttonVariants({
                      size: 'icon-sm',
                      color: 'ghost',
                      className: 'p-2',
                    }),
                  )}
                  aria-label={item.label}
                >
                  {item.icon}
                </LinkItem>
              ))}
            </div>
            {slots.languageSelect && (
              <slots.languageSelect.root>
                <Languages className="size-4.5" />
                <slots.languageSelect.text />
              </slots.languageSelect.root>
            )}
            {slots.themeSwitch && <slots.themeSwitch className="p-0" />}
            <SidebarTrigger
              className={cn(
                buttonVariants({
                  color: 'ghost',
                  size: 'icon-sm',
                  className: 'p-2',
                }),
              )}
            >
              <SidebarIcon />
            </SidebarTrigger>
          </div>
          {tabs.length > 0 && <SidebarTabsDropdown tabs={tabs} />}
          {banner}
        </div>
        {viewport}
        <div className="grid grid-cols-[minmax(0,1fr)] border-t p-4 pt-2 empty:hidden">
          {footer}
        </div>
      </SidebarDrawer>
    </>
  );
}

function SidebarFolder(props: ComponentProps<typeof Base.SidebarFolder>) {
  return <Base.SidebarFolder {...props} />;
}

function SidebarCollapseTrigger(props: ComponentProps<typeof Base.SidebarCollapseTrigger>) {
  return <Base.SidebarCollapseTrigger {...props} />;
}

export function SidebarTrigger(props: ComponentProps<'button'>) {
  return <Base.SidebarTrigger {...props} />;
}

function SidebarContent({ ref: refProp, className, children, ...props }: ComponentProps<'aside'>) {
  const ref = useRef<HTMLElement>(null);

  return (
    <Base.SidebarContent>
      {({ collapsed, hovered, ref: asideRef, ...rest }) => (
        <>
          <div
            data-sidebar-placeholder=""
            className="sticky top-(--fd-docs-row-1) z-20 [grid-area:sidebar] pointer-events-none *:pointer-events-auto h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] md:layout:[--fd-sidebar-width:232px] max-md:hidden"
          >
            {collapsed && <div className="absolute inset-s-0 inset-y-0 w-4" {...rest} />}
            <aside
              id="nd-sidebar"
              ref={mergeRefs(ref, refProp, asideRef)}
              data-collapsed={collapsed}
              data-hovered={collapsed && hovered}
              className={cn(
                // No cross-axis alignment: the column IS --fd-sidebar-width now,
                // so the nav fills it. `items-end` used to push the nav to the
                // inner edge of a column that grew with the viewport, which is
                // what left a widening empty strip inside the rail's own card.
                //
                // THREE rows: the banner, the tree, the footer. The rail has a
                // definite height (inset-y-0), and the tree is the one region
                // that absorbs whatever the other two leave — so it is the only
                // row that is 1fr, and minmax(0,…) lets it be shorter than its
                // own content, which is what makes its scroller scroll.
                //
                // As a flex column this was stated on the CHILD instead:
                // SidebarViewport carries `min-h-0 flex-1`. That reads as a
                // property of the viewport when it is really a fact about this
                // rail, and it is invisible from here — the row model says it
                // where the rows are. The `flex-1` is inert under grid and stays
                // only because SidebarViewport is shared with the notebook and
                // flux layouts, which are still flex columns; `min-h-0` is still
                // load-bearing there and harmless here.
                //
                // The footer row is conditional (it renders only when there is a
                // language select, icon links, a theme switch or a footer). An
                // absent third child leaves row 3 at `auto`, which is zero — the
                // first two rows are unaffected either way.
                //
                // The rows have to be NAMED. Left implicit, all three are `auto`
                // and grid's default `align-content: stretch` splits the rail's
                // leftover height equally between them — measured at 600px with
                // a three-item tree, 193/213/193 instead of 44/512/44, so the
                // banner and the footer each stand four times their own content.
                // It only misbehaves when the tree is SHORT: at 40 items the two
                // spellings are identical, which is how it would have passed a
                // casual look and shipped.
                'absolute grid grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)_auto] w-full inset-s-0 inset-y-0 bg-fd-card text-sm border-e duration-250 *:w-(--fd-sidebar-width)',
                collapsed && [
                  'inset-y-2 rounded-xl transition-transform border w-(--fd-sidebar-width)',
                  hovered
                    ? 'shadow-lg translate-x-2 rtl:-translate-x-2'
                    : '-translate-x-(--fd-sidebar-width) rtl:translate-x-full',
                ],
                ref.current &&
                  (ref.current.getAttribute('data-collapsed') === 'true') !== collapsed &&
                  'transition-[width,inset-block,translate,background-color]',
                className,
              )}
              {...props}
              {...rest}
            >
              {children}
            </aside>
          </div>
          <div
            data-sidebar-panel=""
            className={cn(
              // Above the header (z-30), not under it. This floats at inset-s-4
              // and is 66px wide, so it reaches x=82; the header's grid column
              // starts where the leading gutter ends, which on a collapsed rail
              // is x=60. At z-10 the header's blurred ground painted over the
              // last 22px and cut the search trigger in half.
              'fixed flex top-[calc(--spacing(4)+var(--fd-docs-row-3))] inset-s-4 shadow-lg transition-opacity rounded-xl p-0.5 border bg-fd-muted text-fd-muted-foreground z-40',
              (!collapsed || hovered) && 'pointer-events-none opacity-0',
            )}
          >
            <Base.SidebarCollapseTrigger
              className={cn(
                buttonVariants({
                  color: 'ghost',
                  size: 'icon-sm',
                  className: 'rounded-lg',
                }),
              )}
            >
              <SidebarIcon />
            </Base.SidebarCollapseTrigger>
          </div>
        </>
      )}
    </Base.SidebarContent>
  );
}

function SidebarDrawer({
  children,
  className,
  ...props
}: ComponentProps<typeof Base.SidebarDrawerContent>) {
  return (
    <>
      <Base.SidebarDrawerOverlay className="fixed z-40 inset-0 backdrop-blur-xs data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out" />
      <Base.SidebarDrawerContent
        className={cn(
          // Same three rows as the desktop rail, and for the same reason: a
          // definite height (inset-y-0) with one region — the tree — absorbing
          // the leftover. Here all three children always render, so the row
          // model is exact.
          'fixed text-[0.9375rem] grid grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)_auto] shadow-lg border-s inset-e-0 inset-y-0 w-[85%] max-w-[380px] z-40 bg-fd-background data-[state=open]:animate-fd-sidebar-in data-[state=closed]:animate-fd-sidebar-out',
          className,
        )}
        {...props}
      >
        {children}
      </Base.SidebarDrawerContent>
    </>
  );
}

function SidebarSeparator({ className, style, children, ...props }: ComponentProps<'p'>) {
  const depth = Base.useFolderDepth();

  return (
    <Base.SidebarSeparator
      className={cn(
        // mt-3, not mt-6: 24px above a 20px label is more air than the label is
        // tall, and a tree pays it once per group.
        'inline-flex items-center gap-2 mb-1 px-2 mt-3 empty:mb-0 [&_svg]:size-4 [&_svg]:shrink-0',
        // A HEADING IS NOT A ROW, and the tree has to say which without being
        // read. Both used to be sentence-case text at the same size, separated
        // only by an icon each carried — so a row with an icon and a heading with
        // one were the same shape, and the reader counted indentation to tell
        // them apart. Uppercase, tracked, smaller and muted is the label register
        // every docs tree uses for exactly this, and it costs the heading nothing:
        // it was never something you click.
        'text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-fd-muted-foreground',
        depth === 0 && 'first:mt-0',
        className,
      )}
      style={{
        paddingInlineStart: getItemOffset(depth),
        ...style,
      }}
      {...props}
    >
      {children}
    </Base.SidebarSeparator>
  );
}

function SidebarItem({
  className,
  style,
  children,
  ...props
}: ComponentProps<typeof Base.SidebarItem>) {
  const depth = Base.useFolderDepth();

  return (
    <Base.SidebarItem
      className={cn(itemVariants({ variant: 'link', highlight: depth >= 1 }), className)}
      style={{
        paddingInlineStart: getItemOffset(depth),
        ...style,
      }}
      {...props}
    >
      {children}
    </Base.SidebarItem>
  );
}

function SidebarFolderTrigger({
  className,
  style,
  ...props
}: ComponentProps<typeof Base.SidebarFolderTrigger>) {
  const { depth, collapsible } = Base.useFolder()!;

  return (
    <Base.SidebarFolderTrigger
      className={(state) =>
        cn(
          itemVariants({ variant: collapsible ? 'button' : null }),
          'w-full',
          typeof className === 'function' ? className(state) : className,
        )
      }
      style={{
        paddingInlineStart: getItemOffset(depth - 1),
        ...style,
      }}
      {...props}
    >
      {props.children}
    </Base.SidebarFolderTrigger>
  );
}

function SidebarFolderLink({
  className,
  style,
  ...props
}: ComponentProps<typeof Base.SidebarFolderLink>) {
  const depth = Base.useFolderDepth();

  return (
    <Base.SidebarFolderLink
      className={cn(itemVariants({ variant: 'link', highlight: depth > 1 }), 'w-full', className)}
      style={{
        paddingInlineStart: getItemOffset(depth - 1),
        ...style,
      }}
      {...props}
    >
      {props.children}
    </Base.SidebarFolderLink>
  );
}

function SidebarFolderContent({
  className,
  children,
  ...props
}: ComponentProps<typeof Base.SidebarFolderContent>) {
  const depth = Base.useFolderDepth();

  return (
    <Base.SidebarFolderContent
      className={(state) =>
        cn(
          'relative grid grid-cols-[minmax(0,1fr)] gap-0.5 pt-0.5',
          depth === 1 &&
            "before:content-[''] before:absolute before:w-px before:inset-y-1 before:bg-fd-border before:inset-s-2.5",
          typeof className === 'function' ? className(state) : className,
        )
      }
      {...props}
    >
      {children}
    </Base.SidebarFolderContent>
  );
}

function SidebarTabsDropdown({
  tabs,
  placeholder,
  ...props
}: {
  placeholder?: ReactNode;
  tabs: LayoutTab[];
} & ComponentProps<'button'>) {
  const [open, setOpen] = useState(false);
  const { closeOnRedirect } = useSidebar();
  const pathname = usePathname();

  const selected = useMemo(() => {
    return tabs.findLast((item) => isLayoutTabActive(item, pathname));
  }, [tabs, pathname]);

  const onClick = () => {
    closeOnRedirect.current = false;
    setOpen(false);
  };

  const item = selected ? (
    <>
      <div className="size-9 shrink-0 empty:hidden md:size-5">{selected.icon}</div>
      <div>
        <p className="text-sm font-medium">{selected.title}</p>
        <p className="text-sm text-fd-muted-foreground empty:hidden md:hidden">
          {selected.description}
        </p>
      </div>
    </>
  ) : (
    placeholder
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {item && (
        <PopoverTrigger
          {...props}
          className={cn(
            'flex items-center gap-2 rounded-lg p-2 border bg-fd-secondary/50 text-start text-fd-secondary-foreground transition-colors hover:bg-fd-accent data-[state=open]:bg-fd-accent data-[state=open]:text-fd-accent-foreground',
            props.className,
          )}
        >
          {item}
          <ChevronsUpDown className="shrink-0 ms-auto size-4 text-fd-muted-foreground" />
        </PopoverTrigger>
      )}
      <PopoverContent className="grid grid-cols-[minmax(0,1fr)] gap-1 w-(--anchor-width) p-1 fd-scroll-container">
        {tabs.map((item) => {
          const isActive = selected && item.url === selected.url;
          if (!isActive && item.unlisted) return;

          return (
            <Link
              key={item.url}
              href={item.url}
              onClick={onClick}
              {...item.props}
              className={cn(
                'flex items-center justify-start text-start gap-2 rounded-lg p-1.5 hover:bg-fd-accent hover:text-fd-accent-foreground',
                item.props?.className,
              )}
            >
              <div className="shrink-0 size-9 md:mb-auto md:size-5">{item.icon}</div>
              <div>
                <p className="text-sm font-medium leading-none">{item.title}</p>
                <p className="text-[0.8125rem] text-fd-muted-foreground mt-1 empty:hidden">
                  {item.description}
                </p>
              </div>

              <Check
                className={cn(
                  'shrink-0 ms-auto size-3.5 text-fd-primary',
                  !isActive && 'invisible',
                )}
              />
            </Link>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

function getItemOffset(depth: number) {
  return `calc(${2 + 3 * depth} * var(--spacing))`;
}

const SidebarPageTree = createPageTreeRenderer({
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem,
  SidebarSeparator,
});

const SidebarLinkItem = createLinkItemRenderer({
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem,
});
