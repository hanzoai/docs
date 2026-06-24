// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"changelog.mdx": () => import("../content/docs/changelog.mdx?collection=docs"), "getting-started.mdx": () => import("../content/docs/getting-started.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "nist-mptc.mdx": () => import("../content/docs/nist-mptc.mdx?collection=docs"), "postmortem.mdx": () => import("../content/docs/postmortem.mdx?collection=docs"), "security.mdx": () => import("../content/docs/security.mdx?collection=docs"), "proofs/axiom-inventory.mdx": () => import("../content/docs/proofs/axiom-inventory.mdx?collection=docs"), "proofs/extraction.mdx": () => import("../content/docs/proofs/extraction.mdx?collection=docs"), "proofs/lean-bridge.mdx": () => import("../content/docs/proofs/lean-bridge.mdx?collection=docs"), "proofs/overview.mdx": () => import("../content/docs/proofs/overview.mdx?collection=docs"), "protocol/dkg.mdx": () => import("../content/docs/protocol/dkg.mdx?collection=docs"), "protocol/fips-204.mdx": () => import("../content/docs/protocol/fips-204.mdx?collection=docs"), "protocol/overview.mdx": () => import("../content/docs/protocol/overview.mdx?collection=docs"), "protocol/parameters.mdx": () => import("../content/docs/protocol/parameters.mdx?collection=docs"), "reference/api.mdx": () => import("../content/docs/reference/api.mdx?collection=docs"), "reference/interop.mdx": () => import("../content/docs/reference/interop.mdx?collection=docs"), "reference/kat.mdx": () => import("../content/docs/reference/kat.mdx?collection=docs"), }),
};
export default browserCollections;