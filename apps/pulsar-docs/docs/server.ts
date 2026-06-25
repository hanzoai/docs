// @ts-nocheck
import * as __fd_glob_20 from "../content/docs/reference/kat.mdx?collection=docs"
import * as __fd_glob_19 from "../content/docs/reference/interop.mdx?collection=docs"
import * as __fd_glob_18 from "../content/docs/reference/api.mdx?collection=docs"
import * as __fd_glob_17 from "../content/docs/protocol/parameters.mdx?collection=docs"
import * as __fd_glob_16 from "../content/docs/protocol/overview.mdx?collection=docs"
import * as __fd_glob_15 from "../content/docs/protocol/fips-204.mdx?collection=docs"
import * as __fd_glob_14 from "../content/docs/protocol/dkg.mdx?collection=docs"
import * as __fd_glob_13 from "../content/docs/proofs/overview.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/proofs/lean-bridge.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/proofs/extraction.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/proofs/axiom-inventory.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/security.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/postmortem.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/nist-mptc.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/index.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/getting-started.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/changelog.mdx?collection=docs"
import { default as __fd_glob_3 } from "../content/docs/protocol/meta.json?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/reference/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/proofs/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from '@hanzo/docs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("@hanzo/docs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "proofs/meta.json": __fd_glob_1, "reference/meta.json": __fd_glob_2, "protocol/meta.json": __fd_glob_3, }, {"changelog.mdx": __fd_glob_4, "getting-started.mdx": __fd_glob_5, "index.mdx": __fd_glob_6, "nist-mptc.mdx": __fd_glob_7, "postmortem.mdx": __fd_glob_8, "security.mdx": __fd_glob_9, "proofs/axiom-inventory.mdx": __fd_glob_10, "proofs/extraction.mdx": __fd_glob_11, "proofs/lean-bridge.mdx": __fd_glob_12, "proofs/overview.mdx": __fd_glob_13, "protocol/dkg.mdx": __fd_glob_14, "protocol/fips-204.mdx": __fd_glob_15, "protocol/overview.mdx": __fd_glob_16, "protocol/parameters.mdx": __fd_glob_17, "reference/api.mdx": __fd_glob_18, "reference/interop.mdx": __fd_glob_19, "reference/kat.mdx": __fd_glob_20, });