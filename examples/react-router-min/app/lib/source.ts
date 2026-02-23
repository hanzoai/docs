import { loader } from '@hanzo/docs-core/source';
import { docs } from '@hanzo/docs-mdx:collections/server';

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: '/docs',
});
