import Link from 'next/link';
import { getSortedPosts } from '@/lib/blog';

export const metadata = {
  title: 'Blog — Zen LM',
  description: 'Research, releases, and perspectives from the Zen LM team.',
};

export default function BlogPage() {
  const posts = getSortedPosts();

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
      <div className="flex flex-col gap-0">
        {posts.map((post, i) => {
          const date = new Date(post.date);
          return (
            <article key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="block group py-8">
                <time className="text-xs font-mono text-fd-muted-foreground uppercase tracking-wider">
                  {date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <h2 className="text-xl font-semibold mt-1 mb-2 group-hover:text-fd-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-fd-muted-foreground text-sm leading-relaxed mb-3">
                  {post.description}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-fd-muted-foreground">{post.author}</span>
                  <div className="flex gap-1.5 ml-auto">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono uppercase tracking-wider bg-fd-muted text-fd-muted-foreground px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
              {i < posts.length - 1 && <div className="border-b border-fd-border" />}
            </article>
          );
        })}
      </div>
    </main>
  );
}
