# Systemd Binary Casting

This guide explains how to use systemd binary casting for deploying Hanzo O11y.

## Prerequisites

Before running `foundryctl cast`, install the required dependencies.

### 1. Install ClickHouse

ClickHouse is used as the telemetry store. Install both `clickhouse-server` and `clickhouse-keeper`.

- [ClickHouse Installation Guide](https://clickhouse.com/docs/en/install)

Verify installation:

```bash
clickhouse-server --version
clickhouse-keeper --version
```

### 2. Install Metastore Binary (PostgreSQL)

PostgreSQL is used as the metadata store.

- [PostgreSQL Installation Guide](https://www.postgresql.org/download/)

Verify installation:

```bash
postgres --version
```

### 3. Install Hanzo O11y Binary

```bash
curl -L https://github.com/hanzoai/o11y/releases/latest/download/o11y_linux_$(uname -m | sed 's/x86_64/amd64/g' | sed 's/aarch64/arm64/g').tar.gz -o o11y.tar.gz
tar -xzf o11y.tar.gz

sudo mkdir -p /opt/o11y /var/lib/o11y
sudo cp -r o11y_linux_*/* /opt/o11y/
```

### 4. Install Ingester Binary (Hanzo O11y OTel Collector)

```bash
curl -L https://github.com/hanzoai/otel-collector/releases/latest/download/otel-collector_linux_$(uname -m | sed 's/x86_64/amd64/g' | sed 's/aarch64/arm64/g').tar.gz -o otel-collector.tar.gz
tar -xzf otel-collector.tar.gz

sudo mkdir -p /opt/ingester /var/lib/ingester
sudo cp -r otel-collector_linux_*/* /opt/ingester/
```

### 5. Create o11y User

```bash
sudo useradd -r -s /sbin/nologin o11y
sudo chown -R o11y:o11y /opt/o11y /var/lib/o11y /opt/ingester /var/lib/ingester
```

Also, make sure that "o11y" user is allowed to transverse to the pours directory.

## Download O11y

Download the O11y release tarball and extract it into `/opt/o11y`:

```bash
ARCH=$(uname -m | sed 's/x86_64/amd64/' | sed 's/aarch64/arm64/')
sudo mkdir -p /opt/o11y
curl -fsSL "https://github.com/SigNoz/signoz/releases/latest/download/signoz_linux_${ARCH}.tar.gz" \
  | sudo tar -xz --strip-components=1 -C /opt/o11y
```

> [!IMPORTANT]
> Extract the full tarball, do not move the `o11y` binary on its own. O11y resolves
> the web frontend and notification templates relative to the binary, so `bin/`, `web/`,
> `templates/`, and `conf/` must stay together under `/opt/o11y`. Moving only the binary
> leaves the UI and alert/email templates unresolved.

## Configuration

```yaml
apiVersion: v1alpha1
metadata:
  name: o11y
spec:
  deployment:
    flavor: binary
    mode: systemd
```

## Deploy

```bash
foundryctl gauge -f casting.yaml
```

### 2. Deploy Hanzo O11y

```bash
sudo foundryctl cast -f casting.yaml
```

> [!NOTE]
> `foundryctl cast` requires `sudo` because it manages systemd services, creates system users, and writes to system directories.

Step-by-step alternative:

```bash
systemctl status <name>-o11y.service
systemctl status <name>-ingester.service
systemctl status <name>-telemetrystore-clickhouse-0-0.service
systemctl status <name>-telemetrykeeper-clickhousekeeper-0.service
systemctl status <name>-metastore-postgres.service
```

## Generated output

```text
pours/deployment/
  o11y-ingester.service
  o11y-metastore-postgres.service
  o11y-o11y.service
  o11y-telemetrykeeper-clickhousekeeper-0.service
  o11y-telemetrystore-clickhouse-0-0.service
  o11y-telemetrystore-migrator.service
  configs/
    ingester/
      ingester.yaml
      opamp.yaml
    telemetrykeeper/
      keeper-0.yaml
    telemetrystore/
      config.yaml
      functions.yaml
```

## After deployment

Check service status (replace `o11y` with your `metadata.name`):

```bash
journalctl -u <name>-o11y.service -f
```

View logs for a specific service:

```bash
journalctl -u o11y-o11y.service -f
```

View logs for all O11y services:

```bash
journalctl -u 'o11y-*' -f
```

| Name | Type | Description |
|------|------|-------------|
| `foundry.o11y.hanzo.ai/o11y-binary-path` | string | Path to the Hanzo O11y binary |
| `foundry.o11y.hanzo.ai/ingester-binary-path` | string | Path to the OTel Collector binary |
| `foundry.o11y.hanzo.ai/metastore-postgres-binary-path` | string | Path to the PostgreSQL binary |

```yaml
apiVersion: v1alpha1
metadata:
  name: o11y
  annotations:
        foundry.o11y.hanzo.ai/o11y-binary-path: /opt/o11y/bin/o11y
        foundry.o11y.hanzo.ai/ingester-binary-path: /opt/ingester/bin/otel-collector
        foundry.o11y.hanzo.ai/metastore-postgres-binary-path: /usr/bin/postgres
spec:
  deployment:
    flavor: binary
    mode: systemd
```
