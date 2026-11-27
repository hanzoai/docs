'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Text, XStack, YStack } from '@hanzo/gui';
import {
  BookOpen,
  Check,
  Copy,
  ExternalLink,
  Moon,
  PanelLeft,
  Search,
  Sparkle,
  Sun,
  X,
} from '@hanzogui/lucide-icons-2';
import { useTheme } from '@hanzogui/next-theme';
import { HanzoMark } from '@hanzogui/shell';
import { Tool } from '@/components/action';
import { AgentBody } from '@/components/agent-panel';
import { useSearch } from '@/components/search';
import { useShell } from '@/components/shell';
import { loud, muted } from '@/lib/ink';
import { twinPath } from '@/lib/twin';

type CornerTab = 'chat' | 'help';

/**
 * Floating bare monochrome @hanzo/logo H-ribbon mark in the bottom-right corner
 * of the viewport (zero outer circle/ring). Clicking opens the unified floating
 * Hanzo AI Chat & Help widget right above the corner mark, with a one-click dock
 * toggle to the full-height right Agent sidebar (`⌘I`).
 */
export function Corner() {
  const pathname = usePathname();
  const router = useRouter();
  const search = useSearch();
  const { setAgentOpen } = useShell();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<CornerTab>('chat');
  const [copiedMd, setCopiedMd] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const md = twinPath(pathname);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onPointerDown = (e: MouseEvent) => {
      const root = containerRef.current;
      if (root && !root.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onPointerDown);
    };
  }, [open]);

  const go = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

  const copyMd = async () => {
    try {
      const text = await fetch(md).then((r) => r.text());
      await navigator.clipboard.writeText(text);
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 1600);
    } catch {
      // Clipboard unavailable.
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 45,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 10,
      }}
    >
      {open && (
        <YStack
          role="dialog"
          aria-label="Hanzo AI Chat and Help"
          data-docs-corner-widget=""
          width={368}
          height={492}
          maxW="calc(100vw - 32px)"
          maxH="calc(100dvh - 84px)"
          rounded="$4"
          borderWidth={1}
          borderColor="$borderColor"
          bg="$background"
          overflow="hidden"
          style={{ boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)' }}
        >
          {/* Widget Header: Brand + Chat / Help Tabs + Dock / Close */}
          <XStack
            height={48}
            px={12}
            gap={8}
            items="center"
            justify="space-between"
            borderBottomWidth={1}
            borderColor="$borderColor"
            shrink={0}
          >
            <XStack items="center" gap={8}>
              <HanzoMark size={16} />
              <XStack p={2} gap={2} rounded="$3" bg="$panel" borderWidth={1} borderColor="$borderColor">
                {(
                  [
                    { id: 'chat', label: 'Chat' },
                    { id: 'help', label: 'Help' },
                  ] as const
                ).map((item) => {
                  const active = tab === item.id;
                  return (
                    <XStack
                      key={item.id}
                      render="button"
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onPress={() => setTab(item.id)}
                      px={10}
                      py={4}
                      rounded="$2"
                      cursor="pointer"
                      borderWidth={0}
                      bg={active ? '$color12' : 'transparent'}
                    >
                      <Text
                        fontSize={12}
                        lineHeight={16}
                        fontWeight="600"
                        color={active ? '$background' : '$color11'}
                      >
                        {item.label}
                      </Text>
                    </XStack>
                  );
                })}
              </XStack>
            </XStack>

            <XStack items="center" gap={2}>
              <Tool
                label="Search docs (⌘K)"
                onPress={() => {
                  setOpen(false);
                  search.setOpen(true);
                }}
              >
                <Search size={14} color="$color10" />
              </Tool>
              <Tool
                label="Dock chat to sidebar (⌘I)"
                onPress={() => {
                  setOpen(false);
                  setAgentOpen(true);
                }}
              >
                <PanelLeft size={14} color="$color10" style={{ transform: 'scaleX(-1)' }} />
              </Tool>
              <Tool label="Close chat and help" onPress={() => setOpen(false)}>
                <X size={15} color="$color10" />
              </Tool>
            </XStack>
          </XStack>

          {tab === 'chat' ? (
            <AgentBody
              hideHeader
              autoFocus
              pendingPrompt={null}
              consumePendingPrompt={() => null}
              onClose={() => setOpen(false)}
            />
          ) : (
            <YStack flex={1} minH={0} p={12} gap={14} style={{ overflowY: 'auto' }}>
              <YStack gap={4}>
                <Text fontSize={11} fontWeight="600" px={8} pb={2} {...muted}>
                  Help &amp; Community
                </Text>

                <HelpRow
                  icon={copiedMd ? <Check size={14} color="$color12" /> : <Copy size={14} color="$color10" />}
                  label={copiedMd ? 'Copied page as Markdown!' : 'Copy page as Markdown (AI)'}
                  onSelect={() => void copyMd()}
                />
                <HelpRow
                  icon={<Sparkle size={14} color="$color10" />}
                  label="Open docked Hanzo Agent (⌘I)"
                  onSelect={() => {
                    setOpen(false);
                    setAgentOpen(true);
                  }}
                />
                <HelpRow
                  icon={<ExternalLink size={14} color="$color10" />}
                  label="Ask in #docs on Discord"
                  external
                  onSelect={() => go('https://discord.gg/XthHQQj')}
                />
                <HelpRow
                  icon={<BookOpen size={14} color="$color10" />}
                  label="Contribute to docs"
                  onSelect={() => {
                    setOpen(false);
                    router.push('/docs/contributing');
                  }}
                />
                <HelpRow
                  icon={<ExternalLink size={14} color="$color10" />}
                  label="Report a docs issue"
                  external
                  onSelect={() => go('https://github.com/hanzoai/docs/issues/new')}
                />
                <HelpRow
                  icon={<ExternalLink size={14} color="$color10" />}
                  label="System Status"
                  external
                  onSelect={() => go('https://status.hanzo.ai')}
                />
              </YStack>

              <YStack height={1} bg="$borderColor" />

              <YStack gap={4}>
                <Text fontSize={11} fontWeight="600" px={8} pb={2} {...muted}>
                  Preferences
                </Text>
                <HelpRow
                  icon={
                    resolvedTheme === 'dark' ? (
                      <Sun size={14} color="$color10" />
                    ) : (
                      <Moon size={14} color="$color10" />
                    )
                  }
                  label={resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                  onSelect={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                />
                <HelpRow
                  icon={<HanzoMark size={14} />}
                  label="Hanzo AI (hanzo.ai)"
                  external
                  onSelect={() => go('https://hanzo.ai')}
                />
              </YStack>
            </YStack>
          )}
        </YStack>
      )}

      {/* Bare monochrome @hanzo/logo H mark — strictly zero outer circle/border */}
      <XStack
        render="button"
        type="button"
        aria-label="Hanzo AI chat and help"
        aria-expanded={open}
        title="Hanzo AI chat and help"
        onPress={() => setOpen((v) => !v)}
        p={4}
        items="center"
        justify="center"
        cursor="pointer"
        bg="transparent"
        borderWidth={0}
        rounded={0}
        color="$color12"
        opacity={open ? 1 : 0.8}
        hoverStyle={{ opacity: 1 }}
      >
        <HanzoMark size={22} />
      </XStack>
    </div>
  );
}

function HelpRow({
  icon,
  label,
  external = false,
  onSelect,
}: {
  icon: React.ReactNode;
  label: string;
  external?: boolean;
  onSelect: () => void;
}) {
  return (
    <XStack
      render="button"
      type="button"
      onPress={onSelect}
      px={10}
      py={8}
      gap={10}
      rounded="$3"
      items="center"
      justify="space-between"
      bg="transparent"
      borderWidth={0}
      cursor="pointer"
      hoverStyle={{ bg: '$hover' }}
    >
      <XStack items="center" gap={10} minW={0} flex={1}>
        {icon}
        <Text fontSize={13} lineHeight={18} fontWeight="500" {...loud} numberOfLines={1}>
          {label}
        </Text>
      </XStack>
      {external && <ExternalLink size={12} color="$color10" />}
    </XStack>
  );
}
