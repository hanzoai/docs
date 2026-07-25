# KMS Provisioning of Social-Login Secrets (Phase 2)

Owner action required. Stores the 12 secrets produced by Phase 1 into the
canonical KMS workspace and verifies they are readable by the IAM Job
that consumes them at boot.

## Project

The hanzo IAM deployment uses KMS **project** scope (not workspace).
The existing IAM project already syncs 23 secrets — we reuse that
project rather than introduce a new sync.

| Attribute | Value |
|---|---|
| Hostname | `api.hanzo.ai` (one API host; KMS is the `/v1/kms` prefix) |
| Project slug | `hanzo-iam` |
| Environment slug | `prod` (mainnet), `test` (testnet), `dev` (devnet) |
| Path | `/` (existing IAM secrets are flat under root) |
| Sync target | K8s Secret `iam-secrets` in ns `hanzo` (mainnet) / `hanzo-testnet` / `hanzo-devnet` |

## Key names

The existing iam-kms-sync KMSSecret already pulls these keys:

```
IAM_GITHUB_CLIENT_ID
IAM_GITHUB_CLIENT_SECRET
IAM_GOOGLE_CLIENT_ID
IAM_GOOGLE_CLIENT_SECRET
```

The `IAM_*` prefix isolates them from other env vars in the synced
Secret. The init-providers Job below strips the prefix when handing
values to `iam init-providers` (which reads `GITHUB_*`/`GOOGLE_*`).

> Previous draft of this runbook referenced workspace `credentials`
> at `/iam/social/<env>/*`. That was wrong — `credentials` is reserved
> for cross-org operational secrets (e.g. `/deploy/DO_API_TOKEN`).
> Per-service IAM secrets live in project `hanzo-iam`.

## Auth

Use the IAM service-pod's KMS Universal Auth credentials (already
present in cluster as the `iam-kms-auth` Secret keyed
`CLIENTID`/`CLIENTSECRET`). To run this runbook from a workstation,
export those values into your shell:

```bash
export KMS_CLIENT_ID=$(kubectl --context=do-sfo3-hanzo-k8s -n hanzo \
  get secret iam-kms-auth -o jsonpath='{.data.clientId}' | base64 -d)
export KMS_CLIENT_SECRET=$(kubectl --context=do-sfo3-hanzo-k8s -n hanzo \
  get secret iam-kms-auth -o jsonpath='{.data.clientSecret}' | base64 -d)
```

Exchange the machine identity for a short-lived bearer (JSON body, not form-encoded):

```bash
TOKEN=$(curl -sS -X POST https://api.hanzo.ai/v1/kms/auth/login \
  -H 'Content-Type: application/json' \
  -d "{\"clientId\":\"$KMS_CLIENT_ID\",\"clientSecret\":\"$KMS_CLIENT_SECRET\"}" \
  | jq -r .accessToken)
test -n "$TOKEN" -a "$TOKEN" != null || { echo "auth failed"; exit 1; }
```

Response: `{"accessToken":"<RS256 JWT>","expiresIn":604800,"tokenType":"Bearer"}`.

## Write the 12 secrets

Repeat once per env (mainnet→prod, testnet→test, devnet→dev). Substitute
the recorded Phase-1 values:

```bash
# Map mainnet/testnet/devnet → KMS env slug
case "$ENV" in
  mainnet) KMS_ENV=prod ;;
  testnet) KMS_ENV=test ;;
  devnet)  KMS_ENV=dev  ;;
  *) echo "bad env"; exit 1 ;;
esac

declare -A SECRETS=(
  [IAM_GITHUB_CLIENT_ID]="<phase-1-${ENV}-github-client-id>"
  [IAM_GITHUB_CLIENT_SECRET]="<phase-1-${ENV}-github-client-secret>"
  [IAM_GOOGLE_CLIENT_ID]="<phase-1-${ENV}-google-client-id>"
  [IAM_GOOGLE_CLIENT_SECRET]="<phase-1-${ENV}-google-client-secret>"
)
for key in "${!SECRETS[@]}"; do
  curl -sS -X POST "https://api.hanzo.ai/v1/kms/orgs/hanzo/secrets" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$(jq -n \
        --arg path "/hanzo-iam" \
        --arg name "$key" \
        --arg env "$KMS_ENV" \
        --arg val "${SECRETS[$key]}" \
        '{path:$path, name:$name, env:$env, value:$val}')"
  echo
done
```

Verify by listing the namespace (metadata only — values are never listed):

```bash
curl -sS "https://api.hanzo.ai/v1/kms/orgs/hanzo/secrets?env=$KMS_ENV" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.secrets[].name' \
  | grep -E 'IAM_(GITHUB|GOOGLE)_CLIENT_(ID|SECRET)'
```

Expect four entries per env: `IAM_GITHUB_CLIENT_ID`,
`IAM_GITHUB_CLIENT_SECRET`, `IAM_GOOGLE_CLIENT_ID`,
`IAM_GOOGLE_CLIENT_SECRET`.

## KMSSecret CR — wire into the iam Deployment

The Job that runs `iam init-providers` reads the values from the
existing K8s Secret `iam-secrets` (already synced from KMS project
`hanzo-iam`/`/` via `iam-kms-sync` KMSSecret CR — see
`infra/k8s/iam/secret.yaml`). The deploy flow is:

```
KMS project `hanzo-iam` env=prod/test/dev at /*
        │
        ▼  (KMSSecret iam-kms-sync, ~60s reconcile interval)
K8s Secret `iam-secrets` in hanzo / hanzo-testnet / hanzo-devnet ns
        │       keys: IAM_GITHUB_CLIENT_ID, IAM_GITHUB_CLIENT_SECRET,
        │             IAM_GOOGLE_CLIENT_ID, IAM_GOOGLE_CLIENT_SECRET, …
        ▼  (envFrom on the iam-init-providers Job, with strip prefix)
Job env: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET,
         GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
        │
        ▼
iam init-providers
        │
        ▼
provider rows in admin org now have valid clientId+clientSecret
```

The strip-prefix step is done inline in the Job's env definition (see
`infra/k8s/iam/init-providers-job.yaml`):

```yaml
env:
  - name: GITHUB_CLIENT_ID
    valueFrom: {secretKeyRef: {name: iam-secrets, key: IAM_GITHUB_CLIENT_ID}}
  - name: GITHUB_CLIENT_SECRET
    valueFrom: {secretKeyRef: {name: iam-secrets, key: IAM_GITHUB_CLIENT_SECRET}}
  # …same for GOOGLE_*
```

## Rotation

```bash
# 1. PATCH the new value into KMS (If-Match carries the current version;
#    a missing precondition is 428, a stale one is 409)
curl -sS -X PATCH "https://api.hanzo.ai/v1/kms/orgs/hanzo/secrets/hanzo-iam/IAM_GITHUB_CLIENT_SECRET?env=prod" \
  -H "Authorization: Bearer $TOKEN" \
  -H "If-Match: $CURRENT_VERSION" \
  -H "Content-Type: application/json" \
  -d '{"value":"<new-secret>"}'

# 2. KMSSecret reconciles within 60s; force-roll the Job to pick up:
kubectl --context=do-sfo3-hanzo-k8s -n hanzo delete job iam-init-providers --ignore-not-found
kubectl --context=do-sfo3-hanzo-k8s -n hanzo apply -k infra/k8s/iam/

# 3. Watch the Job logs:
kubectl --context=do-sfo3-hanzo-k8s -n hanzo logs -l job-name=iam-init-providers -f
```

A successful rotation shows `[upd ] provider-github (clientId=…)` in
the logs.
