// @ts-nocheck
import { frontmatter as __fd_glob_7 } from "../content/docs/zones.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_6 } from "../content/docs/records.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_5 } from "../content/docs/operator.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_4 } from "../content/docs/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_3 } from "../content/docs/cloudflare.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_2 } from "../content/docs/architecture.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_1 } from "../content/docs/api-reference.mdx?collection=docs&only=frontmatter"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
    docs: {
      /**
       * extracted references (e.g. hrefs, paths), useful for analyzing relationships between pages.
       */
      extractedReferences: import("fumadocs-mdx").ExtractedReference[];
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

export const docs = await create.docsLazy("docs", "content/docs", {"meta.json": __fd_glob_0, }, {"api-reference.mdx": __fd_glob_1, "architecture.mdx": __fd_glob_2, "cloudflare.mdx": __fd_glob_3, "index.mdx": __fd_glob_4, "operator.mdx": __fd_glob_5, "records.mdx": __fd_glob_6, "zones.mdx": __fd_glob_7, }, {"api-reference.mdx": () => import("../content/docs/api-reference.mdx?collection=docs"), "architecture.mdx": () => import("../content/docs/architecture.mdx?collection=docs"), "cloudflare.mdx": () => import("../content/docs/cloudflare.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "operator.mdx": () => import("../content/docs/operator.mdx?collection=docs"), "records.mdx": () => import("../content/docs/records.mdx?collection=docs"), "zones.mdx": () => import("../content/docs/zones.mdx?collection=docs"), });