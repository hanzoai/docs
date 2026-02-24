'use client';

import {
  Cloud,
  MessageCircle,
  Activity,
  Bot,
  Workflow,
  Server,
  HardDrive,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const products = [
  {
    label: 'Hanzo Cloud',
    url: 'https://cloud.hanzo.ai',
    description: 'LLM inference gateway — 200+ models',
    icon: Cloud,
  },
  {
    label: 'Hanzo Chat',
    url: 'https://hanzo.chat',
    description: 'AI chat with multi-model support',
    icon: MessageCircle,
  },
  {
    label: 'Hanzo Console',
    url: 'https://console.hanzo.ai',
    description: 'Observability, tracing, and evals',
    icon: Activity,
  },
  {
    label: 'Hanzo Bot',
    url: 'https://hanzo.bot',
    description: '743+ skills, 35+ channel adapters',
    icon: Bot,
  },
  {
    label: 'Hanzo Flow',
    url: 'https://flow.hanzo.ai',
    description: 'Visual workflow automation',
    icon: Workflow,
  },
  {
    label: 'Hanzo Platform',
    url: 'https://platform.hanzo.ai',
    description: 'PaaS with Git push deploy',
    icon: Server,
  },
  {
    label: 'Hanzo Space',
    url: 'https://hanzo.space',
    description: 'S3-compatible object storage',
    icon: HardDrive,
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
        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-1.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
      >
        Try Hanzo
        <ChevronDown
          className={`size-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-[#262626] bg-[#111111] p-2 shadow-xl">
          {products.map((product) => (
            <a
              key={product.url}
              href={product.url}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-[#1a1a1a] transition-colors group"
              onClick={() => setOpen(false)}
            >
              <product.icon className="mt-0.5 size-4 text-[#666] group-hover:text-white transition-colors shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-[#fafafa]">
                    {product.label}
                  </span>
                  <ExternalLink className="size-3 text-[#525252] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-[#666] mt-0.5">
                  {product.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
