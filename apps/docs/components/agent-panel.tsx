'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Text, XStack, YStack } from '@hanzo/gui';
import {
  ArrowUp,
  BookOpen,
  Check,
  ChevronsRight,
  Copy,
  CreditCard,
  ExternalLink,
  Rocket,
  RotateCcw,
  Sparkle,
  Terminal,
  X,
} from '@hanzogui/lucide-icons-2';
import { Sheet, SheetContent, SheetTitle } from '@hanzo/ui';
import { HanzoMark } from '@hanzogui/shell';
import { Tool } from '@/components/action';
import { BAR, useShell } from '@/components/shell';
import { iam } from '@/lib/iam';
import { loud, muted } from '@/lib/ink';
import { twinPath } from '@/lib/twin';

export const AGENT_PANEL_WIDTH = 360;

interface Citation {
  title: string;
  url: string;
  excerpt?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  streaming?: boolean;
  mode?: 'live' | 'grounded';
}

const STARTERS = [
  {
    icon: Sparkle,
    question: 'What is Hanzo?',
  },
  {
    icon: Rocket,
    question: 'How do I deploy a GitHub repo?',
  },
  {
    icon: Terminal,
    question: 'How does Enso route models?',
  },
  {
    icon: CreditCard,
    question: 'How much does Hanzo cost?',
  },
] as const;

const KNOWLEDGE: Array<{
  keywords: string[];
  title: string;
  url: string;
  summary: string;
  code?: string;
}> = [
  {
    keywords: ['what is hanzo', 'overview', 'platform', 'operating system', 'start'],
    title: 'Hanzo Docs Overview',
    url: '/docs',
    summary:
      'Hanzo is the AI operating system for business — combining Enso (routing across 500+ models), Kai (zero-output-token decision model), Zen (open-weight frontier models), MCP tools, CLI, SDKs, and cloud deployments under one API key.',
    code: 'curl hanzo.sh | sh && hanzo auth login',
  },
  {
    keywords: ['deploy', 'button', 'badge', 'github', 'readme', 'vercel', 'clone', 'via', 'reward'],
    title: 'Deploy Button & GitHub Badges',
    url: '/docs/deploy-button',
    summary:
      'Add one-click 32px Deploy, Ask, and Edit buttons (plus 20px Shields/Colab badges and 495px GitHub profile charts) to any README. Point links at `https://hanzo.app/deploy?repository-url=<repo>&env=HANZO_API_KEY` or `https://hanzo.app/dev/open?repo=<owner/repo>&action=ask|edit`. Add `&via=<handle>` to earn up to 20% OSS contributor rewards.',
    code: '[![Deploy with Hanzo](https://hanzo.app/badges/deploy-button.svg)](https://hanzo.app/deploy?repository-url=https%3A%2F%2Fgithub.com%2Fhanzoai%2Fhanzo)',
  },
  {
    keywords: ['enso', 'route', 'model', 'models', 'zen', 'chat', 'completion', 'gateway'],
    title: 'Models & Enso Gateway',
    url: '/docs/models',
    summary:
      'Send `model: "auto"` (or any `enso-*`, `zen*`, Claude, GPT, or Gemini model ID) to `POST https://api.hanzo.ai/v1/chat/completions`. Enso selects the best model per request on one key and one bill.',
    code: 'curl https://api.hanzo.ai/v1/chat/completions -H "Authorization: Bearer $HANZO_API_KEY" -d \'{"model":"auto","messages":[{"role":"user","content":"Hello"}]}\'',
  },
  {
    keywords: ['kai', 'decision', 'jev', 'classify', 'triage', 'score', 'noul', 'choice'],
    title: 'Kai Decision Model',
    url: '/docs/guides/kai',
    summary:
      'Hanzo Kai (`POST https://api.hanzo.ai/v1/decisions`) returns calibrated probability distributions over bounded choices with 0 output tokens at $0.021 per million input tokens.',
  },
  {
    keywords: ['cost', 'price', 'pricing', 'credit', 'billing', 'free', 'usage', 'money'],
    title: 'Pricing & Credits',
    url: '/docs/pricing',
    summary:
      'Start free with one API key. You pay only for the models, decisions, and compute you use — Kai is $0.021/M input tokens (output free), and Enso passes through transparent per-model rates. Check balance via `hanzo billing balance` or `GET /v1/billing/balance`.',
  },
  {
    keywords: ['mcp', 'tool', 'tools', 'claude', 'cursor', 'ide', 'agent'],
    title: 'MCP Server & Tools',
    url: '/docs/mcp',
    summary:
      'Connect any MCP client with `npx -y hanzo mcp` (stdio) or `POST https://api.hanzo.ai/v1/mcp` (JSON-RPC) to access Hanzo’s 19 canonical tools across filesystem, code, git, browser, Kai, and cloud services.',
    code: 'npx -y hanzo mcp',
  },
  {
    keywords: ['key', 'api key', 'auth', 'login', 'sk-', 'pk-', 'verify', 'quickstart'],
    title: 'Quickstart & API Keys',
    url: '/docs/quickstart',
    summary:
      'Create an API key at platform.hanzo.ai/api-keys or run `hanzo auth login`. Use `sk-` keys on servers and `pk-` publishable keys in browsers. Verify credentials via `GET https://api.hanzo.ai/v1/account/keys`.',
  },
  {
    keywords: ['self-host', 'air-gap', 'docker', 'kubernetes', 'local', 'compose'],
    title: 'Self-Hosting & Air-Gapped',
    url: '/docs/self-hosting',
    summary:
      'Run the exact same Hanzo stack locally with `hanzo up` or on your own Kubernetes cluster, including local Zen open-weight models and air-gapped deployments.',
  },
];

function stripMarkdown(md: string): string {
  return md
    .replace(/^---[\s\S]*?---\s*/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function scoreKnowledge(query: string) {
  const lower = query.toLowerCase();
  const terms = lower.split(/[^a-z0-9-]+/).filter((t) => t.length >= 2);
  return KNOWLEDGE.map((entry) => {
    let score = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) score += 4;
      for (const t of terms) {
        if (kw.includes(t) || t.includes(kw)) score += 1;
      }
    }
    return { entry, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.entry);
}

async function fetchCurrentPageMarkdown(pathname: string): Promise<{ title: string; body: string } | null> {
  try {
    const res = await fetch(twinPath(pathname));
    if (!res.ok) return null;
    const text = await res.text();
    const titleMatch = text.match(/^title:\s*"?([^"\n]+)"?/m) ?? text.match(/^#\s+(.+)$/m);
    return {
      title: titleMatch?.[1]?.trim() || pathname,
      body: text.slice(0, 6000),
    };
  } catch {
    return null;
  }
}

/**
 * Integrated Hanzo Agent right-hand panel (modeled after Vercel Agent).
 *
 * - Desktop (>= 1024px): sticky right sidebar docked inside Shell beside the page.
 * - Mobile / tablet (< 1024px): responsive right Sheet drawer.
 * - Toggled from the top Bar's `Ask AI` button or `⌘I` / `Ctrl+I`.
 * - Streams live from `api.hanzo.ai` when signed in (or `/v1/chat` when hosted),
 *   and always falls back cleanly to grounded docs answers with clickable citations
 *   on static exports so it never hits an error dead end.
 */
export function AgentPanel() {
  const { agentOpen, setAgentOpen, pendingPrompt, consumePendingPrompt } = useShell();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  if (!agentOpen) return null;

  if (compact) {
    return (
      <Sheet open={agentOpen} onOpenChange={setAgentOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          p={0}
          gap={0}
          width="94%"
          maxW={420}
          rounded={0}
          borderWidth={0}
          borderLeftWidth={1}
          borderColor="$borderColor"
        >
          <SheetTitle position="absolute" width={1} height={1} overflow="hidden" opacity={0}>
            Hanzo Agent
          </SheetTitle>
          <AgentBody
            pendingPrompt={pendingPrompt}
            consumePendingPrompt={consumePendingPrompt}
            onClose={() => setAgentOpen(false)}
            mobile
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <YStack
      render="aside"
      data-docs-agent=""
      aria-label="Hanzo Agent"
      position="sticky"
      t={0}
      height="100dvh"
      maxH="100dvh"
      width={AGENT_PANEL_WIDTH}
      shrink={0}
      overflow="hidden"
      borderLeftWidth={1}
      borderColor="$borderColor"
      bg="$background"
    >
      <AgentBody
        pendingPrompt={pendingPrompt}
        consumePendingPrompt={consumePendingPrompt}
        onClose={() => setAgentOpen(false)}
      />
    </YStack>
  );
}

export function AgentBody({
  pendingPrompt,
  consumePendingPrompt,
  onClose,
  mobile = false,
  hideHeader = false,
  autoFocus = false,
}: {
  pendingPrompt: string | null;
  consumePendingPrompt: () => string | null;
  onClose: () => void;
  mobile?: boolean;
  hideHeader?: boolean;
  autoFocus?: boolean;
}) {
  const pathname = usePathname();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const scroller = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!autoFocus) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [autoFocus]);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = useCallback(
    async (raw: string) => {
      const question = raw.trim();
      if (!question || busy) return;

      setDraft('');
      setBusy(true);
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const userId = `u-${Date.now()}`;
      const botId = `a-${Date.now() + 1}`;
      const history = [...messages, { id: userId, role: 'user' as const, content: question }];
      setMessages([...history, { id: botId, role: 'assistant', content: '', streaming: true }]);

      const [pageDoc, matched] = await Promise.all([
        fetchCurrentPageMarkdown(pathname),
        Promise.resolve(scoreKnowledge(question)),
      ]);

      const citations: Citation[] = [];
      for (const m of matched) {
        citations.push({ title: m.title, url: m.url, excerpt: m.summary });
      }
      if (pageDoc && !citations.some((c) => c.url === pathname)) {
        citations.unshift({
          title: pageDoc.title,
          url: pathname,
          excerpt: stripMarkdown(pageDoc.body).slice(0, 220),
        });
      }

      const systemContext = [
        'You are Hanzo Agent, the documentation assistant for docs.hanzo.ai.',
        'Be concise, technical, and accurate. Prefer exact CLI commands, API paths under https://api.hanzo.ai/v1/, and links to /docs/... pages.',
        pageDoc ? `Current page (${pathname} — ${pageDoc.title}):\n${pageDoc.body.slice(0, 3500)}` : '',
        matched.length
          ? `Related Hanzo Docs:\n${matched.map((m) => `- ${m.title} (${m.url}): ${m.summary}`).join('\n')}`
          : '',
      ]
        .filter(Boolean)
        .join('\n\n');

      // 1. Try live streaming via Hanzo API when signed in with IAM token.
      let token: string | null = null;
      try {
        token = iam().getAccessToken() ?? null;
      } catch {
        token = null;
      }

      const apiMessages = history.map((m) => ({ role: m.role, content: m.content }));

      const streamFrom = async (url: string, headers: Record<string, string>, body: unknown): Promise<boolean> => {
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
            signal: controller.signal,
          });
          if (!res.ok || !res.body) return false;

          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let acc = '';
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;
              if (trimmed.startsWith('data:')) {
                const payload = trimmed.slice(5).trim();
                if (payload === '[DONE]') continue;
                try {
                  const parsed = JSON.parse(payload);
                  const delta =
                    parsed?.choices?.[0]?.delta?.content ??
                    parsed?.delta ??
                    (parsed?.type === 'text-delta' ? parsed?.textDelta ?? parsed?.delta : '');
                  if (typeof delta === 'string' && delta) {
                    acc += delta;
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === botId ? { ...m, content: acc, citations, mode: 'live', streaming: true } : m,
                      ),
                    );
                  }
                } catch {
                  // Skip malformed SSE line.
                }
              } else if (trimmed.startsWith('0:')) {
                try {
                  const delta = JSON.parse(trimmed.slice(2));
                  if (typeof delta === 'string') {
                    acc += delta;
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === botId ? { ...m, content: acc, citations, mode: 'live', streaming: true } : m,
                      ),
                    );
                  }
                } catch {
                  // Ignore non-JSON chunk.
                }
              }
            }
          }

          if (acc.trim().length > 0) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === botId ? { ...m, content: acc.trim(), citations, mode: 'live', streaming: false } : m,
              ),
            );
            return true;
          }
          return false;
        } catch {
          return false;
        }
      };

      let answered = false;

      if (token) {
        answered = await streamFrom(
          'https://api.hanzo.ai/v1/chat/completions',
          {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          {
            model: 'enso-auto',
            stream: true,
            messages: [{ role: 'system', content: systemContext }, ...apiMessages],
          },
        );
      }

      if (!answered) {
        answered = await streamFrom(
          '/v1/chat',
          { 'Content-Type': 'application/json' },
          { messages: apiMessages },
        );
      }

      // 2. Static/unauthenticated fallback: crisp grounded answer from docs + current page.
      if (!answered) {
        const parts: string[] = [];
        if (matched.length > 0) {
          parts.push(matched[0].summary);
          if (matched[0].code) {
            parts.push(`\n\`${matched[0].code}\``);
          }
          if (matched.length > 1) {
            parts.push(`\nRelated: ${matched.slice(1).map((m) => m.title).join(' · ')}.`);
          }
        } else if (pageDoc) {
          const clean = stripMarkdown(pageDoc.body);
          parts.push(
            `From **${pageDoc.title}**: ${clean.slice(0, 340)}${clean.length > 340 ? '…' : ''}`,
          );
        } else {
          parts.push(
            'Explore the Hanzo Quickstart (`/docs/quickstart`), Deploy Button (`/docs/deploy-button`), Models (`/docs/models`), or sign in for full streaming Enso AI responses.',
          );
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === botId
              ? {
                  ...m,
                  content: parts.join('\n'),
                  citations: citations.slice(0, 3),
                  mode: 'grounded',
                  streaming: false,
                }
              : m,
          ),
        );
      }

      setBusy(false);
    },
    [busy, messages, pathname],
  );

  // Consume any prompt sent from `Use agent` or `⌘K` Finder.
  useEffect(() => {
    if (!pendingPrompt) return;
    const next = consumePendingPrompt();
    if (next) void send(next);
  }, [pendingPrompt, consumePendingPrompt, send]);

  const copyTranscript = async () => {
    if (!messages.length) return;
    const text = messages.map((m) => `${m.role === 'user' ? 'User' : 'Hanzo Agent'}: ${m.content}`).join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable.
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setBusy(false);
    setDraft('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send(draft);
    }
  };

  return (
    <YStack flex={1} minH={0} height="100%" bg="$background">
      {/* Header aligned flush with the 56px top bar */}
      {!hideHeader && (
        <XStack
          height={BAR}
          px={14}
          gap={8}
          items="center"
          justify="space-between"
          borderBottomWidth={1}
          borderColor="$borderColor"
          shrink={0}
        >
          <XStack items="center" gap={8} minW={0}>
            <HanzoMark size={18} />
            <Text fontSize="$3" fontWeight="600" color="$color12" numberOfLines={1}>
              Hanzo Agent
            </Text>
          </XStack>
          <XStack items="center" gap={2} shrink={0}>
            {messages.length > 0 && (
              <>
                <Tool label="Copy conversation" onPress={() => void copyTranscript()}>
                  {copied ? <Check size={15} color="$color12" /> : <Copy size={15} color="$color10" />}
                </Tool>
                <Tool label="Clear conversation" onPress={reset}>
                  <RotateCcw size={15} color="$color10" />
                </Tool>
              </>
            )}
            <Tool label="Close Hanzo Agent" onPress={onClose}>
              {mobile ? <X size={16} color="$color10" /> : <ChevronsRight size={16} color="$color10" />}
            </Tool>
          </XStack>
        </XStack>
      )}

      {/* Body */}
      <div
        ref={scroller}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {messages.length === 0 ? (
          <YStack flex={1} justify="flex-end" gap={12} pb={6}>
            <YStack gap={4}>
              {STARTERS.map(({ icon: Icon, question }) => (
                <XStack
                  key={question}
                  render="button"
                  type="button"
                  onPress={() => void send(question)}
                  px={10}
                  py={8}
                  gap={10}
                  rounded="$3"
                  items="center"
                  bg="transparent"
                  borderWidth={0}
                  cursor="pointer"
                  hoverStyle={{ bg: '$hover' }}
                >
                  <Icon size={15} color="$color10" />
                  <Text fontSize="$2" lineHeight={19} color="$color11" text="left">
                    {question}
                  </Text>
                </XStack>
              ))}
            </YStack>
            <XStack px={10} items="center" gap={6} flexWrap="wrap">
              <Text fontSize={12} {...muted}>
                Tip: You can open and close chat with
              </Text>
              <Text
                fontFamily="$mono"
                fontSize={11}
                px={5}
                py={1}
                rounded={4}
                borderWidth={1}
                borderColor="$borderColor"
                {...muted}
              >
                ⌘ I
              </Text>
            </XStack>
          </YStack>
        ) : (
          messages.map((msg) => (
            <YStack
              key={msg.id}
              gap={8}
              items={msg.role === 'user' ? 'flex-end' : 'flex-start'}
            >
              <YStack
                maxW={msg.role === 'user' ? '88%' : '100%'}
                px={msg.role === 'user' ? 12 : 2}
                py={msg.role === 'user' ? 8 : 2}
                rounded="$3"
                bg={msg.role === 'user' ? '$panel' : 'transparent'}
                borderWidth={msg.role === 'user' ? 1 : 0}
                borderColor="$borderColor"
                gap={8}
              >
                <Text
                  fontSize={13}
                  lineHeight={20}
                  color={msg.role === 'user' ? '$color12' : '$color11'}
                  style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                >
                  {msg.content || (msg.streaming ? 'Thinking…' : '')}
                </Text>

                {msg.citations && msg.citations.length > 0 && !msg.streaming && (
                  <XStack gap={6} flexWrap="wrap" pt={2}>
                    {msg.citations.map((cite) => (
                      <XStack
                        key={cite.url}
                        render={<Link href={cite.url} prefetch={false} />}
                        px={8}
                        py={4}
                        gap={5}
                        rounded="$2"
                        borderWidth={1}
                        borderColor="$borderColor"
                        bg="$panel"
                        items="center"
                        hoverStyle={{ bg: '$hover', borderColor: '$color8' }}
                      >
                        <BookOpen size={11} color="$color10" />
                        <Text fontSize={11} fontWeight="500" {...loud} numberOfLines={1}>
                          {cite.title}
                        </Text>
                      </XStack>
                    ))}
                  </XStack>
                )}

                {msg.mode === 'grounded' && !msg.streaming && (
                  <XStack gap={8} flexWrap="wrap" pt={2}>
                    <XStack
                      render={
                        <a
                          href={`https://hanzo.app/dev/open?prompt=${encodeURIComponent(
                            messages.findLast((m) => m.role === 'user')?.content ?? '',
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      }
                      items="center"
                      gap={4}
                    >
                      <Text fontSize={11} fontWeight="500" {...muted} hoverStyle={{ color: '$color12' }}>
                        Continue in Hanzo App
                      </Text>
                      <ExternalLink size={11} color="$color10" />
                    </XStack>
                    <Text fontSize={11} {...muted}>
                      ·
                    </Text>
                    <XStack
                      render={<a href="https://hanzo.ai/login" target="_blank" rel="noopener noreferrer" />}
                      items="center"
                      gap={4}
                    >
                      <Text fontSize={11} fontWeight="500" {...muted} hoverStyle={{ color: '$color12' }}>
                        Sign in for live Enso AI
                      </Text>
                    </XStack>
                  </XStack>
                )}
              </YStack>
            </YStack>
          ))
        )}
      </div>

      {/* Composer */}
      <YStack p={12} pt={8} shrink={0}>
        <YStack
          rounded="$4"
          borderWidth={1}
          borderColor="$borderColor"
          bg="$panel"
          p={10}
          gap={8}
        >
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask a question..."
            rows={2}
            aria-label="Ask Hanzo Agent a question"
            style={{
              width: '100%',
              resize: 'none',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'inherit',
              fontFamily: 'inherit',
              fontSize: 13,
              lineHeight: '19px',
              padding: 0,
            }}
          />
          <XStack items="center" justify="space-between" gap={8}>
            <Text fontSize={11} {...muted} numberOfLines={1} flex={1}>
              Context: {pathname}
            </Text>
            <XStack
              render="button"
              type="button"
              disabled={!draft.trim() || busy}
              onPress={() => void send(draft)}
              aria-label="Send question"
              width={28}
              height={28}
              rounded={999}
              items="center"
              justify="center"
              bg={draft.trim() && !busy ? '$color12' : '$hover'}
              borderWidth={0}
              cursor={draft.trim() && !busy ? 'pointer' : 'default'}
              opacity={draft.trim() && !busy ? 1 : 0.55}
            >
              <ArrowUp size={14} color={draft.trim() && !busy ? '$background' : '$color10'} />
            </XStack>
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
}
