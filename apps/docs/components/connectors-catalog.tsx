'use client';

// Unified connectors catalog — the ONE place to discover everything Hanzo can
// connect to, by how you connect it:
//   · Native connectors — first-party integrations you link once (OAuth2 /
//     GitHub App) in the console: GitHub, GitLab, Slack, Google, Discord, X …
//   · MCP servers — the open Model Context Protocol ecosystem, indexed live
//     from the official registry (registry.modelcontextprotocol.io), connect
//     over streamable-http or a package. Hundreds of servers, always current.
//
// Rendered inline in the docs (never a link-out). Same lazy-island + fd-token
// pattern as <ModelsCatalog/>.
import { useEffect, useMemo, useState } from 'react';
import { Search, Plug, Boxes, ArrowUpRight } from 'lucide-react';

const MCP_REGISTRY = 'https://registry.modelcontextprotocol.io/v0/servers?limit=100';

// First-party connectors — linked once in the console, then callable from the
// unified Hanzo MCP + the gateway. method = how you authorize the connection.
type Native = { id: string; label: string; method: string; blurb: string };
const NATIVE: Native[] = [
  { id: 'github', label: 'GitHub', method: 'GitHub App', blurb: 'Repos, issues, PRs, actions, code search.' },
  { id: 'gitlab', label: 'GitLab', method: 'OAuth2', blurb: 'Projects, merge requests, pipelines, issues.' },
  { id: 'slack', label: 'Slack', method: 'OAuth2', blurb: 'Channels, messages, search, notifications.' },
  { id: 'google', label: 'Google', method: 'OAuth2', blurb: 'Drive, Gmail, Calendar, Sheets.' },
  { id: 'discord', label: 'Discord', method: 'OAuth2', blurb: 'Servers, channels, messages.' },
  { id: 'x', label: 'X', method: 'OAuth2', blurb: 'Post, read, and search on X.' },
];

type McpServer = { name: string; title?: string; description?: string; remotes?: { type: string }[]; packages?: { registryType: string }[] };
type RegItem = { server: McpServer };

function connectVia(s: McpServer): string {
  if (s.remotes?.length) return s.remotes[0].type; // streamable-http / sse
  if (s.packages?.length) return s.packages[0].registryType; // npm / pypi / oci …
  return 'mcp';
}

export function ConnectorsCatalog() {
  const [servers, setServers] = useState<McpServer[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState('');

  const loadPage = (cur?: string) => {
    setLoading(true);
    fetch(cur ? `${MCP_REGISTRY}&cursor=${encodeURIComponent(cur)}` : MCP_REGISTRY)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d: { servers: RegItem[]; metadata?: { nextCursor?: string } }) => {
        setServers((prev) => {
          const seen = new Set(prev.map((s) => s.name));
          const fresh = d.servers.map((i) => i.server).filter((s) => s.name && !seen.has(s.name));
          return [...prev, ...fresh];
        });
        setCursor(d.metadata?.nextCursor ?? null);
      })
      .catch((e) => setErr(String(e.message || e)))
      .finally(() => setLoading(false));
  };
  useEffect(() => { loadPage(); /* eslint-disable-next-line */ }, []);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return servers;
    return servers.filter((s) => `${s.name} ${s.title} ${s.description}`.toLowerCase().includes(n));
  }, [servers, q]);

  const nativeFiltered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return n ? NATIVE.filter((c) => `${c.label} ${c.method} ${c.blurb}`.toLowerCase().includes(n)) : NATIVE;
  }, [q]);

  return (
    <div className="not-prose my-6">
      <label className="relative mb-5 flex items-center">
        <Search className="pointer-events-none absolute left-2.5 size-4 text-fd-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search connectors and MCP servers…"
          className="w-full rounded-md border border-fd-border bg-fd-background py-2 pl-8 pr-3 text-sm outline-none focus:border-fd-primary"
        />
      </label>

      {/* Native connectors */}
      {nativeFiltered.length > 0 && (
        <section className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <Plug className="size-4 text-fd-primary" />
            <h3 className="m-0 text-base font-semibold text-fd-foreground">Native connectors</h3>
            <span className="text-xs text-fd-muted-foreground">link once in the console</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {nativeFiltered.map((c) => {
              return (
                <div key={c.id} className="rounded-lg border border-fd-border bg-fd-card p-3">
                  <div className="flex items-center gap-2">
                    <Plug className="size-4 text-fd-foreground" />
                    <span className="font-medium text-fd-foreground">{c.label}</span>
                    <span className="ml-auto rounded border border-fd-border px-1.5 py-0.5 text-[10px] text-fd-muted-foreground">{c.method}</span>
                  </div>
                  <p className="mt-1.5 mb-0 text-sm text-fd-muted-foreground">{c.blurb}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* MCP servers — live from the official registry */}
      <section>
        <div className="mb-2 flex items-center gap-2">
          <Boxes className="size-4 text-fd-primary" />
          <h3 className="m-0 text-base font-semibold text-fd-foreground">MCP servers</h3>
          <span className="text-xs text-fd-muted-foreground">
            {servers.length ? `${servers.length}+ indexed · Model Context Protocol registry` : 'loading the registry…'}
          </span>
        </div>

        {err ? (
          <p className="text-sm text-fd-muted-foreground">
            Couldn’t reach the MCP registry ({err}). Browse it at{' '}
            <a className="text-fd-primary underline" href="https://registry.modelcontextprotocol.io">registry.modelcontextprotocol.io</a>.
          </p>
        ) : (
          <>
            <div className="overflow-hidden rounded-lg border border-fd-border">
              {filtered.map((s, i) => (
                <div key={s.name} className={`flex items-start gap-3 p-3 ${i > 0 ? 'border-t border-fd-border/60' : ''}`}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-fd-foreground">{s.title || s.name}</span>
                      <span className="rounded border border-fd-border px-1.5 py-0.5 text-[10px] text-fd-muted-foreground">{connectVia(s)}</span>
                    </div>
                    <div className="truncate font-mono text-xs text-fd-muted-foreground">{s.name}</div>
                    {s.description ? <p className="mt-1 mb-0 line-clamp-2 text-sm text-fd-muted-foreground">{s.description}</p> : null}
                  </div>
                </div>
              ))}
              {!filtered.length && !loading ? <div className="p-4 text-sm text-fd-muted-foreground">No servers match “{q}”.</div> : null}
            </div>
            {!q && cursor ? (
              <button
                type="button"
                onClick={() => loadPage(cursor)}
                disabled={loading}
                className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-fd-border px-3 py-1.5 text-sm text-fd-foreground hover:bg-fd-muted disabled:opacity-50"
              >
                {loading ? 'Loading…' : 'Load more'} <ArrowUpRight className="size-3.5" />
              </button>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}

export default ConnectorsCatalog;
