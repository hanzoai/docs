import { lucideIconsPlugin } from '@hanzo/docs-core/source/lucide-icons';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';
import { localMd } from '@hanzo/docs-local-md';
import { dynamicLoader } from '@hanzo/docs-core/source/dynamic';

const docs = localMd({
  dir: 'content/docs',
});

if (process.env.NODE_ENV === 'development') {
  void docs.devServer();
}

// See https://docs.hanzo.ai/docs/headless/source-api for more info
export const docsLoader = dynamicLoader(docs.dynamicSource(), {
  baseUrl: docsRoute,
  plugins: [lucideIconsPlugin()],
});

export async function getSource() {
  return docsLoader.get();
}

export function getPageImage(page: (typeof docsLoader)['$inferPage']) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `${docsImageRoute}/${segments.join('/')}`,
  };
}

export function getPageMarkdownUrl(page: (typeof docsLoader)['$inferPage']) {
  const segments = [...page.slugs, 'content.md'];

  return {
    segments,
    url: `${docsContentRoute}/${segments.join('/')}`,
  };
}

export async function getLLMText(page: (typeof docsLoader)['$inferPage']) {
  return `# ${page.data.title} (${page.url})

${page.data.content}`;
}
