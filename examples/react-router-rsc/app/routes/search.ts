import type { Route } from './+types/search';
import { createFromSource } from '@hanzo/docs/core/search/server';
import { source } from '@/lib/source';

const server = createFromSource(source, {
  language: 'english',
});

export async function loader({ request }: Route.LoaderArgs) {
  return server.GET(request);
}
