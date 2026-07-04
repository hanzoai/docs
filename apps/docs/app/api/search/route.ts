import { source } from '@/lib/source';
import { flexsearchFromSource } from '@hanzo/docs-core/search/flexsearch';

export const { GET } = flexsearchFromSource(source);

// Static flexsearch index for CF Pages static export.
export const dynamic = 'force-static';
