import { docs } from 'collections/server';
import { loader } from '@hanzo/docs-core/source';

export const source = loader({
  baseUrl: '/docs',
  source: docs.toHanzoDocsSource(),
});
