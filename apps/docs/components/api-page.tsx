import { openapi, hasSpecs } from '@/lib/openapi';
import { defaultShikiOptions } from '@/lib/shiki';
import { createAPIPage } from 'fumadocs-openapi/ui';

export const APIPage = hasSpecs
  ? createAPIPage(openapi, {
      shikiOptions: defaultShikiOptions,
    })
  : null;
