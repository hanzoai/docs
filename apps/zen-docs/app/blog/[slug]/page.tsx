import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { blog } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';

interface BlogFrontmatter {
  title: string;
  description?: string;
  author: string;
  date: string;
  tags?: string[];
  load: () => Promise<{ body: React.ComponentType<{ components: object }> }>;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = blog.getPage([slug]);
  if (!page) notFound();
  const data = page.data as unknown as BlogFrontmatter;
  return {
    title: `${data.title} — Zen LM Blog`,
    description: data.description,
  };
}

export function generateStaticParams() {
  return blog.getPages().map((page) => ({ slug: page.slugs[0] }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const page = blog.getPage([slug]);
  if (!page) notFound();

  const data = page.data as unknown as BlogFrontmatter;
  const { body: Mdx } = await data.load();
  const date = new Date(data.date);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-16">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground hover:text-fd-foreground mb-10 transition-colors"
      >
        ← Back to Blog
      </Link>

      {/* Meta */}
      <div className="mb-8">
        <time className="text-xs font-mono text-fd-muted-foreground uppercase tracking-wider">
          {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </time>
        <h1 className="text-3xl font-bold mt-2 mb-3">{data.title}</h1>
        {data.description && (
          <p className="text-fd-muted-foreground text-lg">{data.description}</p>
        )}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-fd-border">
          <span className="text-sm text-fd-muted-foreground">By {data.author}</span>
          {data.tags && data.tags.length > 0 && (
            <div className="flex gap-1.5 ml-auto">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono uppercase tracking-wider bg-fd-muted text-fd-muted-foreground px-1.5 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-invert max-w-none">
        <Mdx components={getMDXComponents()} />
      </div>
    </main>
  );
}
