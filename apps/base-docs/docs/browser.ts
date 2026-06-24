// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
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
}>();
const browserCollections = {
  docs: create.doc("docs", {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "auth/index.mdx": () => import("../content/docs/auth/index.mdx?collection=docs"), "cloud-functions/index.mdx": () => import("../content/docs/cloud-functions/index.mdx?collection=docs"), "collections/index.mdx": () => import("../content/docs/collections/index.mdx?collection=docs"), "deployment/index.mdx": () => import("../content/docs/deployment/index.mdx?collection=docs"), "file-storage/index.mdx": () => import("../content/docs/file-storage/index.mdx?collection=docs"), "getting-started/index.mdx": () => import("../content/docs/getting-started/index.mdx?collection=docs"), "getting-started/installation.mdx": () => import("../content/docs/getting-started/installation.mdx?collection=docs"), "getting-started/project-structure.mdx": () => import("../content/docs/getting-started/project-structure.mdx?collection=docs"), "getting-started/quickstart.mdx": () => import("../content/docs/getting-started/quickstart.mdx?collection=docs"), "realtime/index.mdx": () => import("../content/docs/realtime/index.mdx?collection=docs"), "sdk/go.mdx": () => import("../content/docs/sdk/go.mdx?collection=docs"), "sdk/index.mdx": () => import("../content/docs/sdk/index.mdx?collection=docs"), "sdk/javascript.mdx": () => import("../content/docs/sdk/javascript.mdx?collection=docs"), }),
};
export default browserCollections;