import { BookOpen, Code2, FileJson2, Sparkles } from 'lucide-react';
import type { BaseLayoutProps, LinkItemType } from '@hanzo/docs/ui/layouts/shared';
import { HanzoDocsIcon } from '@/app/layout.client';

export const linkItems: LinkItemType[] = [
  {
    icon: <Sparkles />,
    text: 'Zen LM',
    url: '/docs/llm',
    active: 'nested-url',
  },
  {
    icon: <BookOpen />,
    text: 'Services',
    url: '/docs/services',
    active: 'nested-url',
  },
  {
    icon: <Code2 />,
    text: 'SDKs',
    url: '/docs/sdks',
    active: 'nested-url',
  },
  {
    icon: <FileJson2 />,
    text: 'API',
    url: '/docs/openapi',
    active: 'nested-url',
  },
];

export const logo = (
  <HanzoDocsIcon className="size-5" />
);

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          {logo}
          <span className="font-medium max-md:hidden">Hanzo</span>
        </>
      ),
    },
  };
}
