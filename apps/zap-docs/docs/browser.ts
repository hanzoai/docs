// @ts-nocheck
import { browser } from '@hanzo/docs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("@hanzo/docs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
    docs: {
      /**
       * extracted references (e.g. hrefs, paths), useful for analyzing relationships between pages.
       */
      extractedReferences: import("@hanzo/docs-mdx").ExtractedReference[];
    },
  }
} & {
  DocData: {
    docs: {
      /**
       * Last modified date of document file, obtained from version control.
       *
       */
      lastModified?: Date;
    },
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "advanced/agent-consensus.mdx": () => import("../content/docs/advanced/agent-consensus.mdx?collection=docs"), "advanced/did.mdx": () => import("../content/docs/advanced/did.mdx?collection=docs"), "advanced/index.mdx": () => import("../content/docs/advanced/index.mdx?collection=docs"), "advanced/lux.mdx": () => import("../content/docs/advanced/lux.mdx?collection=docs"), "advanced/post-quantum.mdx": () => import("../content/docs/advanced/post-quantum.mdx?collection=docs"), "advanced/corona.mdx": () => import("../content/docs/advanced/corona.mdx?collection=docs"), "getting-started/index.mdx": () => import("../content/docs/getting-started/index.mdx?collection=docs"), "bindings/c.mdx": () => import("../content/docs/bindings/c.mdx?collection=docs"), "bindings/cpp.mdx": () => import("../content/docs/bindings/cpp.mdx?collection=docs"), "bindings/csharp.mdx": () => import("../content/docs/bindings/csharp.mdx?collection=docs"), "bindings/erlang.mdx": () => import("../content/docs/bindings/erlang.mdx?collection=docs"), "bindings/go.mdx": () => import("../content/docs/bindings/go.mdx?collection=docs"), "bindings/haskell.mdx": () => import("../content/docs/bindings/haskell.mdx?collection=docs"), "bindings/index.mdx": () => import("../content/docs/bindings/index.mdx?collection=docs"), "bindings/java.mdx": () => import("../content/docs/bindings/java.mdx?collection=docs"), "bindings/javascript.mdx": () => import("../content/docs/bindings/javascript.mdx?collection=docs"), "bindings/ocaml.mdx": () => import("../content/docs/bindings/ocaml.mdx?collection=docs"), "bindings/python.mdx": () => import("../content/docs/bindings/python.mdx?collection=docs"), "bindings/rust.mdx": () => import("../content/docs/bindings/rust.mdx?collection=docs"), "protocol/index.mdx": () => import("../content/docs/protocol/index.mdx?collection=docs"), "overview/architecture.mdx": () => import("../content/docs/overview/architecture.mdx?collection=docs"), "overview/comparison.mdx": () => import("../content/docs/overview/comparison.mdx?collection=docs"), "overview/index.mdx": () => import("../content/docs/overview/index.mdx?collection=docs"), "schema/index.mdx": () => import("../content/docs/schema/index.mdx?collection=docs"), }),
};
export default browserCollections;