import { docs } from '@hanzo/docs-mdx/collections/server';
import { type InferPageType, loader } from '@hanzo/docs-core/source';
import { lucideIconsPlugin } from '@hanzo/docs-core/source/lucide-icons';

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
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
  return `# ${page.data.title}\n\n${processed}`;
}
