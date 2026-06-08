import { loader } from '@hanzo/docs-core/source';
import { docs } from 'collections/server';

export const source = loader({
  source: docs.toDocsSource(),
  baseUrl: '/docs',
});
