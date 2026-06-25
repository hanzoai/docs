import { createFromSource } from '@hanzo/docs-core/search/server';
import { source } from '@/lib/source';

export const { GET } = createFromSource(source);
