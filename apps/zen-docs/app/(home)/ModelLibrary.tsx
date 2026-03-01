'use client';

import { useRouter } from 'next/navigation';
import { ModelLibrary as SharedModelLibrary } from '@hanzo/ui/models';
import { allModels, families } from '@hanzo/zen-models';

/**
 * ModelLibrary — renders the full model card grid on the zen-docs home page.
 * Data: @hanzo/zen-models (SSOT)
 * UI: @hanzo/ui/models (shared across all Hanzo sites)
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
