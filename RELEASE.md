# Publishing docs.hanzo.ai

Everything a publish needs, and what each path is waiting on. Every fact below
was read off the live systems, not off a design doc; where something could not be
checked, it says so.

## Publishing is two acts

    1. build + push   ghcr.io/hanzoai/docs:<tag>
    2. move the pin   hanzoai/universe  charts/app/values/hanzo/docs.yaml

Act 2 is the deploy. That file carries `cd.automated: true`, which makes the
GitOps plane the sole writer of the workload and self-heal anything else that
touches it — so the commit that edits it IS the rollout, and conversely a
`kubectl patch` or a `deploy:` block in `hanzo.yml` would be reverted on the next
sync. Nothing goes live because it was built; something goes live because that
file names it.

## Where things stand

`ghcr.io/hanzoai/docs` is anonymously pullable, so this is checkable by anyone:

| tag | shape | exists |
|---|---|---|
| `e8fb4369c925e75b1277d5a4a1c61e16a9bd93be` | full SHA — the live pin | yes |
| `latest` | floating | yes, and it is a **different** image from the pin |
| `f2ad2c477311dc1acfc8fbb725e313777b6dd0f0` | full SHA — current `main` | no |
| `f2ad2c477311dc1acfc8fbb725e313777b6dd0f0-amd64-docs` | platform webhook shape | no |
| `sha-f2ad2c4-amd64` | hanzoai/ci shape | no |

The live pin resolves to `sha256:2b589f95…`, which is byte-for-byte the `digest:`
in the values file — the pin mechanism is sound. The last three rows are the
useful ones: **no builder has produced an image for current `main`**, in any of
the three tag shapes, so all lanes are genuinely cold rather than one of them
quietly working. `main` is 2 commits ahead of what is serving.

## Act 1 — the four ways to build

### 1. The runner fabric — `POST /v1/runner`

The only path that is one credential away from working. The Dockerfile names it
as the real builder, and it is what produced the image now serving.

```
POST https://platform.hanzo.ai/v1/runner
Authorization: Bearer $PLATFORM_BUILD_CALLBACK_TOKEN
Content-Type: application/json

{"repo":"hanzo-docs/docs",
 "sha":"<40-char sha>",
 "image":"ghcr.io/hanzoai/docs:<40-char sha>"}
```

or, the same request with the recipe read for you:

```
hanzo build hanzo-docs/docs --sha <40-char sha> \
  --image ghcr.io/hanzoai/docs:<40-char sha>
```

**Credential: `PLATFORM_BUILD_CALLBACK_TOKEN`**, in KMS. Unauthenticated the
route answers `401 {"message":"Invalid enqueue token"}` — a 401, not a 403, and
not the `500 PLATFORM_BUILD_CALLBACK_TOKEN is not configured` it returns when the
server lacks the token. So the endpoint is armed and correct on the far side; the
only missing piece is the bearer.

Two things to know before using it:

- **`hanzo build` will not fall back to your login.** The CLI resolves the bearer
  as `--build-token` → `HANZO_BUILD_TOKEN` → `PLATFORM_BUILD_CALLBACK_TOKEN` →
  the stored build token → *your IAM access token*, and its help says an IAM
  login authorizes a build. The deployed route disagrees: it compares the bearer
  against `PLATFORM_BUILD_CALLBACK_TOKEN` and nothing else, so an IAM token gets
  the same 401 as no token. Set `HANZO_BUILD_TOKEN` to the enqueue token.
- **It builds and pushes; it does not deploy.** Rollout is driven by the repo's
  `deploy:` block, and this repo deliberately has none, so the job records
  `rolloutStatus: skipped`. Act 2 is still yours.

The image tag is whatever you put in `image:` — the route takes it verbatim. Pass
the full 40-char SHA and the pin needs no reconciling at all.

### 2. The forge — `.hanzo/workflows/deploy.yml`

Blocked, and not on billing or a secret.

`git.hanzo.ai/hanzo-docs/docs` is a **pull mirror with no Actions unit**:
`/actions` on it answers 404 while `git.hanzo.ai/hanzoai/cloud/actions` on the
same instance answers 200. Even with a unit, a mirror sync moves refs without
firing a push event, so the `on: push` trigger would not fire either. (The sync
itself is healthy — the mirror's `main` matches GitHub's exactly.)

The neighbouring `git.hanzo.ai/hanzoai/docs` *does* have an Actions unit, but it
is a different, stale mirror sitting on an old commit, so it is not a way in.

**Credential when it does run: `REGISTRY_TOKEN`** (forge secret, GHCR write on
the `hanzoai` org). The workflow already refuses to publish without it rather
than silently skipping the push. **Tag: the full 40-char SHA** — this is the lane
universe's pin shape was written for.

To unblock: give `hanzo-docs/docs` on the forge an Actions unit, and make the
mirror a real push target rather than a pull mirror. Then disarm one of the two
builders — see the note at the top of `deploy.yml`.

### 3. GitHub — `.github/workflows/cicd.yml` → hanzoai/ci

Landed, correct, and unable to schedule. The blocker is a runner, not Actions.

- Actions is **on** (`{"enabled":true,"allowed_actions":"all"}`) and the repo is
  public, so runs dispatch normally. There were simply no workflow files: the
  last thirteen moved to `.hanzo/workflows/` and the final one, the mirror-sync
  nudge, was deleted as superseded.
- Every runner we own is an `act_runner` registered to **git.hanzo.ai**, not to
  github.com. `arcd`, the pool that used to answer on the GitHub side, is
  retired. The single registration left on this org
  (`hanzo-docs-build-linux-amd64-5dzd2-runner-dcm4t`) is offline and advertises
  no labels.

So a dispatched run sits pending against a runner GitHub cannot see. The workflow
is `workflow_dispatch:` only, which keeps that from happening on every push and
keeps it from racing the forge lane; it names our own pool label, deliberately —
**do not point it at a GitHub-hosted runner.** That is the one thing this fleet
does not build on, and a workflow that names one starts working immediately,
which is exactly what makes the rule easy to break by accident.

**Credentials, all already present as repo secrets:** `KMS_CLIENT_ID` and
`KMS_CLIENT_SECRET` — hanzoai/ci uses them to pull the org's GHCR write token
(`buildx-ghcr-auth`) at run time. Without them it falls back to the job's own
`GITHUB_TOKEN`, which can only write a package linked to *this* repo and will 403
against `ghcr.io/hanzoai/docs`; an org `GH_PAT` is the other way to satisfy it and
is **not** set here. This lane has never run, so that fallback chain is reasoned
from the workflow source, not observed.

**Tags: `sha-<sha7>-amd64` and `latest`** — neither is the shape universe pins,
and `latest` currently points at an image unrelated to what is live, so a run here
moves a floating tag that other pulls see.

### 4. The platform webhook

`/v1/github-webhook` derives builds from this `hanzo.yml` on a push event via the
Hanzo GitHub App. It needs no work here and no credential from us. Its tag shape
is `{{git.sha}}-amd64-<tag-suffix>`, i.e.
`ghcr.io/hanzoai/docs:<40-char sha>-amd64-docs`.

Whether the App is installed for this repo could not be read with the token
available. What *can* be said is that no image exists in that tag shape for
current `main`, so it is not currently publishing this repo.

### Not a path: building on a workstation

`docker build .` produces the same image — that is the whole point of the recipe
living in the Dockerfile. It is still not how this ships: images are built by the
fabric for every org/arch, not on a laptop.

## Act 2 — the pin

`hanzoai/universe`, `charts/app/values/hanzo/docs.yaml`:

```yaml
image:
  repository: ghcr.io/hanzoai/docs
  tag: e8fb4369c925e75b1277d5a4a1c61e16a9bd93be
  digest: sha256:2b589f957d50f2c14ce2114d6c75281ed426b2b39e79c757791914e8e570b25a
```

**`digest:` is the line that changes what runs.** The chart renders
`repository:tag@digest` when both are set, and a reference carrying a digest is
resolved by the digest — the tag is a label a human reads. Move `tag:` alone and
docs.hanzo.ai keeps serving exactly what it was serving, with a values file that
says otherwise. That is a silent no-op, and it is the failure this section exists
to prevent.

So the edit is: **`digest:` to make it live, `tag:` in the same commit so the file
does not lie.** The digest of what you just pushed:

```
crane digest ghcr.io/hanzoai/docs:<tag>
```

Per builder, `tag:` becomes:

| builder | `tag:` |
|---|---|
| `POST /v1/runner` | the tag you named in `image:` (use the full 40-char SHA) |
| forge `deploy.yml` | the full 40-char SHA |
| platform webhook | `<40-char SHA>-amd64-docs` |
| hanzoai/ci | `sha-<first 7 of the SHA>-amd64` |

`digest:` is the same shape in all four rows, which is the point — the digest is
the identity, and the four tag schemes are four names for it.

Deleting the `digest:` line reduces the whole thing to a one-line `tag:` edit and
is a real option, but it trades an immutable pin for a mutable one: a tag can be
repointed, and then the file names an image that is no longer the image.

Committing that file to `main` on universe is the rollout. There is no second
step and nothing to trigger.

## The export gate

This site fails by exporting **nothing**. The build succeeds, the layer is valid,
the push succeeds, the host answers 404, and no builder notices, because from a
builder's point of view nothing went wrong.

So the gate is inside the Dockerfile, which is the one thing every builder passes
through:

    scripts/check-export.sh        what "a site" means, in one place
    apps/<app>/export.require      the sections this app must not lose

A build that fails it never produces an image, so no lane can push past it — which
matters most for the GitHub lane, where `docker buildx --push` builds and pushes
in a single invocation and there is no step in between to hold, and where
`hanzo.yml`'s `test:` block runs *after* the push and so cannot gate it either.

It checks: `index.html` and `docs/index.html` are non-empty; at least 50 HTML
pages exported; `/docs` actually rendered its nav (a shell-only render produces
both files and no links); and every page named in `export.require`.

That last one is for the failures that leave everything else green. `docs/studio/`
is a git submodule — a checkout that does not recurse drops the section and the
page count and nav checks both still pass. hanzoai/ci checks out **without**
`submodules: recursive`, so on that lane this is not hypothetical.

Anything added to `export.require` is enforced on every lane at once, which is
the only way a section stays required.

## Known gaps

- **Nothing gates a pull request.** The forge holds `lint.yml` and `test.yml` and
  cannot run them; the GitHub lane is dispatch-only, and could not be otherwise —
  hanzoai/ci has no test-without-build mode for a repo that declares `images:`, so
  a PR trigger would build and push an image, including moving `latest`, for every
  PR.
- **`hanzo build`'s IAM fallback does not work against the deployed route** (see
  path 1). The CLI help promises it; the route only accepts the enqueue token.
- **`latest` is not what the pin serves.** Nothing we run reads it, but anyone
  doing a bare `docker pull ghcr.io/hanzoai/docs` gets it, and the GitHub lane
  would move it.
- **The GitHub lane has never executed.** Its credential chain is read from the
  workflow source. The first real run is the first evidence.
