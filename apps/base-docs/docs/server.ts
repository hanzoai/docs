// @ts-nocheck
import { frontmatter as __fd_glob_17 } from "../content/docs/sdk/javascript.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_16 } from "../content/docs/sdk/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_15 } from "../content/docs/sdk/go.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_14 } from "../content/docs/deployment/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_13 } from "../content/docs/realtime/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_12 } from "../content/docs/file-storage/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_11 } from "../content/docs/getting-started/quickstart.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_10 } from "../content/docs/getting-started/project-structure.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_9 } from "../content/docs/getting-started/installation.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_8 } from "../content/docs/getting-started/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_7 } from "../content/docs/collections/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_6 } from "../content/docs/cloud-functions/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_5 } from "../content/docs/auth/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_4 } from "../content/docs/partner-guide.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_3 } from "../content/docs/index.mdx?collection=docs&only=frontmatter"
import { default as __fd_glob_2 } from "../content/docs/getting-started/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/sdk/meta.json?collection=docs"
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

export const docs = await create.docsLazy("docs", "content/docs", {"meta.json": __fd_glob_0, "sdk/meta.json": __fd_glob_1, "getting-started/meta.json": __fd_glob_2, }, {"index.mdx": __fd_glob_3, "partner-guide.mdx": __fd_glob_4, "auth/index.mdx": __fd_glob_5, "cloud-functions/index.mdx": __fd_glob_6, "collections/index.mdx": __fd_glob_7, "getting-started/index.mdx": __fd_glob_8, "getting-started/installation.mdx": __fd_glob_9, "getting-started/project-structure.mdx": __fd_glob_10, "getting-started/quickstart.mdx": __fd_glob_11, "file-storage/index.mdx": __fd_glob_12, "realtime/index.mdx": __fd_glob_13, "deployment/index.mdx": __fd_glob_14, "sdk/go.mdx": __fd_glob_15, "sdk/index.mdx": __fd_glob_16, "sdk/javascript.mdx": __fd_glob_17, }, {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "partner-guide.mdx": () => import("../content/docs/partner-guide.mdx?collection=docs"), "auth/index.mdx": () => import("../content/docs/auth/index.mdx?collection=docs"), "cloud-functions/index.mdx": () => import("../content/docs/cloud-functions/index.mdx?collection=docs"), "collections/index.mdx": () => import("../content/docs/collections/index.mdx?collection=docs"), "getting-started/index.mdx": () => import("../content/docs/getting-started/index.mdx?collection=docs"), "getting-started/installation.mdx": () => import("../content/docs/getting-started/installation.mdx?collection=docs"), "getting-started/project-structure.mdx": () => import("../content/docs/getting-started/project-structure.mdx?collection=docs"), "getting-started/quickstart.mdx": () => import("../content/docs/getting-started/quickstart.mdx?collection=docs"), "file-storage/index.mdx": () => import("../content/docs/file-storage/index.mdx?collection=docs"), "realtime/index.mdx": () => import("../content/docs/realtime/index.mdx?collection=docs"), "deployment/index.mdx": () => import("../content/docs/deployment/index.mdx?collection=docs"), "sdk/go.mdx": () => import("../content/docs/sdk/go.mdx?collection=docs"), "sdk/index.mdx": () => import("../content/docs/sdk/index.mdx?collection=docs"), "sdk/javascript.mdx": () => import("../content/docs/sdk/javascript.mdx?collection=docs"), });