// @ts-nocheck
import { frontmatter as __fd_glob_17 } from "../content/docs/sdks/typescript.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_16 } from "../content/docs/sdks/rust.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_15 } from "../content/docs/sdks/python.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_14 } from "../content/docs/sdks/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_13 } from "../content/docs/sdks/go.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_12 } from "../content/docs/sdks/cpp.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_11 } from "../content/docs/sdks/c.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_10 } from "../content/docs/overview/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_9 } from "../content/docs/integration/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_8 } from "../content/docs/getting-started/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_7 } from "../content/docs/architecture/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_6 } from "../content/docs/index.mdx?collection=docs&only=frontmatter"
import { default as __fd_glob_5 } from "../content/docs/sdks/meta.json?collection=docs"
import { default as __fd_glob_4 } from "../content/docs/overview/meta.json?collection=docs"
import { default as __fd_glob_3 } from "../content/docs/integration/meta.json?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/getting-started/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/architecture/meta.json?collection=docs"
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

export const docs = await create.docsLazy("docs", "content/docs", {"meta.json": __fd_glob_0, "architecture/meta.json": __fd_glob_1, "getting-started/meta.json": __fd_glob_2, "integration/meta.json": __fd_glob_3, "overview/meta.json": __fd_glob_4, "sdks/meta.json": __fd_glob_5, }, {"index.mdx": __fd_glob_6, "architecture/index.mdx": __fd_glob_7, "getting-started/index.mdx": __fd_glob_8, "integration/index.mdx": __fd_glob_9, "overview/index.mdx": __fd_glob_10, "sdks/c.mdx": __fd_glob_11, "sdks/cpp.mdx": __fd_glob_12, "sdks/go.mdx": __fd_glob_13, "sdks/index.mdx": __fd_glob_14, "sdks/python.mdx": __fd_glob_15, "sdks/rust.mdx": __fd_glob_16, "sdks/typescript.mdx": __fd_glob_17, }, {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "architecture/index.mdx": () => import("../content/docs/architecture/index.mdx?collection=docs"), "getting-started/index.mdx": () => import("../content/docs/getting-started/index.mdx?collection=docs"), "integration/index.mdx": () => import("../content/docs/integration/index.mdx?collection=docs"), "overview/index.mdx": () => import("../content/docs/overview/index.mdx?collection=docs"), "sdks/c.mdx": () => import("../content/docs/sdks/c.mdx?collection=docs"), "sdks/cpp.mdx": () => import("../content/docs/sdks/cpp.mdx?collection=docs"), "sdks/go.mdx": () => import("../content/docs/sdks/go.mdx?collection=docs"), "sdks/index.mdx": () => import("../content/docs/sdks/index.mdx?collection=docs"), "sdks/python.mdx": () => import("../content/docs/sdks/python.mdx?collection=docs"), "sdks/rust.mdx": () => import("../content/docs/sdks/rust.mdx?collection=docs"), "sdks/typescript.mdx": () => import("../content/docs/sdks/typescript.mdx?collection=docs"), });