'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Text } from '@hanzo/gui';
import { Check, ChevronDown, Sparkle } from '@hanzogui/lucide-icons-2';
import { DropdownMenu } from '@hanzo/ui';
import { Action } from '@/components/action';
import { useShell } from '@/components/shell';
import { AGENT_SETUP_PROMPT } from '@/lib/agent-setup-prompt';
import { muted } from '@/lib/ink';
import { twinPath } from '@/lib/twin';

const SKILLS = 'https://hanzoskills.com';


function prompt(url: string) {
  return `${AGENT_SETUP_PROMPT}

---

Then read ${url} — that is the page I am on — and help me use it. Skills for every
Hanzo capability are published at ${SKILLS}.`;
}

/**
 * "Give this page to an agent", beside the page title: ours opened directly, or
 * the page handed to any agent as a prompt or as Markdown. Everything is derived
 * from the pathname, so it needs nothing from the page.
 */
export function Agent() {
  const pathname = usePathname();
  const { askAgent } = useShell();
  const [done, setDone] = useState(false);
  // Every page has a Markdown twin at `<page>.md` (scripts/twins.ts).
  const md = twinPath(pathname);
  const here = () => window.location.href;

  const copy = async (text: string | Promise<string>) => {
    await navigator.clipboard.writeText(await text);
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  };
  const go = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');
  const downloadMd = async () => {
    const text = await fetch(md).then((r) => r.text());
    const slug = (pathname.replace(/^\/+|\/+$/g, '').split('/').pop() || 'hanzo-docs') + '.md';
    const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = slug;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <DropdownMenu
      placement="bottom-end"
      minWidth={232}
      trigger={
        <Action tone="line" render="button" type="button" aria-label="Use this page with an agent">
          {done ? <Check size={14} color="$color11" /> : <Sparkle size={14} color="$color11" />}
          <Text fontSize="$2" lineHeight={18} fontWeight="500" {...muted} $max-sm={{ display: 'none' }}>
            {done ? 'Copied' : 'Use agent'}
          </Text>
          <ChevronDown size={12} color="$color10" />
        </Action>
      }
      items={[
        { type: 'label', label: 'Use with Hanzo' },
        {
          key: 'docs-agent',
          label: 'Ask Hanzo Agent about this page',
          onSelect: () => askAgent(`Summarize this page (${pathname}) and show me the quickest way to use it.`),
        },
        { key: 'app', label: 'Open in Hanzo App', onSelect: () => go('https://hanzo.app') },
        // `hanzo code` runs whichever coding backend the reader chose, in their
        // own terminal, so the command is copied rather than opened.
        { key: 'cli', label: 'Open in Hanzo CLI', description: 'Copies the command', onSelect: () => copy(`hanzo code ${JSON.stringify(prompt(here()))}`) },
        { type: 'separator' },
        { type: 'label', label: 'Use with any agent' },
        { key: 'prompt', label: 'Copy prompt', onSelect: () => copy(prompt(here())) },
        { key: 'copy', label: 'Copy page as Markdown', onSelect: () => copy(fetch(md).then((r) => r.text())) },
        { key: 'download', label: 'Download Markdown (.md)', onSelect: () => void downloadMd() },
        { key: 'view', label: 'View as Markdown', onSelect: () => window.location.assign(md) },
        { type: 'separator' },
        { key: 'chatgpt', label: 'Open in ChatGPT', onSelect: () => go(`https://chatgpt.com/?${new URLSearchParams({ hints: 'search', q: prompt(here()) })}`) },
        { key: 'claude', label: 'Open in Claude', onSelect: () => go(`https://claude.ai/new?${new URLSearchParams({ q: prompt(here()) })}`) },
        { type: 'separator' },
        { key: 'skills', label: 'Hanzo Skills', onSelect: () => go(SKILLS) },
      ]}
    />
  );
}
