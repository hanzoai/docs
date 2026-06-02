import { type Page } from '@/lib/source';
import { getSection } from './source/navigation';

export async function getLLMText(page: Page) {
  if (page.type === 'openapi') return '';

  const section = getSection(page.slugs[0]);
  const category =
    {
      framework: 'Hanzo Docs (Framework Mode)',
      ui: 'Hanzo Docs UI (the default theme of Hanzo Docs)',
      headless: 'Hanzo Docs Core (the core library of Hanzo Docs)',
      mdx: 'Hanzo Docs MDX (the built-in content source)',
      cli: 'Hanzo Docs CLI (the CLI tool for automating Hanzo Docs apps)',
    }[section] ?? section;

  const processed = await page.data.getText('processed');

  return `# ${category}: ${page.data.title}
URL: ${page.url}
Source: https://raw.githubusercontent.com/hanzoai/docs/refs/heads/main/apps/docs/content/docs/${page.path}

${page.data.description ?? ''}
        
${processed}`;
}
