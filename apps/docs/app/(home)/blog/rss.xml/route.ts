import { Feed } from 'feed';
import { blog } from '@/lib/source';
import { NextResponse } from 'next/server';

export const revalidate = false;

// Blog frontmatter type (matches source.config.ts schema)
interface BlogData {
  title: string;
  description?: string;
  author: string;
  date: string | Date;
}

const baseUrl = 'https://docs.hanzo.ai';

export function GET() {
  const feed = new Feed({
    title: 'Hanzo Docs Blog',
    id: `${baseUrl}/blog`,
    link: `${baseUrl}/blog`,
    language: 'en',

    image: `${baseUrl}/banner.png`,
    favicon: `${baseUrl}/icon.png`,
    copyright: 'All rights reserved 2025, Hanzo AI',
  });

  for (const page of blog.getPages().sort((a, b) => {
    const aData = a.data as unknown as BlogData;
    const bData = b.data as unknown as BlogData;
    return new Date(bData.date).getTime() - new Date(aData.date).getTime();
  })) {
    const data = page.data as unknown as BlogData;
    feed.addItem({
      id: page.url,
      title: data.title,
      description: data.description,
      link: `${baseUrl}${page.url}`,
      date: new Date(data.date),

      author: [
        {
          name: data.author,
        },
      ],
    });
  }

  return new NextResponse(feed.rss2());
}
