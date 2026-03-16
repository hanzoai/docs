import { loader, multiple } from '@hanzo/docs-core/source';
import { openapiPlugin, openapiSource } from '@hanzo/docs-openapi/server';
import { docs } from 'collections/server';
import { openapi } from './openapi';

export const source = loader(
  multiple({
    docs: docs.toFumadocsSource(),
    openapi: await openapiSource(openapi, {
      groupBy: 'tag',
    }),
  }),
  {
    baseUrl: '/docs',
    plugins: [openapiPlugin()],
  },
);
