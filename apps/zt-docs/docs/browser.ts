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
  docs: create.doc("docs", {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "architecture/index.mdx": () => import("../content/docs/architecture/index.mdx?collection=docs"), "getting-started/index.mdx": () => import("../content/docs/getting-started/index.mdx?collection=docs"), "integration/index.mdx": () => import("../content/docs/integration/index.mdx?collection=docs"), "overview/index.mdx": () => import("../content/docs/overview/index.mdx?collection=docs"), "sdks/c.mdx": () => import("../content/docs/sdks/c.mdx?collection=docs"), "sdks/cpp.mdx": () => import("../content/docs/sdks/cpp.mdx?collection=docs"), "sdks/go.mdx": () => import("../content/docs/sdks/go.mdx?collection=docs"), "sdks/index.mdx": () => import("../content/docs/sdks/index.mdx?collection=docs"), "sdks/python.mdx": () => import("../content/docs/sdks/python.mdx?collection=docs"), "sdks/rust.mdx": () => import("../content/docs/sdks/rust.mdx?collection=docs"), "sdks/typescript.mdx": () => import("../content/docs/sdks/typescript.mdx?collection=docs"), }),
};
export default browserCollections;