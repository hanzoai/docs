import { openapi, hasSpecs } from '@/lib/openapi';
import { defaultShikiOptions } from '@/lib/shiki';
import { createAPIPage } from '@hanzo/docs-openapi/ui';

export const APIPage = hasSpecs
  ? createAPIPage(openapi, {
      shikiOptions: defaultShikiOptions,
    })
  : null;
