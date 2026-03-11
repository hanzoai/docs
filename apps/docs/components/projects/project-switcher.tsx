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
} from '@/components/ui/select';

interface DocSection {
  name: string;
  route: string;
  /** true = has deep subpages (full doc section) */
  deep?: boolean;
}

interface SectionGroup {
  label: string;
  items: DocSection[];
}

const SECTIONS: SectionGroup[] = [
  {
    label: 'AI & Intelligence',
    items: [
      { name: 'Cloud',       route: '/docs/services/cloud',     deep: true },
      { name: 'Chat',        route: '/docs/services/chat' },
      { name: 'Search',      route: '/docs/services/search' },
      { name: 'Bot',         route: '/docs/services/bot' },
      { name: 'Studio',      route: '/docs/services/studio' },
      { name: 'Nexus',       route: '/docs/services/nexus' },
      { name: 'Vector',      route: '/docs/services/vector' },
      { name: 'ML',          route: '/docs/services/ml' },
    ],
  },
  {
    label: 'Automation',
    items: [
      { name: 'Flow',        route: '/docs/services/flow' },
      { name: 'Auto',        route: '/docs/services/auto' },
      { name: 'Operative',   route: '/docs/services/operative' },
    ],
  },
  {
    label: 'Business',
    items: [
      { name: 'Commerce',    route: '/docs/services/commerce',  deep: true },
      { name: 'Sign',        route: '/docs/services/sign' },
      { name: 'Dataroom',    route: '/docs/services/dataroom' },
      { name: 'Cap Table',   route: '/docs/services/captable' },
    ],
  },
  {
    label: 'Platform',
    items: [
      { name: 'IAM',         route: '/docs/services/iam',       deep: true },
      { name: 'KMS',         route: '/docs/services/kms',       deep: true },
      { name: 'Platform',    route: '/docs/services/platform',  deep: true },
      { name: 'Identity',    route: '/docs/services/identity' },
      { name: 'DID',         route: '/docs/services/did' },
      { name: 'Gateway',     route: '/docs/services/gateway' },
      { name: 'Guard',       route: '/docs/services/guard' },
      { name: 'Console',     route: '/docs/services/console' },
      { name: 'MPC',         route: '/docs/services/mpc',       deep: true },
      { name: 'Insights',    route: '/docs/services/insights',  deep: true },
    ],
  },
  {
    label: 'Infrastructure',
    items: [
      { name: 'Ingress',     route: '/docs/services/ingress' },
      { name: 'PaaS',        route: '/docs/services/paas' },
      { name: 'S3',          route: '/docs/services/s3' },
      { name: 'DB',          route: '/docs/services/db' },
      { name: 'ORM',         route: '/docs/services/orm',       deep: true },
      { name: 'KV',          route: '/docs/services/kv' },
      { name: 'MQ',          route: '/docs/services/mq' },
      { name: 'Stream',      route: '/docs/services/stream' },
      { name: 'PubSub',      route: '/docs/services/pubsub' },
      { name: 'Edge',        route: '/docs/services/edge' },
      { name: 'Registry',    route: '/docs/services/registry' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { name: 'Engine',      route: '/docs/services/engine' },
      { name: 'O11y',        route: '/docs/services/o11y' },
      { name: 'Status',      route: '/docs/services/status',    deep: true },
      { name: 'DNS',         route: '/docs/services/dns' },
      { name: 'Zero Trust',  route: '/docs/services/zt' },
    ],
  },
  {
    label: 'Products',
    items: [
      { name: 'Hanzo Chat',  route: '/docs/chat' },
      { name: 'Hanzo Dev',   route: '/docs/dev' },
      { name: 'Hanzo Studio',route: '/docs/studio' },
      { name: 'LLM Gateway', route: '/docs/llm' },
      { name: 'MCP',         route: '/docs/mcp' },
      { name: 'ZAP',         route: '/docs/zap' },
    ],
  },
  {
    label: 'Reference',
    items: [
      { name: 'API Reference', route: '/docs/openapi' },
      { name: 'SDKs',          route: '/docs/sdks' },
      { name: 'Open Source',    route: '/docs/projects' },
    ],
  },
];

/** Flatten all items for route matching */
const ALL_ITEMS = SECTIONS.flatMap((g) => g.items);

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
  const value = current?.route ?? '__all__';

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
        Docs
      </span>
      <Select
        value={value}
        onValueChange={(next) => {
          if (next && next !== '__all__') router.push(next);
          else if (next === '__all__') router.push('/docs/services');
        }}
      >
        <SelectTrigger aria-label="Section switcher">
          <LayoutGrid className="h-3.5 w-3.5 shrink-0 text-fd-muted-foreground mr-1.5" />
          <SelectValue placeholder="All Services" />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          <SelectItem value="__all__">All Services</SelectItem>
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
    </div>
  );
}
