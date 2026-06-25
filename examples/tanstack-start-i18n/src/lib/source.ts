import { loader } from '@hanzo/docs-core/source';
import * as icons from 'lucide-static';
import { docs } from 'collections/server';
import { i18n } from '@/lib/i18n';

export const source = loader({
  source: docs.toHanzoDocsSource(),
  baseUrl: '/docs',
  i18n,
  icon(icon) {
    if (!icon) {
      return;
    }

    if (icon in icons) return icons[icon as keyof typeof icons];
  },
});
