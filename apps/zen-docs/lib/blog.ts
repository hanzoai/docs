import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
}

/** Parse YAML frontmatter from MDX content (simple key: value only) */
function parseFrontmatter(src: string): Record<string, string | string[]> {
  const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const result: Record<string, string | string[]> = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (!m) continue;
    const [, key, value] = m;
    // Handle YAML arrays: [a, b, c]
    if (value.startsWith('[') && value.endsWith(']')) {
      result[key] = value
        .slice(1, -1)
        .split(',')
        .map((v) => v.trim().replace(/^["']|["']$/g, ''));
    } else {
      result[key] = value.replace(/^["']|["']$/g, '');
    }
  }
  return result;
}

const BLOG_DIR = join(process.cwd(), 'content', 'blog');

function loadAllPosts(): BlogPost[] {
  let files: string[];
  try {
    files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));
  } catch {
    return [];
  }

  const posts: BlogPost[] = [];
  for (const file of files) {
    const slug = file.replace(/\.mdx$/, '');
    try {
      const src = readFileSync(join(BLOG_DIR, file), 'utf-8');
      const fm = parseFrontmatter(src);
      // Skip posts that don't look like public blog posts (no title or date)
      if (!fm.title || !fm.date) continue;
      posts.push({
        slug,
        title: fm.title as string,
        description: (fm.description as string) ?? '',
        author: (fm.author as string) ?? 'Zen LM Team',
        date: fm.date as string,
        tags: Array.isArray(fm.tags) ? fm.tags : [],
      });
    } catch {
      // skip malformed files
    }
  }
  return posts;
}

export function getSortedPosts(): BlogPost[] {
  return loadAllPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPost(slug: string): BlogPost | undefined {
  return loadAllPosts().find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  let files: string[];
  try {
    files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));
  } catch {
    return [];
  }
  return files.map((f) => f.replace(/\.mdx$/, ''));
}
