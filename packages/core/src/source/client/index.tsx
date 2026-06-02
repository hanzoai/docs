import type * as PageTree from '@/page-tree';
import { visit } from '@/page-tree/utils';
import { useMemo } from 'react';

export interface SerializedPageTree {
  $hanzo_docs_loader: 'page-tree';
  data: object;
}

export type Serialized<Data> = {
  [K in keyof Data]: Data[K] extends SerializedPageTree ? PageTree.Root : Data[K];
};

export function deserializePageTree(serialized: SerializedPageTree): PageTree.Root {
  const root = serialized.data as PageTree.Root;
  visit(root, (item) => {
    if ('icon' in item && typeof item.icon === 'string') {
      item.icon = (
        <span
          dangerouslySetInnerHTML={{
            __html: item.icon,
          }}
        />
      );
    }
    if (typeof item.name === 'string') {
      item.name = (
        <span
          className="fd-page-tree-item-name"
          dangerouslySetInnerHTML={{
            __html: item.name,
          }}
        />
      );
    }
  });

  return root;
}

/**
 * Deserialize loader data that is serialized by the server-side Hanzo Docs `loader()`, supported:
 * - Page Tree
 *
 * other unrelated properties are kept in the output.
 */
export function useHanzoDocsLoader<V>(serialized: V): Serialized<V> {
  return useMemo(() => {
    const out: Record<string, unknown> = {};
    for (const k in serialized) {
      const v = serialized[k];
      if (isSerializedPageTree(v)) {
        out[k] = deserializePageTree(v);
      } else {
        out[k] = v;
      }
    }
    return out as Serialized<V>;
  }, [serialized]);
}

function isSerializedPageTree(v: unknown): v is SerializedPageTree {
  return (
    typeof v === 'object' &&
    v !== null &&
    '$hanzo_docs_loader' in v &&
    v.$hanzo_docs_loader === 'page-tree'
  );
}
