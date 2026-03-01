'use client';

/**
 * ModelTable for zen-docs MDX pages.
 *
 * Thin wrapper that pulls model data from @hanzo/zen-models (SSOT)
 * and renders with the shared ModelTable component from @hanzo/ui/models.
 */

import { ModelTable as SharedModelTable } from '@hanzo/ui/models';
import { allModels } from '@hanzo/zen-models';
import type { ZenModel } from '@hanzo/zen-models';

interface ModelTableProps {
  /** Explicit ordered list of model IDs to show */
  ids?: string[];
  /** Filter by generation (zen3, zen4, zen5, foundation) */
  generation?: string;
  showParams?: boolean;
  showArch?: boolean;
  showContext?: boolean;
  showPricing?: boolean;
  linkPrefix?: string;
}

export function ModelTable({
  ids,
  generation,
  showParams = true,
  showArch = false,
  showContext = true,
  showPricing = true,
  linkPrefix = '/docs/models/',
}: ModelTableProps) {
  const byId = new Map(allModels.map((m: ZenModel) => [m.id, m]));

  let models: ZenModel[];
  if (ids) {
    models = ids.map((id) => byId.get(id)).filter((m): m is ZenModel => m !== undefined);
  } else if (generation) {
    models = allModels.filter((m: ZenModel) => m.generation === generation);
  } else {
    models = allModels;
  }

  return (
    <SharedModelTable
      models={models}
      linkPrefix={linkPrefix}
      showParams={showParams}
      showArch={showArch}
      showContext={showContext}
      showPricing={showPricing}
    />
  );
}

export default ModelTable;
