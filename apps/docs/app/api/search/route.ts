import { source } from '@/lib/source';
import { flexsearchFromSource } from '@hanzo/docs-core/search/flexsearch';

export const { GET } = flexsearchFromSource(source);
