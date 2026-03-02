'use client';

import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SearchItemType,
  type SharedProps,
} from '@hanzo/docs/ui/components/dialog/search';
import { useDocsSearch } from '@hanzo/docs/core/search/client';
import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTreeContext } from '@hanzo/docs/ui/contexts/tree';
import type { Item, Node } from '@hanzo/docs/core/page-tree';
import { useRouter } from 'next/navigation';
import { publishableKey, searchEndpoint } from '@/lib/hanzo/client';

export default function CustomSearchDialog(props: SharedProps) {
  const { search, setSearch, query } = useDocsSearch({
    type: 'hanzo',
    apiKey: publishableKey,
    endpoint: searchEndpoint,
  });
  const { full } = useTreeContext();
  const router = useRouter();
  const searchMap = useMemo(() => {
    const map = new Map<string, Item>();

    function onNode(node: Node) {
      if (node.type === 'page' && typeof node.name === 'string') {
        map.set(node.name.toLowerCase(), node);
      } else if (node.type === 'folder') {
        if (node.index) onNode(node.index);
        for (const item of node.children) onNode(item);
      }
    }

    for (const item of full.children) onNode(item);
    return map;
  }, [full]);
  const pageTreeAction = useMemo<SearchItemType | undefined>(() => {
    if (search.length === 0) return;

    const normalized = search.toLowerCase();
    for (const [k, page] of searchMap) {
      if (!k.startsWith(normalized)) continue;

      return {
        id: 'quick-action',
        type: 'action',
        node: (
          <div className="inline-flex items-center gap-2 text-fd-muted-foreground">
            <ArrowRight className="size-4" />
            <p>
              Jump to <span className="font-medium text-fd-foreground">{page.name}</span>
            </p>
          </div>
        ),
        onSelect: () => router.push(page.url),
      };
    }
  }, [router, search, searchMap]);

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList
          items={
            query.data !== 'empty' || pageTreeAction
              ? [
                  ...(pageTreeAction ? [pageTreeAction] : []),
                  ...(Array.isArray(query.data) ? query.data : []),
                ]
              : null
          }
        />
        <SearchDialogFooter className="flex flex-row items-center justify-end">
          <a
            href="https://hanzo.ai"
            rel="noreferrer noopener"
            className="text-xs text-nowrap text-fd-muted-foreground"
          >
            Powered by Hanzo Search
          </a>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
