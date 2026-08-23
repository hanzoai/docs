import { type Page } from '@/lib/source';

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
  // No category prefix. It was a lookup inherited from the docs framework's own
  // manual — framework / ui / headless / mdx / cli — over a section name that
  // resolved to "services" for most of this site, so every markdown twin an
  // agent reads opened "# services: Quickstart". A heading that names the page
  // is true; one that names a section we do not have is worse than none.

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

  return `# ${page.data.title}
URL: ${page.url}
${source}
${page.data.description ?? ''}

${body}`;
}
