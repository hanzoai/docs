/**
 * Strip duplicate H1 headings from MDX files.
 * fumadocs renders title from frontmatter, so body H1s are redundant.
 */
import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const DEST = '/Users/z/work/hanzo/docs/apps/bot-docs/content/docs';

async function* walkMdx(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkMdx(fullPath);
    } else if (entry.name.endsWith('.mdx')) {
      yield fullPath;
    }
  }
}

async function main() {
  let fixed = 0;
  for await (const path of walkMdx(DEST)) {
    let content = await readFile(path, 'utf-8');

    // Match frontmatter
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!fmMatch) continue;

    const fm = fmMatch[1];
    let body = fmMatch[2];

    // Extract title from frontmatter
    const titleMatch = fm.match(/^title:\s*"(.+)"$/m);
    if (!titleMatch) continue;

    // Strip first H1 if it matches or exists
    const h1Match = body.match(/^\s*#\s+(.+)\n+/);
    if (h1Match) {
      body = body.replace(/^\s*#\s+.+\n+/, '\n');
      const newContent = `---\n${fm}\n---\n${body}`;
      await writeFile(path, newContent, 'utf-8');
      fixed++;
    }
  }
  console.log(`Stripped H1 from ${fixed} files`);
}

main().catch(console.error);
