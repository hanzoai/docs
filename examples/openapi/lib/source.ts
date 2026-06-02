import { loader, multiple } from '@hanzo/docs-core/source';
import { openapiPlugin, openapiSource } from '@hanzo/docs-openapi/server';
import { docs } from 'collections/server';
import { openapi } from './openapi';

export const source = loader(
  {
    docs: docs.toFumadocsSource(),
    openapi: await openapi.staticSource({
      groupBy: 'tag',
    }),
  },
  {
    baseUrl: '/docs',
    plugins: [openapi.loaderPlugin()],
  },
);
