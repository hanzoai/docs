import { useTreeContext, useTreePath } from '@/contexts/tree';
import { type FC, Fragment, type ReactNode, createContext, use, useMemo } from 'react';
import type * as PageTree from '@hanzo/docs-core/page-tree';
import type * as Base from './base';
import { usePathname } from '@hanzo/docs-core/framework';
import { isActive } from '@/utils/urls';
import { ArrowLeft } from 'lucide-react';

export interface SidebarPageTreeComponents {
  Item: FC<{ item: PageTree.Item }>;
  Folder: FC<{ item: PageTree.Folder; children: ReactNode }>;
  Separator: FC<{ item: PageTree.Separator }>;
}

const RendererContext = createContext<
  | (Partial<SidebarPageTreeComponents> & {
      pathname: string;
    })
  | null
>(null);

type InternalComponents = Pick<
  typeof Base,
  | 'SidebarSeparator'
  | 'SidebarFolder'
  | 'SidebarFolderLink'
  | 'SidebarFolderContent'
  | 'SidebarFolderTrigger'
  | 'SidebarItem'
>;

export function createPageTreeRenderer({
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarSeparator,
  SidebarItem,
}: InternalComponents) {
  // A separator OWNS the siblings that follow it, up to the next separator, so a
  // section collapses as one unit. The tree is flat on disk either way — grouping
  // here is what keeps a sidebar of 35 entries down to the few a reader can hold.
  function renderList(nodes: PageTree.Node[]) {
    const out: ReactNode[] = [];
    for (let i = 0; i < nodes.length; ) {
      const node = nodes[i];
      if (node.type !== 'separator') {
        out.push(<PageTreeNode key={i} node={node} />);
        i++;
        continue;
      }
      let end = i + 1;
      while (end < nodes.length && nodes[end].type !== 'separator') end++;
      out.push(<PageTreeSection key={i} head={node} nodes={nodes.slice(i + 1, end)} />);
      i = end;
    }
    return out;
  }

  // Whether the page being read lives under these nodes, which is what keeps the
  // reader's own section open.
  function holds(nodes: PageTree.Node[], pathname: string): boolean {
    return nodes.some((node) => {
      if (node.type === 'page') return isActive(node.url, pathname);
      if (node.type === 'folder')
        return (
          (node.index !== undefined && isActive(node.index.url, pathname)) ||
          holds(node.children, pathname)
        );
      return false;
    });
  }

  function PageTreeSection({ head, nodes }: { head: PageTree.Separator; nodes: PageTree.Node[] }) {
    const { Separator, pathname } = use(RendererContext)!;

    // A caller supplying its own Separator owns that layout, so leave it flat.
    if (Separator || nodes.length === 0)
      return (
        <Fragment>
          <PageTreeNode node={head} />
          {renderList(nodes)}
        </Fragment>
      );

    return (
      <SidebarFolder active={holds(nodes, pathname)}>
        <SidebarFolderTrigger>{head.name}</SidebarFolderTrigger>
        <SidebarFolderContent>{renderList(nodes)}</SidebarFolderContent>
      </SidebarFolder>
    );
  }

  function PageTreeNode({ node }: { node: PageTree.Node }) {
    const { Separator, Item, Folder, pathname } = use(RendererContext)!;

    if (node.type === 'separator') {
      if (Separator) return <Separator item={node} />;
      return (
        <SidebarSeparator>
          {node.icon}
          {node.name}
        </SidebarSeparator>
      );
    }

    if (node.type === 'folder') {
      // eslint-disable-next-line react-hooks/rules-of-hooks -- assume node type unchanged
      const path = useTreePath();
      if (Folder) return <Folder item={node}>{renderList(node.children)}</Folder>;

      return (
        <SidebarFolder
          collapsible={node.collapsible}
          active={path.includes(node)}
          defaultOpen={node.defaultOpen}
        >
          {node.index ? (
            <SidebarFolderLink
              href={node.index.url}
              active={isActive(node.index.url, pathname)}
              external={node.index.external}
            >
              {node.name}
            </SidebarFolderLink>
          ) : (
            <SidebarFolderTrigger>{node.name}</SidebarFolderTrigger>
          )}
          <SidebarFolderContent>{renderList(node.children)}</SidebarFolderContent>
        </SidebarFolder>
      );
    }

    if (Item) return <Item item={node} />;
    return (
      <SidebarItem href={node.url} external={node.external} active={isActive(node.url, pathname)}>
        {node.name}
      </SidebarItem>
    );
  }

  /**
   * Render sidebar items from page tree
   */
  return function SidebarPageTree(components: Partial<SidebarPageTreeComponents>) {
    const { Folder, Item, Separator } = components;
    const { root } = useTreeContext();
    const pathname = usePathname();

    // THE DESTINATION OWNS THE RAIL.
    //
    // A folder at the top of the tree is somewhere the top nav can send a reader
    // — Guides, APIs, SDKs, CLI, MCP are each one — so a reader inside one sees
    // that destination's pages and nothing else. Anywhere else the rail is the
    // root tree. Without this the rail is one list of the whole site that every
    // destination scrolls through, and which surface you are in is invisible.
    //
    // It is read off the tree's own SHAPE rather than a list of destinations
    // kept beside it: a second list is a second thing to update, and it would
    // disagree with the tree the first time somebody added a folder.
    const scope = useMemo(() => {
      const folder = root.children.find(
        (node): node is PageTree.Folder => node.type === 'folder' && holds([node], pathname),
      );
      if (!folder) return undefined;
      // Back out to the tree's own first page, which is the root's index — not a
      // literal path, which would tie this component to one site's routing.
      const home = root.children.find((node): node is PageTree.Item => node.type === 'page');
      return { folder, home };
    }, [root, pathname]);

    return (
      <RendererContext
        value={useMemo(
          () => ({ Folder, Item, Separator, pathname }),
          [Folder, Item, Separator, pathname],
        )}
      >
        <Fragment key={root.$id}>
          {scope ? (
            <>
              {scope.home && (
                <SidebarItem href={scope.home.url} external={false} active={false}>
                  <ArrowLeft data-icon className="size-4 shrink-0" />
                  {root.name}
                </SidebarItem>
              )}
              <SidebarSeparator>{scope.folder.name}</SidebarSeparator>
              {renderList(scope.folder.children)}
            </>
          ) : (
            renderList(root.children)
          )}
        </Fragment>
      </RendererContext>
    );
  };
}
