/**
 * Catch-all empty module for unresolvable imports from upstream project docs.
 *
 * Upstream repos (python-sdk, datastore, node, HIPs, etc.) are cloned into
 * content/docs/projects/ and may import packages that don't exist in this
 * monorepo (@docusaurus/Link, nextra/*, @mintlify/*, etc.).
 *
 * This module uses a Proxy so that ANY named or default import resolves to a
 * no-op React component instead of crashing the build.
 *
 *   import Anything from 'missing-pkg'           -> () => null
 *   import { Foo, Bar } from 'missing-pkg'       -> () => null, () => null
 *   import * as ns from 'missing-pkg'; ns.Baz    -> () => null
 */

function EmptyComponent() {
  return null;
}

EmptyComponent.displayName = 'EmptyProjectComponent';

module.exports = new Proxy(EmptyComponent, {
  get(_target, prop) {
    if (prop === '__esModule') return true;
    if (prop === 'default') return EmptyComponent;
    // Any named export returns the same no-op component
    return EmptyComponent;
  },
});
