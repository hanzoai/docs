# Publishing docs.hanzo.ai

Every path that can publish this site, what each one tags, and the one credential
each is waiting on. Every fact below was read off the live systems; where
something could not be checked, it says so rather than guessing.

## Publishing is two acts

    1. build + push   ghcr.io/hanzoai/docs:<tag>
    2. move the pin   hanzoai/universe  charts/app/values/hanzo/docs.yaml

Act 2 is the deploy. That file carries `cd.automated: true`, which makes the
GitOps plane the sole writer of the workload and self-heal anything else that
touches it — so the commit that edits it IS the rollout, and conversely a
`kubectl patch` or a `deploy:` block in `hanzo.yml` gets reverted on the next
sync. Nothing goes live because it was built; something goes live because that
file names it.

## Where things stand

`ghcr.io/hanzoai/docs` is anonymously pullable, so none of this has to be taken
on trust. Ask it directly, for whatever `main` is when you are reading:

```sh
SHA=$(git rev-parse origin/main); SHORT=$(echo "$SHA" | cut -c1-7)
for t in "$SHA-amd64-docs" "$SHA" "sha-$SHORT-amd64" "sha-$SHORT-amd64-docs" latest; do
  printf '%-52s %s\n' "$t" "$(crane digest "ghcr.io/hanzoai/docs:$t" 2>/dev/null || echo '— absent')"
done
```

Those are every tag shape in the contract below, in the order of the table under
Act 2 — so whichever one comes back with a digest names the lane that built it.

**The first row is the live one.** `<sha40>-amd64-docs` is the platform lane's
shape, it is what exists in GHCR for the commit universe currently pins, and it
is what that pin reads. The bare 40-char tag the pin *used* to carry does not
exist in GHCR for that commit — which is exactly the trap this file is for: the
tag shape you assume decides whether the pin names a real image.

Three facts worth stating outright, because they are the ones people get wrong:

- The pin's `digest:` in universe is byte-for-byte GHCR's `docker-content-digest`
  for the tag beside it. The pin mechanism is sound; when a rollout does nothing,
  the cause is a `tag:` moved without its `digest:`, not a broken chart.
- **`latest` is a different image from the pin.** Nothing we run reads it, but a
  bare `docker pull ghcr.io/hanzoai/docs` gets it.
- **A `<sha40>-amd64-docs` tag does not prove the webhook fired.** `POST
  /v1/runner` takes its tag verbatim, so a hand-fired build can be named in the
  platform's own shape and is indistinguishable from a webhook build afterwards.
  Whether the Hanzo GitHub App is installed on this repo could not be read with
  the token available (`repos/…/installation` needs an App JWT), so this file does
  not claim it either way.

`docs.hanzo.ai` answers 200, as do `/docs/` and `/docs/studio/` — the last one
matters because that section comes from a submodule (see the export gate).

## The one trigger, today

**Act 1 is already done.** The newest image in GHCR is `b20bb98cc`:
`linux/amd64`, entrypoint `/static -port 3000 -root /public`, two layers, 2.55 GB
— the image serving now measures 2.55 GB too, so nothing collapsed on the way in:

    ghcr.io/hanzoai/docs:b20bb98cc6e971d042c6280cf81a5f2fb4229c4f-amd64-docs
    sha256:a0e2a31447b4ead2e3c765f31d0f116118c2c306dd833a21a652549a8c7e0b93

`main` may sit ahead of that commit without the site differing by a byte. The
export reads `apps/docs/content/**` and the packages it imports; this file is not
a build input, so a commit that only edits `RELEASE.md` produces an identical
export. Check what actually changed before assuming a rebuild is owed:

```sh
git diff --stat b20bb98cc6e971d042c6280cf81a5f2fb4229c4f origin/main
```

**That it exists is the export gate's verdict.** The gate runs inside the
Dockerfile, before the serving stage is assembled, so an image cannot come into
being unless the export it carries has `index.html`, `docs/index.html`, at least
50 HTML pages, a rendered nav, and every page named in `apps/docs/export.require`
— including `docs/studio/` and `docs/mcp-tools/all-tools/`. No builder had to
know this repo is special, and none of them can skip it.

So publishing the tip needs **no build and no build credential**. It is Act 2
alone: one commit to `hanzoai/universe`, `charts/app/values/hanzo/docs.yaml`,
changing two lines that must move together —

```yaml
  tag: b20bb98cc6e971d042c6280cf81a5f2fb4229c4f-amd64-docs
  digest: sha256:a0e2a31447b4ead2e3c765f31d0f116118c2c306dd833a21a652549a8c7e0b93
```

`cd.automated: true` on that file makes the GitOps plane the sole writer, so the
commit IS the rollout. There is nothing to trigger afterwards.

Re-derive both lines before you paste them — a tag is mutable and these were read
at a moment in time. This walks back from `main` and stops at the newest commit
that has an image, printing the two lines in the shape the values file wants:

```sh
for c in $(git rev-list -20 origin/main); do
  d=$(crane digest "ghcr.io/hanzoai/docs:$c-amd64-docs" 2>/dev/null) || continue
  printf '  tag: %s-amd64-docs\n  digest: %s\n' "$c" "$d"; break
done
```

It prints nothing only if the last twenty commits have no image at all — then you
need a build, and Act 1 below is how. Otherwise diff the commit it names against
`main`, per above: if the difference is outside the export, the pin is enough.

## Act 1 — the six ways to build

Six producers, five different tag shapes, and three of those come from three
programs reading *this same* `hanzo.yml` and disagreeing about what it means.
That is the whole reason the tag contract exists.

You need this section only when the commit you want to ship has no image — check
that first, with the probe above; for the current tip it does, and the section
before this one is the whole procedure. When you do need to build, **lane 1 is the
one to fire**: it is the only one whose blocker is a single credential rather than
missing infrastructure. Lane 5's shape is what the pin reads. Lanes 2, 3, 4 and 6
are written down so the next person does not rediscover why they are cold.

### 1. The runner fabric — `POST /v1/runner`

The path that built what is serving now, and the one that is a single credential
away from working. The Dockerfile names it as the real builder.

```
POST https://platform.hanzo.ai/v1/runner
Authorization: Bearer $PLATFORM_BUILD_CALLBACK_TOKEN
Content-Type: application/json

{"repo":"hanzo-docs/docs",
 "sha":"<40-char sha>",
 "image":"ghcr.io/hanzoai/docs:<40-char sha>"}
```

or the same request with the recipe read for you:

```
hanzo build hanzo-docs/docs --sha <40-char sha> \
  --image ghcr.io/hanzoai/docs:<40-char sha>
```

**Credential: `PLATFORM_BUILD_CALLBACK_TOKEN`**, in KMS. Unauthenticated the
route answers `401 {"message":"Invalid enqueue token"}` — a 401, not a 403, and
not the `500 PLATFORM_BUILD_CALLBACK_TOKEN is not configured` it returns when the
server lacks the token. The endpoint is armed and correct on the far side; the
only missing piece is the bearer.

**The tag is whatever you put in `image:`** — the route takes it verbatim. Pass
the full 40-char SHA and the pin needs no reconciling at all. This is the lane
whose shape `charts/app/values/hanzo/docs.yaml` already speaks.

Two things to know before using it:

- **It builds and pushes; it does not deploy.** Rollout is driven by a repo's
  `deploy:` block, and this repo deliberately has none, so the job records
  `rolloutStatus: skipped`. Act 2 is still yours.
- **`hanzo build`'s IAM login does not authorize a build against the deployed
  route — yet.** The CLI resolves its bearer as `--build-token` →
  `HANZO_BUILD_TOKEN` → `PLATFORM_BUILD_CALLBACK_TOKEN` → the stored build token
  → your IAM access token, and its help says an IAM login is enough. That is true
  of `apps/platform/runner.go` on `main`, which accepts *either* the shared token
  *or* a validated IAM admin. It is not true of what is deployed: the live route
  still answers with the older handler's `401 Invalid enqueue token`, where
  `main`'s returns `403 invalid build token` and has the IAM branch. So the CLI
  help describes the design and the cluster is behind it. Until platform
  redeploys, set `HANZO_BUILD_TOKEN` to the enqueue token.

### 2. The forge — `.hanzo/workflows/deploy.yml`

**This is the lane. It runs.** It was blocked, the blocker was one repo setting,
and the entry that used to sit here got the diagnosis wrong in a way worth
recording, because the wrong diagnosis is what made this look unfixable.

What was true: `git.hanzo.ai/hanzo-docs/docs` had **no Actions unit**, so
`/actions` answered 404 and nothing scheduled. On this forge a repo created as a
mirror gets `DefaultMirrorRepoUnits` (`models/unit/unit.go`), which is Code,
Issues, Releases, Wiki, Projects, Packages — and deliberately **not** Actions.
That one missing row in `repo_unit` was the whole outage.

What was false, and cost the most: *"a mirror sync moves refs without firing a
push event."* It does fire. `services/mirror/mirror_pull.go` calls
`notify_service.SyncPushCommits` on every updated ref,
`services/actions/notifier.go` implements that as a real `HookEventPush`, and
`notifier_helper.go` gates it on exactly one thing — the Actions unit. There is
no `IsMirror` check anywhere in that path. The cheapest proof needs none of that
source: `hanzoai/docs` is *also* a pull mirror, it *has* the unit, and its runs
are stamped `event: push`.

Also false: that `hanzoai/docs` is "a different, stale mirror on an old commit."
It tracks the same content and sits on the same commit. It is not stale — it is
a **second lane on the same source**, which is a thing to retire, not a thing to
ignore.

The fix was three calls against the forge API (which is served at bare `/v1`,
not `/api/v1`):

```sh
# 1. stop being a pull mirror, so the forge can receive pushes
curl -X DELETE -H "Authorization: token $T" \
  https://git.hanzo.ai/v1/repos/hanzo-docs/docs/pull-mirror        # 204

# 2. add the Actions unit
curl -X PATCH -H "Authorization: token $T" -H 'Content-Type: application/json' \
  -d '{"has_actions":true}' https://git.hanzo.ai/v1/repos/hanzo-docs/docs

# 3. run it
curl -X POST -H "Authorization: token $T" -H 'Content-Type: application/json' \
  -d '{"ref":"refs/heads/main"}' \
  https://git.hanzo.ai/v1/repos/hanzo-docs/docs/actions/workflows/deploy.yml/dispatches
```

Step 1 is what makes `git.hanzo.ai` the place this repo is pushed to. Step 2 is
orthogonal to it: converting a mirror does **not** add the unit, and adding the
unit does **not** require converting — a mirror with the unit builds on sync.

**Credentials, org secrets on `hanzo-docs`:** `REGISTRY_TOKEN` (GHCR write on the
`hanzoai` org) and `KMS_CLIENT_ID` / `KMS_CLIENT_SECRET`, which the build
exchanges for the ingest key at run time. The ingest key itself is **not** a
forge secret and must not become one — it lives in KMS at `deploy/PUBLISHABLE_KEY`
and the build reads it there. **Tag: the full 40-char SHA** — this lane and lane 1
are the two that speak the shape universe already pins.

Note the runner label: `runs-on: hanzo-docs-build-linux-amd64` is real and always
was. The `git-runner` fleet advertises it (`infra/k8s/git-runner/config.yaml` in
hanzoai/universe). No runner work was ever needed here.

Still open: this repo now has one armed push-triggered builder (`deploy.yml`) and
`release.yml`, which carries no `paths:` filter and so fires on every push to
`main`. The nine `deploy-*-docs.yml` are push-triggered too but filter on paths
their own app owns, so they stay quiet unless that app changes.

### 3. GitHub — `.github/workflows/cicd.yml` → hanzoai/ci

Landed, registered, and unable to schedule. The blocker is a runner, not Actions.

- Actions is **on** (`{"enabled":true,"allowed_actions":"all"}`), the repo is
  public, and GitHub lists this workflow as `state: active`. A dispatch is
  accepted.
- **There are zero self-hosted runners registered**, at the repo level and at the
  org level both (`actions/runners` returns `total_count: 0` for each). Every
  runner we own is an `act_runner` registered to git.hanzo.ai, not to github.com;
  arcd, the pool that used to answer on the GitHub side, is retired.

So a dispatched run sits pending against a runner GitHub cannot see. The workflow
is `workflow_dispatch:` only, which keeps it from racing the forge lane, and it
names our own pool label deliberately — **do not point it at a GitHub-hosted
runner.** That is the one thing this fleet does not build on, and a workflow that
names one starts working immediately, which is exactly what makes the rule easy
to break by accident.

It passes `submodules: recursive`, and that is load-bearing rather than tidy:
hanzoai/ci checks out with `actions/checkout`'s default, which fetches no
submodules, and `apps/docs/content/docs/studio` is one. Without it that section
is simply absent from the export — silently, since every other page still builds.
Here the export gate names those pages, so the build would fail on this lane
every time while the forge lane built the same commit clean. The `submodules`
input exists on hanzoai/ci for this; its default is checkout's own, so no other
caller changed behaviour.

**Credentials, already present as repo secrets:** `KMS_CLIENT_ID` and
`KMS_CLIENT_SECRET` — hanzoai/ci uses them to pull the org's GHCR write token
(`buildx-ghcr-auth`) at run time. Without them it falls back to the job's own
`GITHUB_TOKEN`, which can only write a package linked to *this* repo and will 403
against `ghcr.io/hanzoai/docs`; an org `GH_PAT` is the other way to satisfy it and
is **not** set here. This lane has never run, so that fallback chain is read from
the workflow source, not observed.

**Tags: `sha-<sha7>-amd64` and `latest`.** Neither is the shape universe pins, and
`latest` currently points at an image unrelated to what is live, so a run here
moves a floating tag that other pulls see.

### 4. hanzoai/ci in `mode: delegate`

Same workflow as lane 3, but instead of running buildx on the runner it POSTs
each image to `platform.hanzo.ai/v1/arcd/enqueue`; platform builds in-cluster with
BuildKit. The GitHub job then finishes in seconds. Opt in with
`with: { mode: delegate }`.

**Credential: `PLATFORM_BUILD_CALLBACK_TOKEN`** (same secret as lane 1, reached
through `secrets: inherit`); the workflow fails the step outright if it is unset.
It still needs a runner to place the POST from, so today it is blocked by the same
missing runner as lane 3 — it removes the buildx minutes, not the prerequisite.

**Tag: `sha-<sha7>-amd64`** — the same shape lane 3 produces, minus `latest`.

### 5. The platform lane — `/v1/github-webhook` → BuildKit

The lane that produced the image running today, and the shape the pin now reads.

`platform.hanzo.ai` reads this `hanzo.yml` (`pkg/platform/src/services/ci/
platform-config.ts`), turns each `images:` entry into a build, and runs it
in-cluster with BuildKit. It needs no work in this repo and no credential from
us — the delivery authenticates as a GitHub App installation.

**Tag: `<sha40>-amd64-docs`**, from `tagPattern: {{git.sha}}-amd64-<suffix>` with
`suffix` defaulting to the image `name`. Note the FULL sha — this is the one
producer that does not abbreviate, and the reason the pin looks the way it does.

Whether the App is installed here could not be read (see above). What CAN be read
is the registry, and it says this lane's shape is being produced but not on every
push. Walking the seven commits from the pinned one to the tip and asking GHCR for
`<sha40>-amd64-docs` on each:

    c2d2755b8  docs: a ported doc's import header is dead weight   sha256:feb3a652…
    57635523c  docs: the sidebar's CLI is the hanzo binary          sha256:c5e4e051…
    95eca7168  docs(enso): the tier table is about cost             — absent
    c83a5d1b1  ci: the GitHub lane checks out the submodules        — absent
    cb23a7ac5  docs(release): the tag contract is three readers     — absent
    eff700657  docs(mcp): a tool page states what the API requires  — absent
    b20bb98cc  docs(mcp): the register-a-server body                sha256:a0e2a314…

Three of seven. A per-push builder leaves no holes, so whatever is producing these
is being fired by hand — and lane 1 can produce exactly this shape, so the two are
indistinguishable after the fact. Treat the shape as evidence of a lane, never of
an installation.

### 6. The forge push orchestrator — dormant

`apps/git/build_on_push.go` in hanzoai/cloud reacts to a default-branch push
landing on git.hanzo.ai, reads this same `hanzo.yml`, and enqueues one
`/v1/runner` build per declared image.

It **ships dormant**: it no-ops unless `CLOUD_NATIVE_CICD_ENABLED` is truthy on
the git App CR *and* the enqueue token is present. It also reacts to the forge,
which is the mirror that fires no push event for this repo — two independent
reasons it is not publishing this site.

**Tag: `sha-<sha7>-amd64-docs`** — a third reading of the same file, and the one
whose own comment claims a convergence that does not hold. See below.

### Not a path: building on a workstation

`docker build .` produces the same image — that is the point of the recipe living
in the Dockerfile. It is still not how this ships: images are built by the fabric
for every org/arch combination, not on a laptop.

## Act 2 — the pin, per builder

`hanzoai/universe`, `charts/app/values/hanzo/docs.yaml`:

```yaml
image:
  repository: ghcr.io/hanzoai/docs
  tag: c2d2755b869d51dfa75c7322c5e77d2be57ad3da-amd64-docs
  digest: sha256:feb3a65270d1e8bfa5eb0bcb161a4484e77e3fbfe424044086f9c8b1626cdbce
```

Those two lines are the file as it stands, and GHCR agrees with them: that tag
answers with that exact digest. Note the shape — `<sha40>-amd64-docs`, lane 5's.
The pin used to read a bare `<sha40>` and was moved off it, because the bare tag
**does not exist in GHCR** for the commit it named. That is the failure this
section exists to prevent, and it is not hypothetical: it is the last edit
`docs.yaml` received.

**`digest:` is the line that changes what runs.** The chart renders
`repository:tag@digest`, and a reference carrying a digest is resolved by the
digest — the tag is a label a human reads. Move `tag:` alone and docs.hanzo.ai
keeps serving exactly what it served before, from a values file that says
otherwise. That is a silent no-op, and it has already happened once here (see the
comment in that file).

So the edit is **`digest:` to make it live, `tag:` in the same commit so the file
does not lie.** Get the digest of what you just pushed:

```
crane digest ghcr.io/hanzoai/docs:<tag>
```

The one-line `tag:` edit, per builder, for a commit whose full SHA is `<sha40>`
and whose first seven characters are `<sha7>`:

| builder | `tag:` becomes | state |
|---|---|---|
| 5. platform lane (webhook) | `<sha40>-amd64-docs` | **what the pin reads today** |
| 1. `POST /v1/runner` | whatever you put in `image:` | works; needs the bearer |
| 2. forge `deploy.yml` | `<sha40>` | **runs — the lane** |
| 3. hanzoai/ci (buildx) | `sha-<sha7>-amd64` | no runner |
| 4. hanzoai/ci (delegate) | `sha-<sha7>-amd64` | no runner |
| 6. forge push orchestrator | `sha-<sha7>-amd64-docs` | dormant |

`digest:` is the same shape in all six rows, which is the point — the digest is
the identity and these are six names for it.

If you fire lane 1, **name the tag in the shape of the lane you want to be
standard.** Naming it `<sha40>-amd64-docs` keeps one shape in the registry and
one shape in the pin; naming it a bare `<sha40>` is also fine, but then the pin
and the previous pin disagree in shape for no reason a reader can see.

Publishing lane 1 from current `main`, end to end — this prints the two lines to
paste, and prints nothing if the image is not actually there:

```sh
SHA=$(git rev-parse origin/main)
hanzo build hanzo-docs/docs --sha "$SHA" --image "ghcr.io/hanzoai/docs:$SHA"
printf '  tag: %s\n  digest: %s\n' "$SHA" "$(crane digest "ghcr.io/hanzoai/docs:$SHA")"
```

Deleting the `digest:` line reduces this to a one-line `tag:` edit and is a real
option, but it trades an immutable pin for a mutable one: a tag can be repointed,
and then the file names an image that is no longer the image.

Committing that file to `main` on universe is the rollout. There is no second step
and nothing else to trigger.

### Why the shapes disagree — three readers of one file

This is the part that actually bites, so it is worth being exact. `hanzo.yml`
declares `name: docs` and **no** `tag-suffix`. Three separate programs read that
and reach three different tags:

| reader | suffix when `tag-suffix` is absent | sha | result |
|---|---|---|---|
| hanzo/platform `platform-config.ts` | falls back to `name` → `docs` | **full** | `<sha40>-amd64-docs` |
| hanzoai/cloud `apps/git/build_on_push.go` | falls back to `name` → `docs` | short | `sha-<sha7>-amd64-docs` |
| hanzoai/ci `build.yml` | `."tag-suffix" // ""` → **none** | short | `sha-<sha7>-amd64` |

Two independent disagreements, not one: whether an absent `tag-suffix` falls back
to the image `name`, and whether the sha is abbreviated. Only a repo that sets
`tag-suffix` explicitly *and* ignores the sha length gets agreement, and even then
only between the last two.

`build_on_push.go`'s header states that its lane and the ci lane "enqueue
identical image tags so they converge, never diverge". That holds only for a repo
that sets `tag-suffix`. For every repo that omits it — most of them, this one
included — they differ by exactly the suffix. Its own test documents the fallback
(`tag-suffix defaults to name`, asserting `…:sha-abcdef1-amd64-api` for an image
declaring no suffix), so the behaviour is intended and only the comment is wrong.

**Setting `tag-suffix: docs` here would close one of the two gaps** — it would
make ci emit `sha-<sha7>-amd64-docs`, matching row 2, and as a side effect stop ci
from moving the shared `latest` tag (it would push `docs-latest`). It would not
close the sha-length gap, and it changes the tag shape of lanes that have never
run. Deliberately not done: it is a fleet-shaped decision, not a silent edit in a
docs repo.

Until then the rule is the one at the top of this file — **read the tag off the
build you actually fired**, and move `digest:` with it.

## The export gate

This site fails by exporting **nothing**. The build succeeds, the layer is valid,
the push succeeds, the host answers 404, and no builder notices, because from a
builder's point of view nothing went wrong.

So the gate lives inside the Dockerfile — the one thing every builder passes
through:

    scripts/check-export.sh        what "a site" means, in one place
    apps/<app>/export.require      the sections this app must not lose

A build that fails it never produces an image, so no lane can push past it. That
matters most on lane 3, where `docker buildx build --push` builds and pushes in a
single invocation with no step in between to hold, and where `hanzo.yml`'s `test:`
block runs *after* the push and so cannot gate it either.

It checks: `index.html` and `docs/index.html` exist and are non-empty; at least 50
HTML pages were exported; `/docs` actually rendered its nav (a shell-only render
produces both files and no links); and every page named in `export.require`.

That last rule is for the failures that leave everything else green — a submodule
that was not checked out drops its whole section while the page count and the nav
check both still pass. Anything added to `export.require` is enforced on every
lane at once, which is the only way a section stays required.

## Known gaps

- **Nothing gates a pull request yet, but the forge can now run one.** `lint.yml`
  and `test.yml` are `on: pull_request` and the forge sees them; what is missing
  is pull requests being opened here rather than on the other host. The GitHub
  lane is dispatch-only, and could not be otherwise —
  hanzoai/ci has no test-without-build mode for a repo that declares `images:`, so
  a PR trigger would build and push an image, including moving `latest`, on every
  PR.
- **`latest` is not what the pin serves** (`sha256:eb7cccd3…` vs the pin's
  `sha256:feb3a652…`). Nothing we run reads it, but a bare
  `docker pull ghcr.io/hanzoai/docs` gets it, and lane 3 would move it.
- **The builds that exist are sporadic, and now we know why.** It was read here
  as "nothing is building this repo on every push." Something was: `hanzoai/docs`
  fires `deploy.yml` on every mirror sync whose paths match. It was *failing* —
  89 of its 95 runs are failures, and every recent `image` run dies inside
  `docker build`. Sporadic images were the occasional survivor, not an occasional
  trigger. Those are opposite diagnoses and only one of them is fixable by
  arming a lane.

  The failure is **disk**, and it is worth being exact, because the symptom
  invites a wrong answer. The job's log truncates mid-export with no error line,
  dockerd appears to restart, and the run reports `in_progress` for another ten
  minutes. That reads like an out-of-memory kill. It is not one — the kubelet
  says so:

      git-runner-5   Evicted: Usage of EmptyDir volume "docker-storage"
                              exceeds the limit "38Gi"
      git-runner-7   Evicted: node was low on resource: ephemeral-storage
      MemoryPressure=False, node memory usage 7%

  The runner's docker storage is a 38Gi `emptyDir`, and this build wants nearly
  all of it: node_modules for a 21-app / 36-package workspace, `.next` ~6.9G,
  `out` ~6.4G, the turbo cache ~2.4G, the 2.55G image, and whatever earlier jobs
  left on that runner (measured: 1.6–7.5G). Over the line, the pod is evicted and
  restarted — which is what restarts dockerd, and why nothing logs an error.

  Read the signature correctly: **a job whose log stops, whose pod restarts, and
  which never ends is an eviction.** A real build failure names its error and
  marks the later steps `skipped`. An OOM would show `MemoryPressure`. Check
  `kubectl -n hanzo get events | grep -i evict` before touching the Dockerfile.

  Three changes keep the build inside its volume:

  1. A `.dockerignore`. There was none, so `COPY . .` shipped the whole tree —
     16G if it had ever been built locally, and 776M of `.git` even on a clean
     CI checkout. Now 323M.
  2. **One layer** for install + build + cleanup. A RUN is a layer and a layer
     stores what existed when it ended, so installing in one RUN and deleting in
     a later one frees nothing — `node_modules` for a 21-app / 36-package
     workspace stays on disk for the rest of the build. Chained with `&&`, it
     never outlives its own layer. Splitting that chain reintroduces the
     eviction without changing a line of application code.
  3. A reclaim step in `deploy.yml` that prunes the runner and reports
     `docker system df` before and after — measured at ~3.3G recovered on a
     warm runner — so the next failure of this kind is legible in its own log.

- **The runner pool is over-subscribed on disk, and that is not fixed here.**
  Two runners share a node, each with a 38Gi `docker-storage` emptyDir plus
  images and checkouts, on a ~98G disk. The node hit `DiskPressure` and evicted
  a third runner during this work. Trimming this build buys margin; it does not
  change the arithmetic. Sizing that pool is a fleet decision in hanzoai/universe
  (`charts/app/values/hanzo/git-runner.yaml`), not a docs-repo one.

- **`hanzoai/docs` is a second lane on the same source.** It still mirrors from
  the other host every 10 minutes and still has its Actions unit, so it will keep
  firing `deploy.yml` and the nine wrangler deploys. Two lanes for one image is
  the thing the top of `deploy.yml` warns about. Retiring it is a CTO call
  because two of its wrangler jobs (`cloud-site`, `gui-docs`) are the only deploy
  those hosts have.
- **The GitHub lane has never executed.** Its credential chain and its tag shape
  are read from the workflow source. The first real run is the first evidence.
- **`hanzo build`'s IAM path is in `main` but not in the cluster** (see lane 1).
- **The tag divergence above** is three readers of one file reaching three
  answers, one of them documented by a comment that contradicts its own code.
  Nothing is broken by it today; it is a wrong-pin waiting for the day a second
  lane is armed.
- **Whether the GitHub App is installed here is unknown** — it needs an App JWT to
  read. An image in the platform shape exists for the pinned commit, but lane 1
  can produce that shape by hand, so its presence proves nothing about the App.
