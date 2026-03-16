import { type InferPageType, loader, source } from '@hanzo/docs-core/source';
import { revalidable } from '@/lib/revalidable';
import { lucideIconsPlugin } from '@hanzo/docs-core/source/lucide-icons';
import { getPages } from './storage';
import { FumapressConfig } from '@/config/global';

export const getSource = revalidable({
  async create(config: FumapressConfig) {
    return loader({
      source: source(await getPages(config.content ?? {})),
      plugins: [lucideIconsPlugin()],
      baseUrl: '/',
    });
  },
});

export type Source = Awaited<ReturnType<typeof getSource>>;
export type SourcePage = InferPageType<Source>;

export function getPageImage(slugs: string[]) {
  const segments = [...slugs, 'image.webp'];

  return {
    segments,
    url: `/og/${segments.join('/')}`,
  };
}
