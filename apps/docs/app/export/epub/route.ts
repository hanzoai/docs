import { source } from '@/lib/source';
import { exportEpub } from '@hanzo/docs-epub';

export const revalidate = false;

export async function GET(): Promise<Response> {
  try {
    const buffer = await exportEpub({
      source,
      getMarkdown(page) {
        try {
          if (page.data.type === 'docs') return page.data.getText('raw');
        } catch {
          return undefined;
        }
      },
      title: 'Hanzo Documentation',
      author: 'Hanzo AI',
      description: 'Complete documentation for Hanzo AI Cloud platform',
      cover: '/og.png',
    });
    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/epub+zip',
        'Content-Disposition': 'attachment; filename="hanzo-docs.epub"',
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: 'EPUB generation failed', detail: String(e) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
