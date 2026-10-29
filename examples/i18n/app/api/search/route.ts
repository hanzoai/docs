import { source } from '@/lib/source';
import { createFromSource } from '@hanzo/docs-core/search/server';
import { createTokenizer } from '@orama/tokenizers/mandarin';

export const { GET } = createFromSource(source, {
  localeMap: {
    // [locale]: Orama options
    'zh-CN': {
      components: {
        tokenizer: createTokenizer(),
      },
      search: {
        threshold: 0,
        tolerance: 0,
      },
    },
    'zh-TW': {
      components: {
        tokenizer: createTokenizer(),
      },
      search: {
        threshold: 0,
        tolerance: 0,
      },
    },
  },
});
