'use client';

import { useRouter } from 'next/navigation';
import { ModelLibrary as SharedModelLibrary } from '@zenlm/ui';
import { allModels, families } from '@zenlm/models';

/**
 * ModelLibrary — renders the full model card grid on the zen-docs home page.
 * Data: @zenlm/models (SSOT)
 * UI: @zenlm/ui (shared components)
 */
export default function ModelLibrary() {
  const router = useRouter();

  return (
    <SharedModelLibrary
      allModels={allModels}
      families={families}
      linkPrefix="/docs/models/"
      chatBaseUrl="https://hanzo.chat"
      requestAccessUrl="https://hanzo.ai/contact"
      featuredIds={['zen4-max', 'zen-max', 'zen5']}
    />
  );
}
