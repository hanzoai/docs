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
  docs: create.doc("docs", {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "api/authentication.mdx": () => import("../content/docs/api/authentication.mdx?collection=docs"), "api/vms.mdx": () => import("../content/docs/api/vms.mdx?collection=docs"), "features/terminal.mdx": () => import("../content/docs/features/terminal.mdx?collection=docs"), "features/volumes.mdx": () => import("../content/docs/features/volumes.mdx?collection=docs"), "getting-started/quickstart.mdx": () => import("../content/docs/getting-started/quickstart.mdx?collection=docs"), "pricing/plans.mdx": () => import("../content/docs/pricing/plans.mdx?collection=docs"), "providers/aws.mdx": () => import("../content/docs/providers/aws.mdx?collection=docs"), "providers/digitalocean.mdx": () => import("../content/docs/providers/digitalocean.mdx?collection=docs"), "providers/hetzner.mdx": () => import("../content/docs/providers/hetzner.mdx?collection=docs"), }),
};
export default browserCollections;