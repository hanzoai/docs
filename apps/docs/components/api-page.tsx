import { openapi, hasSpecs } from '@/lib/openapi';
import { createAPIPage } from '@hanzo/docs/openapi/ui';

export const APIPage = hasSpecs
  ? createAPIPage(openapi, {
      shikiOptions: {
        themes: {
          dark: 'vesper',
          light: 'vitesse-light',
        },
      },
    })
  : null;
