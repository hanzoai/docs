import { expect, test, describe } from 'vitest';
import { filterPageTreeByAccess } from '../src/auth/filter-tree';
import type * as PageTree from '@hanzo/docs-core/page-tree';

function item(name: string, access?: 'public' | 'authenticated' | 'team' | 'admin', accessOrgs?: string[]): PageTree.Item {
  return {
    type: 'page',
    name,
    url: `/${name.toLowerCase().replace(/\s/g, '-')}`,
    access,
    accessOrgs,
  };
}

function folder(name: string, children: PageTree.Node[], index?: PageTree.Item): PageTree.Folder {
  return {
    type: 'folder',
    name,
    children,
    index,
  };
}

function sep(name: string): PageTree.Separator {
  return { type: 'separator', name };
}

function root(children: PageTree.Node[]): PageTree.Root {
  return { name: 'Docs', children };
}

describe('filterPageTreeByAccess', () => {
  test('public pages pass through for anonymous users', () => {
    const tree = root([
      item('Getting Started'),
      item('API Reference', 'public'),
    ]);
    const filtered = filterPageTreeByAccess(tree, { isAuthenticated: false });
    expect(filtered.children).toHaveLength(2);
  });

  test('authenticated pages hidden from anonymous users', () => {
    const tree = root([
      item('Getting Started'),
      item('Partner Guide', 'authenticated'),
    ]);
    const filtered = filterPageTreeByAccess(tree, { isAuthenticated: false });
    expect(filtered.children).toHaveLength(1);
    expect((filtered.children[0] as PageTree.Item).name).toBe('Getting Started');
  });

  test('authenticated pages visible to logged-in users', () => {
    const tree = root([
      item('Getting Started'),
      item('Partner Guide', 'authenticated'),
    ]);
    const filtered = filterPageTreeByAccess(tree, { isAuthenticated: true });
    expect(filtered.children).toHaveLength(2);
  });

  test('admin pages hidden from non-admin users', () => {
    const tree = root([
      item('Public', 'public'),
      item('Admin Only', 'admin'),
    ]);
    const filtered = filterPageTreeByAccess(tree, {
      isAuthenticated: true,
      roles: ['team'],
    });
    expect(filtered.children).toHaveLength(1);
  });

  test('admin pages visible to admin users', () => {
    const tree = root([
      item('Public'),
      item('Admin Only', 'admin'),
    ]);
    const filtered = filterPageTreeByAccess(tree, {
      isAuthenticated: true,
      roles: ['admin'],
    });
    expect(filtered.children).toHaveLength(2);
  });

  test('team pages visible to admin users (admin > team)', () => {
    const tree = root([
      item('Team Content', 'team'),
    ]);
    const filtered = filterPageTreeByAccess(tree, {
      isAuthenticated: true,
      roles: ['admin'],
    });
    expect(filtered.children).toHaveLength(1);
  });

  test('org-restricted pages hidden from wrong org', () => {
    const tree = root([
      item('Public'),
      item('Acme Only', 'authenticated', ['acme']),
    ]);
    const filtered = filterPageTreeByAccess(tree, {
      isAuthenticated: true,
      org: 'other-corp',
    });
    expect(filtered.children).toHaveLength(1);
  });

  test('org-restricted pages visible to matching org', () => {
    const tree = root([
      item('Public'),
      item('Acme Only', 'authenticated', ['acme']),
    ]);
    const filtered = filterPageTreeByAccess(tree, {
      isAuthenticated: true,
      org: 'acme',
    });
    expect(filtered.children).toHaveLength(2);
  });

  test('folders with gated index are hidden for anonymous users', () => {
    const tree = root([
      folder(
        'Partner Docs',
        [item('Setup Guide', 'authenticated')],
        item('Overview', 'authenticated'),
      ),
      item('Public Page'),
    ]);
    const filtered = filterPageTreeByAccess(tree, { isAuthenticated: false });
    expect(filtered.children).toHaveLength(1);
    expect((filtered.children[0] as PageTree.Item).name).toBe('Public Page');
  });

  test('folders with public index but gated children', () => {
    const tree = root([
      folder(
        'Getting Started',
        [
          item('Basics'),
          item('Advanced', 'authenticated'),
        ],
        item('Intro'),
      ),
    ]);
    const filtered = filterPageTreeByAccess(tree, { isAuthenticated: false });
    expect(filtered.children).toHaveLength(1);
    const f = filtered.children[0] as PageTree.Folder;
    expect(f.children).toHaveLength(1);
    expect((f.children[0] as PageTree.Item).name).toBe('Basics');
  });

  test('separators pass through', () => {
    const tree = root([
      sep('Section 1'),
      item('Page A'),
      sep('Section 2'),
      item('Page B', 'authenticated'),
    ]);
    const filtered = filterPageTreeByAccess(tree, { isAuthenticated: false });
    expect(filtered.children).toHaveLength(3);
    expect(filtered.children[0].type).toBe('separator');
    expect(filtered.children[1].type).toBe('page');
    expect(filtered.children[2].type).toBe('separator');
  });

  test('original tree is not mutated', () => {
    const tree = root([
      item('Public'),
      item('Gated', 'authenticated'),
    ]);
    const originalLength = tree.children.length;
    filterPageTreeByAccess(tree, { isAuthenticated: false });
    expect(tree.children).toHaveLength(originalLength);
  });
});
