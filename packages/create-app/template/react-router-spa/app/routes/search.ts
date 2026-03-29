import { createFromSource } from '@hanzo/docs/core/search/server';
import { source } from '@/lib/source';

const server = createFromSource(source, {
  language: 'english',
});

export async function loader() {
  return server.staticGET();
}
