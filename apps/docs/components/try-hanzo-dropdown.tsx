'use client';

import {
  Sparkles,
  Code,
  Zap,
  Eye,
  MessageCircle,
  Terminal,
  Monitor,
  ChevronDown,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const zenModels = [
  {
    name: 'Zen4 Max',
    tag: 'Frontier',
    description: 'Reasoning, analysis, agentic coding',
    icon: Sparkles,
    href: 'https://cloud.hanzo.ai',
  },
  {
    name: 'Zen4 Coder',
    tag: 'Code',
    description: 'Code generation, review, debugging',
    icon: Code,
    href: 'https://cloud.hanzo.ai',
  },
  {
    name: 'Zen4 Mini',
    tag: 'Fast',
    description: 'Ultra-fast — $5 free credit on signup',
    icon: Zap,
    href: 'https://cloud.hanzo.ai',
  },
  {
    name: 'Zen3 Omni',
    tag: 'Multimodal',
    description: 'Text, vision, audio in one model',
    icon: Eye,
    href: 'https://cloud.hanzo.ai',
  },
];

const products = [
  { label: 'Hanzo Chat', description: 'Chat with 14 Zen + 100+ models', href: 'https://hanzo.chat', icon: MessageCircle },
  { label: 'Hanzo Dev', description: 'AI coding agent for your IDE', href: 'https://hanzo.ai/dev', icon: Terminal },
  { label: 'Console', description: 'Keys, usage, billing', href: 'https://console.hanzo.ai', icon: Monitor },
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
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black hover:bg-neutral-200 transition-colors"
      >
        Try Zen
        <ChevronDown
          className={`size-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[380px] rounded-2xl border border-[#262626] bg-[#111111]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Zen Models */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] font-semibold text-[#666] uppercase tracking-wider">
                Zen AI Models
              </span>
              <a
                href="https://zenlm.org"
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => setOpen(false)}
                className="text-[10px] text-[#525252] hover:text-white transition-colors"
              >
                All 44 models &rarr;
              </a>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {zenModels.map((model) => (
                <a
                  key={model.name}
                  href={model.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => setOpen(false)}
                  className="group flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                    <model.icon className="size-3.5 text-[#666] group-hover:text-white transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-medium text-[#fafafa]">{model.name}</span>
                      <span className="text-[9px] font-semibold tracking-wider uppercase text-[#525252] bg-white/[0.06] px-1 py-px rounded">
                        {model.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#525252] leading-tight mt-0.5">{model.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-[#1a1a1a]" />

          {/* Products */}
          <div className="p-3">
            <div className="px-1 mb-1.5">
              <span className="text-[10px] font-semibold text-[#666] uppercase tracking-wider">
                Products
              </span>
            </div>
            {products.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-white/[0.06] transition-colors group"
              >
                <item.icon className="size-4 text-[#525252] shrink-0 group-hover:text-white transition-colors" />
                <div className="flex-1 min-w-0">
                  <span className="text-[13px] font-medium text-[#fafafa]">{item.label}</span>
                  <span className="text-[11px] text-[#525252] ml-2">{item.description}</span>
                </div>
                <ExternalLink className="size-3 text-[#333] shrink-0" />
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="p-3 pt-0">
            <a
              href="https://console.hanzo.ai"
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-colors"
            >
              Get API Key — $5 free credit
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
