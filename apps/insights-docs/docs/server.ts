// @ts-nocheck
import * as __fd_glob_17 from "../content/docs/self-hosting/index.mdx?collection=docs"
import * as __fd_glob_16 from "../content/docs/products/surveys.mdx?collection=docs"
import * as __fd_glob_15 from "../content/docs/products/replay.mdx?collection=docs"
import * as __fd_glob_14 from "../content/docs/products/llm-analytics.mdx?collection=docs"
import * as __fd_glob_13 from "../content/docs/products/index.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/products/feature-flags.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/products/experiments.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/privacy/index.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/getting-started/quickstart.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/getting-started/index.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/api/index.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/index.mdx?collection=docs"
import { default as __fd_glob_5 } from "../content/docs/self-hosting/meta.json?collection=docs"
import { default as __fd_glob_4 } from "../content/docs/products/meta.json?collection=docs"
import { default as __fd_glob_3 } from "../content/docs/privacy/meta.json?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/getting-started/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/api/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from '@hanzo/docs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("@hanzo/docs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "api/meta.json": __fd_glob_1, "getting-started/meta.json": __fd_glob_2, "privacy/meta.json": __fd_glob_3, "products/meta.json": __fd_glob_4, "self-hosting/meta.json": __fd_glob_5, }, {"index.mdx": __fd_glob_6, "api/index.mdx": __fd_glob_7, "getting-started/index.mdx": __fd_glob_8, "getting-started/quickstart.mdx": __fd_glob_9, "privacy/index.mdx": __fd_glob_10, "products/experiments.mdx": __fd_glob_11, "products/feature-flags.mdx": __fd_glob_12, "products/index.mdx": __fd_glob_13, "products/llm-analytics.mdx": __fd_glob_14, "products/replay.mdx": __fd_glob_15, "products/surveys.mdx": __fd_glob_16, "self-hosting/index.mdx": __fd_glob_17, });