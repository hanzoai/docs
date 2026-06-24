import type * as PageTree from 'fumadocs-core/page-tree';

/**
 * Filter a page tree to remove nodes that require auth the current user doesn't have.
 *
 * This is a pure function — it returns a new tree, leaving the original unchanged.
 */
export function filterPageTreeByAccess(
  tree: PageTree.Root,
  options: {
    isAuthenticated: boolean;
    org?: string;
    roles?: string[];
  },
): PageTree.Root {
  return {
    ...tree,
    children: filterNodes(tree.children, options),
    fallback: tree.fallback
      ? filterPageTreeByAccess(tree.fallback, options)
      : undefined,
  };
}

function filterNodes(
  nodes: PageTree.Node[],
  options: {
    isAuthenticated: boolean;
    org?: string;
    roles?: string[];
  },
): PageTree.Node[] {
  const result: PageTree.Node[] = [];

  for (const node of nodes) {
    if (node.type === 'page') {
      if (isNodeVisible(node, options)) {
        result.push(node);
      }
      continue;
    }

    if (node.type === 'separator') {
      result.push(node);
      continue;
    }

    // Folder: check index page access, then recurse children
    if (node.type === 'folder') {
      if (node.index && !isNodeVisible(node.index, options)) {
        // If the folder's index page is gated, hide the entire folder
        continue;
      }

      const filteredChildren = filterNodes(node.children, options);
      // Keep folder if it has visible children or a visible index
      if (filteredChildren.length > 0 || node.index) {
        result.push({
          ...node,
          children: filteredChildren,
        });
      }
    }
  }

  return result;
}

function isNodeVisible(
  node: PageTree.Item,
  options: {
    isAuthenticated: boolean;
    org?: string;
    roles?: string[];
  },
): boolean {
  const access = node.access;
  if (!access || access === 'public') return true;
  if (!options.isAuthenticated) return false;

  // Check org restriction
  if (node.accessOrgs && node.accessOrgs.length > 0) {
    if (!options.org || !node.accessOrgs.includes(options.org)) return false;
  }

  // Check role-based access
  const roles = options.roles ?? [];
  if (access === 'admin' && !roles.includes('admin')) return false;
  if (access === 'team' && !roles.includes('team') && !roles.includes('admin')) return false;

  return true;
}
