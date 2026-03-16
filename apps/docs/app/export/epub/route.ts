import { source } from '@/lib/source';
import { exportEpub } from '@hanzo/docs-epub';

export const revalidate = false;

export async function GET(): Promise<Response> {
  const buffer = await exportEpub({
    source,
    getMarkdown(page) {
      if (page.data.type === 'docs') return page.data.getText('raw');
    },
    title: 'Hanzo Docs Documentation',
    author: 'Fuma Nama',
    description: 'Documentation for Hanzo Docs - the documentation framework',
    cover: '/og.png',
  });
  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/epub+zip',
      'Content-Disposition': 'attachment; filename="hanzo-docs.epub"',
    },
  });
}
