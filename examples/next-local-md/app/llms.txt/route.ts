import { getSource } from '@/lib/source';
import { llms } from '@hanzo/docs-core/source/llms';

export const revalidate = false;

export async function GET() {
  const docs = await getSource();
  return new Response(llms(docs).index());
}
