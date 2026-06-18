import { loader } from '@hanzo/docs-core/source';
import { docs } from 'collections/server';
import { i18n } from '@/lib/i18n';

export const source = loader({
  source: docs.toDocsSource(),
  baseUrl: '/docs',
  i18n,
});
