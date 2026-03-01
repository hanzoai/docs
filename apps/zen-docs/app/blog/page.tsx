import Link from 'next/link';
import { blog } from '@/lib/source';

export const metadata = {
  title: 'Blog — Zen LM',
  description: 'Research, releases, and perspectives from the Zen LM team.',
};

interface BlogFrontmatter {
  title: string;
  description?: string;
  author: string;
  date: string;
  tags?: string[];
}

export default function BlogPage() {
  const posts = [...blog.getPages()].sort((a, b) => {
    const da = new Date((a.data as unknown as BlogFrontmatter).date).getTime();
    const db = new Date((b.data as unknown as BlogFrontmatter).date).getTime();
    return db - da;
  });

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3">Blog</h1>
        <p className="text-fd-muted-foreground text-lg">
          Research, releases, and perspectives from the Zen LM team.
        </p>
      </div>

      {/* Post list */}
      <div className="flex flex-col gap-8">
        {posts.map((post) => {
          const data = post.data as unknown as BlogFrontmatter;
          const date = new Date(data.date);

          return (
            <article key={post.url} className="group">
              <Link href={post.url} className="block">
                <time className="text-xs font-mono text-fd-muted-foreground uppercase tracking-wider">
                  {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
                <h2 className="text-xl font-semibold mt-1 mb-2 group-hover:text-fd-primary transition-colors">
                  {data.title}
                </h2>
                {data.description && (
                  <p className="text-fd-muted-foreground text-sm leading-relaxed">
                    {data.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs text-fd-muted-foreground">{data.author}</span>
                  {data.tags && data.tags.length > 0 && (
                    <div className="flex gap-1.5">
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
              </Link>
              <div className="mt-6 border-b border-fd-border" />
            </article>
          );
        })}
      </div>
    </main>
  );
}
