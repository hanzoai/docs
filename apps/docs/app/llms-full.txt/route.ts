import { getLLMText } from '@/lib/get-llm-text';
import { source } from '@/lib/source';

// The whole corpus in one fetch, next to llms.txt's index.
//
// The two are not redundant: the index is a table of contents, so an agent that
// reads it still needs a request per page it wants, and a model exploring the
// docs pays a round trip for every guess. This is the other half of that trade —
// one request, everything, already processed to the same text the per-page twins
// serve. Agents that can afford the context take this and stop guessing.
export const revalidate = false;

export async function GET() {
  const pages = await Promise.all(source.getPages().map(getLLMText));

  return new Response(pages.filter(Boolean).join('\n\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
