import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPost, getAllSlugs } from '@/lib/blog';
import { useMDXComponents } from '@/mdx-components';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return {
    title: `${post.title} — Zen LM Blog`,
    description: post.description,
  };
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  // Dynamically import the MDX file
  let Content: React.ComponentType<{ components?: object }>;
  try {
    const mod = await import(`../../../content/blog/${slug}.mdx`);
    Content = mod.default;
  } catch {
    notFound();
  }

  const date = new Date(post.date);
  const components = useMDXComponents({});

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
          {date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <h1 className="text-3xl font-bold mt-2 mb-3">{post.title}</h1>
        <p className="text-fd-muted-foreground text-lg mb-4">{post.description}</p>
        <div className="flex items-center gap-3 pt-4 border-t border-fd-border">
          <span className="text-sm text-fd-muted-foreground">By {post.author}</span>
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
      </div>

      {/* Content */}
      <div className="prose dark:prose-invert max-w-none">
        <Content components={components} />
      </div>
    </main>
  );
}
