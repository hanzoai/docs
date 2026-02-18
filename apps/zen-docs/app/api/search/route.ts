import { source } from '@/lib/source';
import { createFromSource } from '@hanzo/docs-core/search/server';

export const { GET } = createFromSource(source);
