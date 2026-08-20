import { getLLMText } from '@/lib/get-llm-text';
import { getPageMarkdownUrl, source } from '@/lib/source';
import { notFound } from 'next/navigation';

// The markdown twin of every docs page: what Copy Markdown puts on the
// clipboard, what View Markdown opens, and what the Open in ChatGPT / Claude /
// Cursor links hand the model. Those buttons have always been rendered by
// app/docs/[[...slug]]/page.tsx; until this route existed they fetched a 404,
// so the feature read as broken rather than missing.
//
// The last slug segment is `content.md` (see getPageMarkdownUrl), so it is
// dropped before the page lookup.
export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug } = await params;
  const page = source.getPage(slug?.slice(0, -1));
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}

// Prerenders every twin as a real file, which is what makes this work under
// `output: 'export'` — this site is served by hanzoai/static, so nothing
// computes a response at request time.
export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: getPageMarkdownUrl(page).segments,
  }));
}
