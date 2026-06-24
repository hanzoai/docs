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
  docs: create.doc("docs", {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "access-control/cluster-permissions.mdx": () => import("../content/docs/access-control/cluster-permissions.mdx?collection=docs"), "access-control/environment-protection.mdx": () => import("../content/docs/access-control/environment-protection.mdx?collection=docs"), "access-control/index.mdx": () => import("../content/docs/access-control/index.mdx?collection=docs"), "access-control/invitations.mdx": () => import("../content/docs/access-control/invitations.mdx?collection=docs"), "access-control/organizations.mdx": () => import("../content/docs/access-control/organizations.mdx?collection=docs"), "access-control/roles.mdx": () => import("../content/docs/access-control/roles.mdx?collection=docs"), "api/authentication.mdx": () => import("../content/docs/api/authentication.mdx?collection=docs"), "api/clusters.mdx": () => import("../content/docs/api/clusters.mdx?collection=docs"), "api/containers.mdx": () => import("../content/docs/api/containers.mdx?collection=docs"), "api/index.mdx": () => import("../content/docs/api/index.mdx?collection=docs"), "api/organizations.mdx": () => import("../content/docs/api/organizations.mdx?collection=docs"), "api/vms.mdx": () => import("../content/docs/api/vms.mdx?collection=docs"), "clusters/fleet.mdx": () => import("../content/docs/clusters/fleet.mdx?collection=docs"), "clusters/index.mdx": () => import("../content/docs/clusters/index.mdx?collection=docs"), "clusters/node-pools.mdx": () => import("../content/docs/clusters/node-pools.mdx?collection=docs"), "clusters/provisioning.mdx": () => import("../content/docs/clusters/provisioning.mdx?collection=docs"), "clusters/register.mdx": () => import("../content/docs/clusters/register.mdx?collection=docs"), "deployments/container-registry.mdx": () => import("../content/docs/deployments/container-registry.mdx?collection=docs"), "deployments/docker-compose.mdx": () => import("../content/docs/deployments/docker-compose.mdx?collection=docs"), "deployments/docker-swarm.mdx": () => import("../content/docs/deployments/docker-swarm.mdx?collection=docs"), "deployments/domains-tls.mdx": () => import("../content/docs/deployments/domains-tls.mdx?collection=docs"), "deployments/git-deployments.mdx": () => import("../content/docs/deployments/git-deployments.mdx?collection=docs"), "deployments/index.mdx": () => import("../content/docs/deployments/index.mdx?collection=docs"), "deployments/kubernetes.mdx": () => import("../content/docs/deployments/kubernetes.mdx?collection=docs"), "getting-started/cli.mdx": () => import("../content/docs/getting-started/cli.mdx?collection=docs"), "getting-started/concepts.mdx": () => import("../content/docs/getting-started/concepts.mdx?collection=docs"), "getting-started/index.mdx": () => import("../content/docs/getting-started/index.mdx?collection=docs"), "getting-started/quickstart.mdx": () => import("../content/docs/getting-started/quickstart.mdx?collection=docs"), "pricing/compute.mdx": () => import("../content/docs/pricing/compute.mdx?collection=docs"), "pricing/index.mdx": () => import("../content/docs/pricing/index.mdx?collection=docs"), "pricing/plans.mdx": () => import("../content/docs/pricing/plans.mdx?collection=docs"), "pricing/storage.mdx": () => import("../content/docs/pricing/storage.mdx?collection=docs"), "virtual-machines/aws.mdx": () => import("../content/docs/virtual-machines/aws.mdx?collection=docs"), "virtual-machines/digitalocean.mdx": () => import("../content/docs/virtual-machines/digitalocean.mdx?collection=docs"), "virtual-machines/hetzner.mdx": () => import("../content/docs/virtual-machines/hetzner.mdx?collection=docs"), "virtual-machines/index.mdx": () => import("../content/docs/virtual-machines/index.mdx?collection=docs"), "virtual-machines/terminal.mdx": () => import("../content/docs/virtual-machines/terminal.mdx?collection=docs"), "virtual-machines/volumes.mdx": () => import("../content/docs/virtual-machines/volumes.mdx?collection=docs"), }),
};
export default browserCollections;