// @ts-nocheck
import { browser } from '@hanzo/docs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("@hanzo/docs-mdx/runtime/types").InternalTypeConfig & {
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
}>();
const browserCollections = {
  docs: create.doc("docs", {"faq.mdx": () => import("../content/docs/faq.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "architecture/agent-mesh.mdx": () => import("../content/docs/architecture/agent-mesh.mdx?collection=docs"), "architecture/index.mdx": () => import("../content/docs/architecture/index.mdx?collection=docs"), "configuration/example-config.mdx": () => import("../content/docs/configuration/example-config.mdx?collection=docs"), "configuration/index.mdx": () => import("../content/docs/configuration/index.mdx?collection=docs"), "configuration/platform-sandboxing.mdx": () => import("../content/docs/configuration/platform-sandboxing.mdx?collection=docs"), "configuration/sandbox.mdx": () => import("../content/docs/configuration/sandbox.mdx?collection=docs"), "contributing/cla.mdx": () => import("../content/docs/contributing/cla.mdx?collection=docs"), "contributing/index.mdx": () => import("../content/docs/contributing/index.mdx?collection=docs"), "getting-started/authentication.mdx": () => import("../content/docs/getting-started/authentication.mdx?collection=docs"), "getting-started/homebrew.mdx": () => import("../content/docs/getting-started/homebrew.mdx?collection=docs"), "getting-started/index.mdx": () => import("../content/docs/getting-started/index.mdx?collection=docs"), "getting-started/install.mdx": () => import("../content/docs/getting-started/install.mdx?collection=docs"), "integrations/agent-platform.mdx": () => import("../content/docs/integrations/agent-platform.mdx?collection=docs"), "integrations/copilot.mdx": () => import("../content/docs/integrations/copilot.mdx?collection=docs"), "integrations/index.mdx": () => import("../content/docs/integrations/index.mdx?collection=docs"), "integrations/zed.mdx": () => import("../content/docs/integrations/zed.mdx?collection=docs"), "reference/cli.mdx": () => import("../content/docs/reference/cli.mdx?collection=docs"), "reference/index.mdx": () => import("../content/docs/reference/index.mdx?collection=docs"), "usage/advanced.mdx": () => import("../content/docs/usage/advanced.mdx?collection=docs"), "usage/agents.mdx": () => import("../content/docs/usage/agents.mdx?collection=docs"), "usage/auto-drive.mdx": () => import("../content/docs/usage/auto-drive.mdx?collection=docs"), "usage/exec.mdx": () => import("../content/docs/usage/exec.mdx?collection=docs"), "usage/execpolicy.mdx": () => import("../content/docs/usage/execpolicy.mdx?collection=docs"), "usage/index.mdx": () => import("../content/docs/usage/index.mdx?collection=docs"), "usage/js-repl.mdx": () => import("../content/docs/usage/js-repl.mdx?collection=docs"), "usage/prompts.mdx": () => import("../content/docs/usage/prompts.mdx?collection=docs"), "usage/settings.mdx": () => import("../content/docs/usage/settings.mdx?collection=docs"), "usage/skills.mdx": () => import("../content/docs/usage/skills.mdx?collection=docs"), "usage/slash-commands.mdx": () => import("../content/docs/usage/slash-commands.mdx?collection=docs"), }),
};
export default browserCollections;