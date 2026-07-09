# Standalone Docker Image

| | |
| --- | --- |
| **Casting** | `systemd` / `binary` |
| **Use Case** | Single Docker image for quick testing, development, and CI |

## Overview

An OpenTelemetry-native observability backend in a single Docker image. The standalone image bundles all O11y components into one container for development, demo, and testing environments.

**Included components:**

- **O11y** - query engine and UI
- **OpenTelemetry Collector** - telemetry ingestion
- **ClickHouse** - telemetry storage
- **SQLite** - metadata storage
- **[Foundry](https://github.com/SigNoz/foundry)** - deployment orchestration via `foundryctl`

Applications can send telemetry using OpenTelemetry's standard defaults (OTLP gRPC/HTTP) without additional configuration. On first boot, Foundry generates all service configs and starts components via systemd.

## Prerequisites

- Docker Engine 20.10+

## Deploy

```bash
docker run -d --name o11y --privileged \
    -p 8080:8080 \
    -p 4317:4317 \
    -p 4318:4318 \
    signoz/signoz-standalone:latest
```

Access O11y UI at `http://localhost:8080`.

Send telemetry to:

- OTLP gRPC: `localhost:4317`
- OTLP HTTP: `localhost:4318`

## Customization

To customize the deployment, mount your own `casting.yaml` into the container:

```bash
docker run -d --name o11y --privileged \
    -p 8080:8080 \
    -p 4317:4317 \
    -p 4318:4318 \
    -v ./casting.yaml:/etc/foundry/casting.yaml \
    signoz/signoz-standalone:latest
```

See the default [casting.yaml](casting.yaml) for the full config structure.

## Persist Data

```bash
docker run -d --name o11y --privileged \
    -p 8080:8080 \
    -p 4317:4317 \
    -p 4318:4318 \
    -v o11y-clickhouse:/var/lib/clickhouse \
    -v o11y-data:/var/lib/o11y \
    signoz/signoz-standalone:latest
```

## After deployment

```bash
# View logs for all services
docker exec o11y journalctl -f

# View logs for a specific service
docker exec o11y journalctl -u o11y-o11y.service -f
docker exec o11y journalctl -u o11y-ingester.service -f
docker exec o11y journalctl -u o11y-telemetrystore-clickhouse-0-0.service -f
```

## Limitations

- Requires `--privileged` flag (systemd needs cgroup access)
- `docker logs` is empty - use `journalctl` inside the container
- Single-node only (no clustering)
