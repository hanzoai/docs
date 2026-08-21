import { type Page } from '@/lib/source';
import { getSection } from './source/navigation';

/**
 * Sections whose pages are GENERATED, so they have no file in git.
 *
 * The `Source:` line points a reader at the page's markdown on GitHub, which is
 * true of an authored page and a 404 for a generated one — and most of this site
 * is generated now. These are named rather than detected because "is this file
 * committed" is not a question a route handler can ask at request time.
 */
const GENERATED = new Set(['openapi', 'cli', 'start', 'mcp-tools', 'projects', 'pricing']);

export async function getLLMText(page: Page) {
  const section = getSection(page.slugs[0]);
  const category =
    {
      framework: 'Hanzo Docs (Framework Mode)',
      ui: 'Hanzo Docs UI (the default theme of Hanzo Docs)',
      headless: 'Hanzo Docs Core (the core library of Hanzo Docs)',
      mdx: 'Hanzo Docs MDX (the built-in content source)',
      cli: 'Hanzo Docs CLI (the CLI tool for automating Hanzo Docs apps)',
    }[section] ?? section;

  // `getText('processed')` is the compiled markdown, and a page that FAILED to
  // compile has none — it throws rather than returning empty. Ported upstream
  // docs under `projects/` do fail: their MDX is written for another renderer,
  // the build logs each one and skips its HTML, and this route then took the
  // whole export down over a page the site had already decided to do without.
  // The raw source is what a model wants anyway, so it is the fallback.
  let body: string;
  try {
    body = await page.data.getText('processed');
  } catch {
    try {
      body = await page.data.getText('raw');
    } catch {
      body = '';
    }
  }

  const source = GENERATED.has(page.slugs[0])
    ? ''
    : `Source: https://raw.githubusercontent.com/hanzoai/docs/refs/heads/main/apps/docs/content/docs/${page.path}\n`;

  return `# ${category}: ${page.data.title}
URL: ${page.url}
${source}
${page.data.description ?? ''}

${body}`;
}
