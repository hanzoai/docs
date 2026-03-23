<<<<<<< HEAD
import {
  type ComponentProps,
  createElement,
  type FC,
  type HTMLAttributes,
  type ReactNode,
  useMemo,
} from 'react';
import {
  type BaseLayoutProps,
  parseLayoutProps,
  renderTitleNav,
  useLinkItems,
} from '@/layouts/shared';
import {
  Sidebar,
  SidebarCollapseTrigger,
  SidebarContent,
  SidebarDrawer,
  SidebarLinkItem,
  SidebarPageTree,
  SidebarTrigger,
  SidebarViewport,
} from './sidebar';
import { TreeContextProvider } from '@/contexts/tree';
import { cn } from '@/utils/cn';
import { buttonVariants } from '@/components/ui/button';
import { Languages, Sidebar as SidebarIcon, X } from 'lucide-react';
import { LanguageToggle } from '@/layouts/shared/language-toggle';
import { ThemeToggle } from '@/layouts/shared/theme-toggle';
import type * as PageTree from '@hanzo/docs-core/page-tree';
=======
import type * as PageTree from '@hanzo/docs-core/page-tree';
import { type HTMLAttributes, useMemo } from 'react';
import type { SidebarProps, SidebarProviderProps } from './slots/sidebar';
>>>>>>> dev
import {
  type GetLayoutTabsOptions,
  type LayoutTab,
  type NavOptions,
  type BaseLayoutProps,
  getLayoutTabs,
} from '@/layouts/shared';
import { type DocsSlots, LayoutBody } from './client';

export interface DocsLayoutProps extends BaseLayoutProps {
  tree: PageTree.Root;
  tabs?: LayoutTab[] | GetLayoutTabsOptions | false;
  tabMode?: 'sidebar' | 'navbar';
  sidebar?: SidebarOptions;
  nav?: Nav;
  containerProps?: HTMLAttributes<HTMLDivElement>;
  slots?: Partial<DocsSlots>;
}

interface Nav extends NavOptions {
  mode?: 'top' | 'auto';
}

interface SidebarOptions extends SidebarProps, SidebarProviderProps {
  /**
   * @deprecated use layout-level `tabs` option instead.
   */
  tabs?: LayoutTab[] | GetLayoutTabsOptions | false;
}

export function DocsLayout({
  tree,
  tabMode = 'sidebar',
  sidebar: { tabs: defaultTabs, ...sidebarProps } = {},
  children,
  tabs = defaultTabs,
  ...props
}: DocsLayoutProps) {
  const resolvedTabs = useMemo(() => {
    if (Array.isArray(tabs)) {
      return tabs;
    }
    if (typeof tabs === 'object') {
      return getLayoutTabs(tree, tabs);
    }
    if (tabs !== false) {
      return getLayoutTabs(tree);
    }
    return [];
  }, [tabs, tree]);

  return (
    <LayoutBody tree={tree} tabs={resolvedTabs} tabMode={tabMode} sidebar={sidebarProps} {...props}>
      {children}
    </LayoutBody>
  );
}

export { useNotebookLayout, type DocsSlots } from './client';
