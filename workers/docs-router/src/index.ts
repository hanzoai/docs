// docs.hanzo.ai edge router.
//
// The docs site is a single Cloudflare Pages project (`hanzo-docs`) built in one
// unified pass — core pages, every service and every synced OSS project. The
// former federated layout (one Pages project per section, stitched here by path
// prefix) is retired: its `*.pages.dev` origins went stale and 530'd whole
// sections (/docs/projects/*, /docs/services/{iam,kms,platform}/*). One origin,
// one build — nothing to stitch, nothing to go stale.
const MAIN_ORIGIN = 'hanzo-docs.pages.dev';

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    return fetch(new Request(`https://${MAIN_ORIGIN}${url.pathname}${url.search}`, request));
  },
};
