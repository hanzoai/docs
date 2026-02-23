'use client';

import {
  Cloud,
  MessageCircle,
  Sparkles,
  Code2,
  Activity,
  GitBranch,
  Server,
  Bot,
  Workflow,
  HardDrive,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';

interface Product {
  label: string;
  url: string;
  description: string;
  icon: LucideIcon;
}

interface Section {
  title: string;
  items: Product[];
}

const sections: Section[] = [
  {
    title: 'AI & Models',
    items: [
      {
        label: 'Hanzo Cloud',
        url: 'https://cloud.hanzo.ai',
        description: 'AI inference gateway',
        icon: Cloud,
      },
      {
        label: 'Hanzo Chat',
        url: 'https://hanzo.chat',
        description: 'AI chat interface',
        icon: MessageCircle,
      },
      {
        label: 'Zen Models',
        url: 'https://hanzo.ai/models',
        description: 'Frontier AI models',
        icon: Sparkles,
      },
    ],
  },
  {
    title: 'Developer Tools',
    items: [
      {
        label: 'Hanzo Dev',
        url: 'https://dev.hanzo.ai',
        description: 'AI coding workspace',
        icon: Code2,
      },
      {
        label: 'Hanzo Console',
        url: 'https://console.hanzo.ai',
        description: 'Observability & tracing',
        icon: Activity,
      },
      {
        label: 'Hanzo MCP',
        url: 'https://github.com/hanzoai/mcp',
        description: 'Model Context Protocol tools',
        icon: GitBranch,
      },
    ],
  },
  {
    title: 'Infrastructure',
    items: [
      {
        label: 'Hanzo Platform',
        url: 'https://platform.hanzo.ai',
        description: 'PaaS deployments',
        icon: Server,
      },
      {
        label: 'Hanzo Bot',
        url: 'https://hanzo.bot',
        description: 'AI assistant platform',
        icon: Bot,
      },
      {
        label: 'Hanzo Flow',
        url: 'https://flow.hanzo.ai',
        description: 'Workflow automation',
        icon: Workflow,
      },
      {
        label: 'Hanzo Space',
        url: 'https://hanzo.space',
        description: 'Object storage',
        icon: HardDrive,
      },
    ],
  },
];

export function TryHanzoDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 rounded-lg border border-[#fd4444]/30 px-3 py-1.5 text-sm font-medium text-[#fd4444] hover:bg-[#fd4444]/10 transition-colors"
      >
        Try Hanzo
        <ChevronDown
          className={`size-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-[#262626] bg-[#111111] p-2 shadow-xl">
          {sections.map((section, sectionIdx) => (
            <div key={section.title}>
              {sectionIdx > 0 && (
                <div className="mx-2 my-1.5 border-t border-[#262626]" />
              )}
              <div className="px-2.5 pt-2 pb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#525252]">
                  {section.title}
                </span>
              </div>
              {section.items.map((product) => (
                <a
                  key={product.url}
                  href={product.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-[#1a1a1a] transition-colors group"
                  onClick={() => setOpen(false)}
                >
                  <product.icon className="mt-0.5 size-4 text-[#a3a3a3] group-hover:text-[#fd4444] transition-colors shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-[#fafafa]">
                        {product.label}
                      </span>
                      <ExternalLink className="size-3 text-[#525252] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-[#a3a3a3] mt-0.5">
                      {product.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
