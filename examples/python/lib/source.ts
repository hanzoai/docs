import { docs } from 'collections/server';
import { loader } from '@hanzo/docs-core/source';

// See https://docs.hanzo.ai/docs/headless/source-api for more info
export const source = loader({
  // it assigns a URL to your pages
  baseUrl: '/docs',
  source: docs.toHanzoDocsSource(),
});
