// @ts-nocheck
import { frontmatter as __fd_glob_15 } from "../content/docs/providers/hetzner.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_14 } from "../content/docs/providers/digitalocean.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_13 } from "../content/docs/providers/aws.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_12 } from "../content/docs/pricing/plans.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_11 } from "../content/docs/getting-started/quickstart.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_10 } from "../content/docs/features/volumes.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_9 } from "../content/docs/features/terminal.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_8 } from "../content/docs/api/vms.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_7 } from "../content/docs/api/authentication.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_6 } from "../content/docs/index.mdx?collection=docs&only=frontmatter"
import { default as __fd_glob_5 } from "../content/docs/providers/meta.json?collection=docs"
import { default as __fd_glob_4 } from "../content/docs/pricing/meta.json?collection=docs"
import { default as __fd_glob_3 } from "../content/docs/getting-started/meta.json?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/features/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/api/meta.json?collection=docs"
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

export const docs = await create.docsLazy("docs", "content/docs", {"meta.json": __fd_glob_0, "api/meta.json": __fd_glob_1, "features/meta.json": __fd_glob_2, "getting-started/meta.json": __fd_glob_3, "pricing/meta.json": __fd_glob_4, "providers/meta.json": __fd_glob_5, }, {"index.mdx": __fd_glob_6, "api/authentication.mdx": __fd_glob_7, "api/vms.mdx": __fd_glob_8, "features/terminal.mdx": __fd_glob_9, "features/volumes.mdx": __fd_glob_10, "getting-started/quickstart.mdx": __fd_glob_11, "pricing/plans.mdx": __fd_glob_12, "providers/aws.mdx": __fd_glob_13, "providers/digitalocean.mdx": __fd_glob_14, "providers/hetzner.mdx": __fd_glob_15, }, {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "api/authentication.mdx": () => import("../content/docs/api/authentication.mdx?collection=docs"), "api/vms.mdx": () => import("../content/docs/api/vms.mdx?collection=docs"), "features/terminal.mdx": () => import("../content/docs/features/terminal.mdx?collection=docs"), "features/volumes.mdx": () => import("../content/docs/features/volumes.mdx?collection=docs"), "getting-started/quickstart.mdx": () => import("../content/docs/getting-started/quickstart.mdx?collection=docs"), "pricing/plans.mdx": () => import("../content/docs/pricing/plans.mdx?collection=docs"), "providers/aws.mdx": () => import("../content/docs/providers/aws.mdx?collection=docs"), "providers/digitalocean.mdx": () => import("../content/docs/providers/digitalocean.mdx?collection=docs"), "providers/hetzner.mdx": () => import("../content/docs/providers/hetzner.mdx?collection=docs"), });