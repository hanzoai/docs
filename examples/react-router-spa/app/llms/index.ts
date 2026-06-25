import { source } from '@/lib/source';
import { llms } from '@hanzo/docs-core/source';

export function loader() {
  return new Response(llms(source).index());
}
