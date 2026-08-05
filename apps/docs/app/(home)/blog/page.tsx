import Link from 'next/link';
import { blog } from '@/lib/source';
import { PathUtils } from '@hanzo/docs/core/source';

// Blog frontmatter type (matches source.config.ts schema)
interface BlogData {
  title: string;
  description?: string;
  author: string;
  date: string | Date;
}

function getName(path: string) {
  return PathUtils.basename(path, PathUtils.extname(path));
}

export default function Page() {
  const posts = [...blog.getPages()].sort(
    (a, b) =>
      new Date((b.data as unknown as BlogData).date ?? getName(b.path)).getTime() -
      new Date((a.data as unknown as BlogData).date ?? getName(a.path)).getTime(),
  );

  return (
    <main className="mx-auto w-full max-w-page px-4 pb-12 md:py-12">
      {/* The backdrop is the brand's own architectural grid — @hanzo/brand's
          hero treatment, drawn in CSS. It replaced 2.2 MB of upstream orange
          gradient art that came through the fork and matched no Hanzo palette. */}
      <div className="relative dark mb-2 overflow-hidden rounded-2xl border border-fd-border bg-fd-card p-8 z-2 md:p-12">
        <div
          aria-hidden
          className="absolute inset-0 -z-1"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <h1 className="mb-4 text-3xl text-landing-foreground font-mono font-medium">
          Hanzo Docs Blog
        </h1>
        <p className="text-sm font-mono text-landing-foreground-200">
          Latest announcements and updates.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-4">
        {posts.map((post) => (
          <Link
            key={post.url}
            href={post.url}
            className="flex flex-col bg-fd-card rounded-2xl border shadow-sm p-4 transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          >
            <p className="font-medium">{post.data.title}</p>
            <p className="text-sm text-fd-muted-foreground">{post.data.description}</p>

            <p className="mt-auto pt-4 text-xs text-brand">
              {new Date((post.data as unknown as BlogData).date ?? getName(post.path)).toDateString()}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
