import { loader } from '@hanzo/docs-core/source';
import { docs } from 'collections/server';
import { lucideIconsPlugin } from '@hanzo/docs-core/source/lucide-icons';

export const source = loader({
  source: docs.toHanzoDocsSource(),
  baseUrl: '/docs',
  plugins: [lucideIconsPlugin()],
});
