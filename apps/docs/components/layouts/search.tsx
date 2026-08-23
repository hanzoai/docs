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
} from '@hanzo/docs-base-ui/components/dialog/search';
import { useDocsSearch } from '@hanzo/docs/core/search/client';
import { useMemo, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@hanzo/docs-base-ui/components/ui/popover';
import { ArrowRight, Check, ChevronDown, Sparkle } from 'lucide-react';
import { buttonVariants } from '@hanzo/docs-base-ui/components/ui/button';
import { cn } from '@/lib/cn';
import { useTreeContext } from '@hanzo/docs-base-ui/contexts/tree';
import type { Item, Node } from '@hanzo/docs/core/page-tree';
import { useRouter } from 'next/navigation';

import { AGENT_SETUP_PROMPT } from '@/lib/agent-setup-prompt';

const items = [
  {
    name: 'All',
    value: undefined,
  },
  {
    name: 'Services',
    description: 'Hanzo Cloud services documentation',
    value: 'services',
  },
  {
    name: 'SDKs',
    description: 'Python, TypeScript, Go, Rust, and C SDKs',
    value: 'sdks',
  },
  {
    name: 'API',
    description: 'OpenAPI reference for all services',
    value: 'openapi',
  },
  {
    name: 'Products',
    description: 'Zen LM, Chat, MCP, Dev, ZAP',
    value: 'products',
  },
];

export default function CustomSearchDialog(props: SharedProps) {
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState<string | undefined>();
  const { search, setSearch, query } = useDocsSearch({
    type: 'flexsearch-static',
    from: '/api/search',
    tag,
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
  // ASKING IS A DIFFERENT INTENTION FROM FINDING, and until now only one of them
  // had a door. The field says "search or ask", full-text search matches TERMS,
  // and a question is mostly terms that are not in any page — measured, "api
  // key", "quickstart" and "kms" all return results while "how do I get an api
  // key" returns none. So the reader most in need of an answer got the emptiest
  // screen, under a label that had promised otherwise.
  //
  // The answer is not a chat surface bolted into this dialog. It is the one this
  // product already gives everywhere else: hand the question to the reader's own
  // agent, with the setup that points it at Hanzo's models and skills. Same
  // prompt as the Use Agent control, so there is one thing to keep true.
  const [asked, setAsked] = useState(false);
  const askAction = useMemo<SearchItemType | undefined>(() => {
    const q = search.trim();
    if (q.length < 3) return;
    return {
      id: 'ask-agent',
      type: 'action',
      node: (
        <div className="inline-flex items-center gap-2 text-fd-muted-foreground">
          {asked ? <Check className="size-4" /> : <Sparkle className="size-4" />}
          <p>
            {asked ? (
              'Copied — paste it into your agent'
            ) : (
              <>
                Ask an agent<span className="font-medium text-fd-foreground"> “{q}”</span>
              </>
            )}
          </p>
        </div>
      ),
      onSelect: () => {
        void navigator.clipboard
          .writeText(
            `${AGENT_SETUP_PROMPT}\n\n---\n\nThen answer this using the Hanzo documentation at ` +
              `https://docs.hanzo.ai, and use the Hanzo skills at https://hanzoskills.com for any ` +
              `capability it touches:\n\n${q}`,
          )
          .then(() => setAsked(true));
      },
    };
  }, [asked, search]);

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
            query.data !== 'empty' || pageTreeAction || askAction
              ? [
                  ...(pageTreeAction ? [pageTreeAction] : []),
                  ...(Array.isArray(query.data) ? query.data : []),
                  // LAST, always. A question is the fallback when the terms did
                  // not land, not a competitor to a page that did.
                  ...(askAction ? [askAction] : []),
                ]
              : null
          }
        />
        <SearchDialogFooter className="flex flex-row flex-wrap gap-2 items-center">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              className={buttonVariants({
                size: 'sm',
                color: 'ghost',
                className: '-m-1.5 me-auto',
              })}
            >
              <span className="text-fd-muted-foreground/80 me-2">Filter</span>
              {items.find((item) => item.value === tag)?.name}
              <ChevronDown className="size-3.5 text-fd-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col p-1 gap-1" align="start">
              {items.map((item, i) => {
                const isSelected = item.value === tag;

                return (
                  <button
                    key={i}
                    onClick={() => {
                      setTag(item.value);
                      setOpen(false);
                    }}
                    className={cn(
                      'rounded-lg text-start px-2 py-1.5',
                      isSelected
                        ? 'text-fd-primary bg-fd-primary/10'
                        : 'hover:text-fd-accent-foreground hover:bg-fd-accent',
                    )}
                  >
                    <p className="font-medium mb-0.5">{item.name}</p>
                    <p className="text-xs opacity-70">{item.description}</p>
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>
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
