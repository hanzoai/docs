// @ts-nocheck
import { frontmatter as __fd_glob_46 } from "../content/docs/virtual-machines/volumes.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_45 } from "../content/docs/virtual-machines/terminal.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_44 } from "../content/docs/virtual-machines/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_43 } from "../content/docs/virtual-machines/hetzner.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_42 } from "../content/docs/virtual-machines/digitalocean.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_41 } from "../content/docs/virtual-machines/aws.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_40 } from "../content/docs/pricing/storage.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_39 } from "../content/docs/pricing/plans.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_38 } from "../content/docs/pricing/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_37 } from "../content/docs/pricing/compute.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_36 } from "../content/docs/getting-started/quickstart.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_35 } from "../content/docs/getting-started/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_34 } from "../content/docs/getting-started/concepts.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_33 } from "../content/docs/getting-started/cli.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_32 } from "../content/docs/deployments/kubernetes.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_31 } from "../content/docs/deployments/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_30 } from "../content/docs/deployments/git-deployments.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_29 } from "../content/docs/deployments/domains-tls.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_28 } from "../content/docs/deployments/docker-swarm.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_27 } from "../content/docs/deployments/docker-compose.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_26 } from "../content/docs/deployments/container-registry.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_25 } from "../content/docs/clusters/register.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_24 } from "../content/docs/clusters/provisioning.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_23 } from "../content/docs/clusters/node-pools.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_22 } from "../content/docs/clusters/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_21 } from "../content/docs/clusters/fleet.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_20 } from "../content/docs/api/vms.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_19 } from "../content/docs/api/organizations.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_18 } from "../content/docs/api/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_17 } from "../content/docs/api/containers.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_16 } from "../content/docs/api/clusters.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_15 } from "../content/docs/api/authentication.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_14 } from "../content/docs/access-control/roles.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_13 } from "../content/docs/access-control/organizations.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_12 } from "../content/docs/access-control/invitations.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_11 } from "../content/docs/access-control/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_10 } from "../content/docs/access-control/environment-protection.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_9 } from "../content/docs/access-control/cluster-permissions.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_8 } from "../content/docs/index.mdx?collection=docs&only=frontmatter"
import { default as __fd_glob_7 } from "../content/docs/virtual-machines/meta.json?collection=docs"
import { default as __fd_glob_6 } from "../content/docs/pricing/meta.json?collection=docs"
import { default as __fd_glob_5 } from "../content/docs/getting-started/meta.json?collection=docs"
import { default as __fd_glob_4 } from "../content/docs/deployments/meta.json?collection=docs"
import { default as __fd_glob_3 } from "../content/docs/api/meta.json?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/clusters/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/access-control/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
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
}>({"doc":{"passthroughs":["extractedReferences","lastModified"]}});

export const docs = await create.docsLazy("docs", "content/docs", {"meta.json": __fd_glob_0, "access-control/meta.json": __fd_glob_1, "clusters/meta.json": __fd_glob_2, "api/meta.json": __fd_glob_3, "deployments/meta.json": __fd_glob_4, "getting-started/meta.json": __fd_glob_5, "pricing/meta.json": __fd_glob_6, "virtual-machines/meta.json": __fd_glob_7, }, {"index.mdx": __fd_glob_8, "access-control/cluster-permissions.mdx": __fd_glob_9, "access-control/environment-protection.mdx": __fd_glob_10, "access-control/index.mdx": __fd_glob_11, "access-control/invitations.mdx": __fd_glob_12, "access-control/organizations.mdx": __fd_glob_13, "access-control/roles.mdx": __fd_glob_14, "api/authentication.mdx": __fd_glob_15, "api/clusters.mdx": __fd_glob_16, "api/containers.mdx": __fd_glob_17, "api/index.mdx": __fd_glob_18, "api/organizations.mdx": __fd_glob_19, "api/vms.mdx": __fd_glob_20, "clusters/fleet.mdx": __fd_glob_21, "clusters/index.mdx": __fd_glob_22, "clusters/node-pools.mdx": __fd_glob_23, "clusters/provisioning.mdx": __fd_glob_24, "clusters/register.mdx": __fd_glob_25, "deployments/container-registry.mdx": __fd_glob_26, "deployments/docker-compose.mdx": __fd_glob_27, "deployments/docker-swarm.mdx": __fd_glob_28, "deployments/domains-tls.mdx": __fd_glob_29, "deployments/git-deployments.mdx": __fd_glob_30, "deployments/index.mdx": __fd_glob_31, "deployments/kubernetes.mdx": __fd_glob_32, "getting-started/cli.mdx": __fd_glob_33, "getting-started/concepts.mdx": __fd_glob_34, "getting-started/index.mdx": __fd_glob_35, "getting-started/quickstart.mdx": __fd_glob_36, "pricing/compute.mdx": __fd_glob_37, "pricing/index.mdx": __fd_glob_38, "pricing/plans.mdx": __fd_glob_39, "pricing/storage.mdx": __fd_glob_40, "virtual-machines/aws.mdx": __fd_glob_41, "virtual-machines/digitalocean.mdx": __fd_glob_42, "virtual-machines/hetzner.mdx": __fd_glob_43, "virtual-machines/index.mdx": __fd_glob_44, "virtual-machines/terminal.mdx": __fd_glob_45, "virtual-machines/volumes.mdx": __fd_glob_46, }, {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "access-control/cluster-permissions.mdx": () => import("../content/docs/access-control/cluster-permissions.mdx?collection=docs"), "access-control/environment-protection.mdx": () => import("../content/docs/access-control/environment-protection.mdx?collection=docs"), "access-control/index.mdx": () => import("../content/docs/access-control/index.mdx?collection=docs"), "access-control/invitations.mdx": () => import("../content/docs/access-control/invitations.mdx?collection=docs"), "access-control/organizations.mdx": () => import("../content/docs/access-control/organizations.mdx?collection=docs"), "access-control/roles.mdx": () => import("../content/docs/access-control/roles.mdx?collection=docs"), "api/authentication.mdx": () => import("../content/docs/api/authentication.mdx?collection=docs"), "api/clusters.mdx": () => import("../content/docs/api/clusters.mdx?collection=docs"), "api/containers.mdx": () => import("../content/docs/api/containers.mdx?collection=docs"), "api/index.mdx": () => import("../content/docs/api/index.mdx?collection=docs"), "api/organizations.mdx": () => import("../content/docs/api/organizations.mdx?collection=docs"), "api/vms.mdx": () => import("../content/docs/api/vms.mdx?collection=docs"), "clusters/fleet.mdx": () => import("../content/docs/clusters/fleet.mdx?collection=docs"), "clusters/index.mdx": () => import("../content/docs/clusters/index.mdx?collection=docs"), "clusters/node-pools.mdx": () => import("../content/docs/clusters/node-pools.mdx?collection=docs"), "clusters/provisioning.mdx": () => import("../content/docs/clusters/provisioning.mdx?collection=docs"), "clusters/register.mdx": () => import("../content/docs/clusters/register.mdx?collection=docs"), "deployments/container-registry.mdx": () => import("../content/docs/deployments/container-registry.mdx?collection=docs"), "deployments/docker-compose.mdx": () => import("../content/docs/deployments/docker-compose.mdx?collection=docs"), "deployments/docker-swarm.mdx": () => import("../content/docs/deployments/docker-swarm.mdx?collection=docs"), "deployments/domains-tls.mdx": () => import("../content/docs/deployments/domains-tls.mdx?collection=docs"), "deployments/git-deployments.mdx": () => import("../content/docs/deployments/git-deployments.mdx?collection=docs"), "deployments/index.mdx": () => import("../content/docs/deployments/index.mdx?collection=docs"), "deployments/kubernetes.mdx": () => import("../content/docs/deployments/kubernetes.mdx?collection=docs"), "getting-started/cli.mdx": () => import("../content/docs/getting-started/cli.mdx?collection=docs"), "getting-started/concepts.mdx": () => import("../content/docs/getting-started/concepts.mdx?collection=docs"), "getting-started/index.mdx": () => import("../content/docs/getting-started/index.mdx?collection=docs"), "getting-started/quickstart.mdx": () => import("../content/docs/getting-started/quickstart.mdx?collection=docs"), "pricing/compute.mdx": () => import("../content/docs/pricing/compute.mdx?collection=docs"), "pricing/index.mdx": () => import("../content/docs/pricing/index.mdx?collection=docs"), "pricing/plans.mdx": () => import("../content/docs/pricing/plans.mdx?collection=docs"), "pricing/storage.mdx": () => import("../content/docs/pricing/storage.mdx?collection=docs"), "virtual-machines/aws.mdx": () => import("../content/docs/virtual-machines/aws.mdx?collection=docs"), "virtual-machines/digitalocean.mdx": () => import("../content/docs/virtual-machines/digitalocean.mdx?collection=docs"), "virtual-machines/hetzner.mdx": () => import("../content/docs/virtual-machines/hetzner.mdx?collection=docs"), "virtual-machines/index.mdx": () => import("../content/docs/virtual-machines/index.mdx?collection=docs"), "virtual-machines/terminal.mdx": () => import("../content/docs/virtual-machines/terminal.mdx?collection=docs"), "virtual-machines/volumes.mdx": () => import("../content/docs/virtual-machines/volumes.mdx?collection=docs"), });