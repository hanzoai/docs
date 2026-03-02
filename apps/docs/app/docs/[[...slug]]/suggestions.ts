import type { Suggestion } from '@/components/layouts/not-found';
import { publishableKey, searchEndpoint } from '@/lib/hanzo/client';

interface HanzoSuggestionHit {
  id: string;
  url: string;
  title: string;
}

interface HanzoSuggestionResponse {
  hits: HanzoSuggestionHit[];
}

export async function getSuggestions(pathname: string): Promise<Suggestion[]> {
  if (!publishableKey) return [];

  const res = await fetch(searchEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${publishableKey}`,
    },
    body: JSON.stringify({
      query: pathname,
      mode: 'vector',
      limit: 5,
    }),
  });

  if (!res.ok) return [];

  const data = (await res.json()) as HanzoSuggestionResponse;

  const seen = new Set<string>();
  return data.hits.flatMap((hit) => {
    if (seen.has(hit.url)) return [];
    seen.add(hit.url);
    return {
      id: hit.id,
      href: hit.url,
      title: hit.title,
    };
  });
}
