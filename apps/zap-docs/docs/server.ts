// @ts-nocheck
import { frontmatter as __fd_glob_31 } from "../content/docs/schema/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_30 } from "../content/docs/overview/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_29 } from "../content/docs/overview/comparison.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_28 } from "../content/docs/overview/architecture.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_27 } from "../content/docs/protocol/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_26 } from "../content/docs/bindings/rust.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_25 } from "../content/docs/bindings/python.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_24 } from "../content/docs/bindings/ocaml.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_23 } from "../content/docs/bindings/javascript.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_22 } from "../content/docs/bindings/java.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_21 } from "../content/docs/bindings/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_20 } from "../content/docs/bindings/haskell.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_19 } from "../content/docs/bindings/go.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_18 } from "../content/docs/bindings/erlang.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_17 } from "../content/docs/bindings/csharp.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_16 } from "../content/docs/bindings/cpp.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_15 } from "../content/docs/bindings/c.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_14 } from "../content/docs/getting-started/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_13 } from "../content/docs/advanced/corona.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_12 } from "../content/docs/advanced/post-quantum.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_11 } from "../content/docs/advanced/lux.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_10 } from "../content/docs/advanced/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_9 } from "../content/docs/advanced/did.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_8 } from "../content/docs/advanced/agent-consensus.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_7 } from "../content/docs/index.mdx?collection=docs&only=frontmatter"
import { default as __fd_glob_6 } from "../content/docs/schema/meta.json?collection=docs"
import { default as __fd_glob_5 } from "../content/docs/overview/meta.json?collection=docs"
import { default as __fd_glob_4 } from "../content/docs/protocol/meta.json?collection=docs"
import { default as __fd_glob_3 } from "../content/docs/getting-started/meta.json?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/bindings/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/advanced/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from '@hanzo/docs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("@hanzo/docs-mdx/runtime/types").InternalTypeConfig & {
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
}>({"doc":{"passthroughs":["extractedReferences","lastModified"]}});

export const docs = await create.docsLazy("docs", "content/docs", {"meta.json": __fd_glob_0, "advanced/meta.json": __fd_glob_1, "bindings/meta.json": __fd_glob_2, "getting-started/meta.json": __fd_glob_3, "protocol/meta.json": __fd_glob_4, "overview/meta.json": __fd_glob_5, "schema/meta.json": __fd_glob_6, }, {"index.mdx": __fd_glob_7, "advanced/agent-consensus.mdx": __fd_glob_8, "advanced/did.mdx": __fd_glob_9, "advanced/index.mdx": __fd_glob_10, "advanced/lux.mdx": __fd_glob_11, "advanced/post-quantum.mdx": __fd_glob_12, "advanced/corona.mdx": __fd_glob_13, "getting-started/index.mdx": __fd_glob_14, "bindings/c.mdx": __fd_glob_15, "bindings/cpp.mdx": __fd_glob_16, "bindings/csharp.mdx": __fd_glob_17, "bindings/erlang.mdx": __fd_glob_18, "bindings/go.mdx": __fd_glob_19, "bindings/haskell.mdx": __fd_glob_20, "bindings/index.mdx": __fd_glob_21, "bindings/java.mdx": __fd_glob_22, "bindings/javascript.mdx": __fd_glob_23, "bindings/ocaml.mdx": __fd_glob_24, "bindings/python.mdx": __fd_glob_25, "bindings/rust.mdx": __fd_glob_26, "protocol/index.mdx": __fd_glob_27, "overview/architecture.mdx": __fd_glob_28, "overview/comparison.mdx": __fd_glob_29, "overview/index.mdx": __fd_glob_30, "schema/index.mdx": __fd_glob_31, }, {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "advanced/agent-consensus.mdx": () => import("../content/docs/advanced/agent-consensus.mdx?collection=docs"), "advanced/did.mdx": () => import("../content/docs/advanced/did.mdx?collection=docs"), "advanced/index.mdx": () => import("../content/docs/advanced/index.mdx?collection=docs"), "advanced/lux.mdx": () => import("../content/docs/advanced/lux.mdx?collection=docs"), "advanced/post-quantum.mdx": () => import("../content/docs/advanced/post-quantum.mdx?collection=docs"), "advanced/corona.mdx": () => import("../content/docs/advanced/corona.mdx?collection=docs"), "getting-started/index.mdx": () => import("../content/docs/getting-started/index.mdx?collection=docs"), "bindings/c.mdx": () => import("../content/docs/bindings/c.mdx?collection=docs"), "bindings/cpp.mdx": () => import("../content/docs/bindings/cpp.mdx?collection=docs"), "bindings/csharp.mdx": () => import("../content/docs/bindings/csharp.mdx?collection=docs"), "bindings/erlang.mdx": () => import("../content/docs/bindings/erlang.mdx?collection=docs"), "bindings/go.mdx": () => import("../content/docs/bindings/go.mdx?collection=docs"), "bindings/haskell.mdx": () => import("../content/docs/bindings/haskell.mdx?collection=docs"), "bindings/index.mdx": () => import("../content/docs/bindings/index.mdx?collection=docs"), "bindings/java.mdx": () => import("../content/docs/bindings/java.mdx?collection=docs"), "bindings/javascript.mdx": () => import("../content/docs/bindings/javascript.mdx?collection=docs"), "bindings/ocaml.mdx": () => import("../content/docs/bindings/ocaml.mdx?collection=docs"), "bindings/python.mdx": () => import("../content/docs/bindings/python.mdx?collection=docs"), "bindings/rust.mdx": () => import("../content/docs/bindings/rust.mdx?collection=docs"), "protocol/index.mdx": () => import("../content/docs/protocol/index.mdx?collection=docs"), "overview/architecture.mdx": () => import("../content/docs/overview/architecture.mdx?collection=docs"), "overview/comparison.mdx": () => import("../content/docs/overview/comparison.mdx?collection=docs"), "overview/index.mdx": () => import("../content/docs/overview/index.mdx?collection=docs"), "schema/index.mdx": () => import("../content/docs/schema/index.mdx?collection=docs"), });