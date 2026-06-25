import { docs } from '@hanzo/docs-mdx:collections/server';
import { type InferPageType, loader } from '@hanzo/docs-core/source';

// See https://docs.hanzo.ai/docs/headless/source-api for more info
export const source = loader({
  baseUrl: '/docs',
  source: docs.toHanzoDocsSource(),
  plugins: [],
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title}

${processed}`;
}
