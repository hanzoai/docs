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
  docs: create.doc("docs", {"api-reference.mdx": () => import("../content/docs/api-reference.mdx?collection=docs"), "architecture.mdx": () => import("../content/docs/architecture.mdx?collection=docs"), "cloudflare.mdx": () => import("../content/docs/cloudflare.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "operator.mdx": () => import("../content/docs/operator.mdx?collection=docs"), "records.mdx": () => import("../content/docs/records.mdx?collection=docs"), "zones.mdx": () => import("../content/docs/zones.mdx?collection=docs"), }),
};
export default browserCollections;