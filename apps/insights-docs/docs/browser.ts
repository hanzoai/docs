// @ts-nocheck
import { browser } from '@hanzo/docs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("@hanzo/docs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "api/index.mdx": () => import("../content/docs/api/index.mdx?collection=docs"), "getting-started/index.mdx": () => import("../content/docs/getting-started/index.mdx?collection=docs"), "getting-started/quickstart.mdx": () => import("../content/docs/getting-started/quickstart.mdx?collection=docs"), "privacy/index.mdx": () => import("../content/docs/privacy/index.mdx?collection=docs"), "products/experiments.mdx": () => import("../content/docs/products/experiments.mdx?collection=docs"), "products/feature-flags.mdx": () => import("../content/docs/products/feature-flags.mdx?collection=docs"), "products/index.mdx": () => import("../content/docs/products/index.mdx?collection=docs"), "products/llm-analytics.mdx": () => import("../content/docs/products/llm-analytics.mdx?collection=docs"), "products/replay.mdx": () => import("../content/docs/products/replay.mdx?collection=docs"), "products/surveys.mdx": () => import("../content/docs/products/surveys.mdx?collection=docs"), "self-hosting/index.mdx": () => import("../content/docs/self-hosting/index.mdx?collection=docs"), }),
};
export default browserCollections;