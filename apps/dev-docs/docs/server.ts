// @ts-nocheck
import { frontmatter as __fd_glob_43 } from "../content/docs/integrations/zed.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_42 } from "../content/docs/integrations/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_41 } from "../content/docs/integrations/copilot.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_40 } from "../content/docs/usage/slash-commands.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_39 } from "../content/docs/usage/skills.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_38 } from "../content/docs/usage/settings.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_37 } from "../content/docs/usage/prompts.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_36 } from "../content/docs/usage/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_35 } from "../content/docs/usage/execpolicy.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_34 } from "../content/docs/usage/exec.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_33 } from "../content/docs/usage/auto-drive.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_32 } from "../content/docs/usage/agents.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_31 } from "../content/docs/usage/advanced.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_30 } from "../content/docs/reference/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_29 } from "../content/docs/reference/cli.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_28 } from "../content/docs/platform/pools-design.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_27 } from "../content/docs/platform/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_26 } from "../content/docs/platform/compute-rewards.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_25 } from "../content/docs/platform/components.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_24 } from "../content/docs/configuration/sandbox.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_23 } from "../content/docs/configuration/platform-sandboxing.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_22 } from "../content/docs/configuration/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_21 } from "../content/docs/configuration/example-config.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_20 } from "../content/docs/getting-started/install.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_19 } from "../content/docs/getting-started/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_18 } from "../content/docs/getting-started/homebrew.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_17 } from "../content/docs/getting-started/authentication.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_16 } from "../content/docs/contributing/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_15 } from "../content/docs/contributing/cla.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_14 } from "../content/docs/architecture/platform.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_13 } from "../content/docs/architecture/parity.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_12 } from "../content/docs/architecture/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_11 } from "../content/docs/architecture/agent-mesh.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_10 } from "../content/docs/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_9 } from "../content/docs/faq.mdx?collection=docs&only=frontmatter"
import { default as __fd_glob_8 } from "../content/docs/platform/meta.json?collection=docs"
import { default as __fd_glob_7 } from "../content/docs/usage/meta.json?collection=docs"
import { default as __fd_glob_6 } from "../content/docs/reference/meta.json?collection=docs"
import { default as __fd_glob_5 } from "../content/docs/integrations/meta.json?collection=docs"
import { default as __fd_glob_4 } from "../content/docs/contributing/meta.json?collection=docs"
import { default as __fd_glob_3 } from "../content/docs/getting-started/meta.json?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/configuration/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/architecture/meta.json?collection=docs"
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

export const docs = await create.docsLazy("docs", "content/docs", {"meta.json": __fd_glob_0, "architecture/meta.json": __fd_glob_1, "configuration/meta.json": __fd_glob_2, "getting-started/meta.json": __fd_glob_3, "contributing/meta.json": __fd_glob_4, "integrations/meta.json": __fd_glob_5, "reference/meta.json": __fd_glob_6, "usage/meta.json": __fd_glob_7, "platform/meta.json": __fd_glob_8, }, {"faq.mdx": __fd_glob_9, "index.mdx": __fd_glob_10, "architecture/agent-mesh.mdx": __fd_glob_11, "architecture/index.mdx": __fd_glob_12, "architecture/parity.mdx": __fd_glob_13, "architecture/platform.mdx": __fd_glob_14, "contributing/cla.mdx": __fd_glob_15, "contributing/index.mdx": __fd_glob_16, "getting-started/authentication.mdx": __fd_glob_17, "getting-started/homebrew.mdx": __fd_glob_18, "getting-started/index.mdx": __fd_glob_19, "getting-started/install.mdx": __fd_glob_20, "configuration/example-config.mdx": __fd_glob_21, "configuration/index.mdx": __fd_glob_22, "configuration/platform-sandboxing.mdx": __fd_glob_23, "configuration/sandbox.mdx": __fd_glob_24, "platform/components.mdx": __fd_glob_25, "platform/compute-rewards.mdx": __fd_glob_26, "platform/index.mdx": __fd_glob_27, "platform/pools-design.mdx": __fd_glob_28, "reference/cli.mdx": __fd_glob_29, "reference/index.mdx": __fd_glob_30, "usage/advanced.mdx": __fd_glob_31, "usage/agents.mdx": __fd_glob_32, "usage/auto-drive.mdx": __fd_glob_33, "usage/exec.mdx": __fd_glob_34, "usage/execpolicy.mdx": __fd_glob_35, "usage/index.mdx": __fd_glob_36, "usage/prompts.mdx": __fd_glob_37, "usage/settings.mdx": __fd_glob_38, "usage/skills.mdx": __fd_glob_39, "usage/slash-commands.mdx": __fd_glob_40, "integrations/copilot.mdx": __fd_glob_41, "integrations/index.mdx": __fd_glob_42, "integrations/zed.mdx": __fd_glob_43, }, {"faq.mdx": () => import("../content/docs/faq.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "architecture/agent-mesh.mdx": () => import("../content/docs/architecture/agent-mesh.mdx?collection=docs"), "architecture/index.mdx": () => import("../content/docs/architecture/index.mdx?collection=docs"), "architecture/parity.mdx": () => import("../content/docs/architecture/parity.mdx?collection=docs"), "architecture/platform.mdx": () => import("../content/docs/architecture/platform.mdx?collection=docs"), "contributing/cla.mdx": () => import("../content/docs/contributing/cla.mdx?collection=docs"), "contributing/index.mdx": () => import("../content/docs/contributing/index.mdx?collection=docs"), "getting-started/authentication.mdx": () => import("../content/docs/getting-started/authentication.mdx?collection=docs"), "getting-started/homebrew.mdx": () => import("../content/docs/getting-started/homebrew.mdx?collection=docs"), "getting-started/index.mdx": () => import("../content/docs/getting-started/index.mdx?collection=docs"), "getting-started/install.mdx": () => import("../content/docs/getting-started/install.mdx?collection=docs"), "configuration/example-config.mdx": () => import("../content/docs/configuration/example-config.mdx?collection=docs"), "configuration/index.mdx": () => import("../content/docs/configuration/index.mdx?collection=docs"), "configuration/platform-sandboxing.mdx": () => import("../content/docs/configuration/platform-sandboxing.mdx?collection=docs"), "configuration/sandbox.mdx": () => import("../content/docs/configuration/sandbox.mdx?collection=docs"), "platform/components.mdx": () => import("../content/docs/platform/components.mdx?collection=docs"), "platform/compute-rewards.mdx": () => import("../content/docs/platform/compute-rewards.mdx?collection=docs"), "platform/index.mdx": () => import("../content/docs/platform/index.mdx?collection=docs"), "platform/pools-design.mdx": () => import("../content/docs/platform/pools-design.mdx?collection=docs"), "reference/cli.mdx": () => import("../content/docs/reference/cli.mdx?collection=docs"), "reference/index.mdx": () => import("../content/docs/reference/index.mdx?collection=docs"), "usage/advanced.mdx": () => import("../content/docs/usage/advanced.mdx?collection=docs"), "usage/agents.mdx": () => import("../content/docs/usage/agents.mdx?collection=docs"), "usage/auto-drive.mdx": () => import("../content/docs/usage/auto-drive.mdx?collection=docs"), "usage/exec.mdx": () => import("../content/docs/usage/exec.mdx?collection=docs"), "usage/execpolicy.mdx": () => import("../content/docs/usage/execpolicy.mdx?collection=docs"), "usage/index.mdx": () => import("../content/docs/usage/index.mdx?collection=docs"), "usage/prompts.mdx": () => import("../content/docs/usage/prompts.mdx?collection=docs"), "usage/settings.mdx": () => import("../content/docs/usage/settings.mdx?collection=docs"), "usage/skills.mdx": () => import("../content/docs/usage/skills.mdx?collection=docs"), "usage/slash-commands.mdx": () => import("../content/docs/usage/slash-commands.mdx?collection=docs"), "integrations/copilot.mdx": () => import("../content/docs/integrations/copilot.mdx?collection=docs"), "integrations/index.mdx": () => import("../content/docs/integrations/index.mdx?collection=docs"), "integrations/zed.mdx": () => import("../content/docs/integrations/zed.mdx?collection=docs"), });