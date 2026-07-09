# Docker Swarm

| Field | Value |
| --- | --- |
| **Mode** | `docker` |
| **Flavor** | `swarm` |
| **Platform** | `-` |

## Overview

Deploys O11y on a Docker Swarm cluster. Foundry generates a Compose file and deploys it as a stack using `docker stack deploy`.

## Prerequisites

- Docker Engine 20.10+ with Swarm mode initialized (`docker swarm init`)
- At least one manager node

## Configuration

```yaml
apiVersion: v1alpha1
metadata:
  name: o11y
spec:
  deployment:
    flavor: swarm
    mode: docker
```

## Deploy

```bash
foundryctl cast -f casting.yaml
```

Or step by step:

```bash
# Generate the compose file
foundryctl forge -f casting.yaml

# Deploy manually
docker stack deploy -c pours/deployment/compose.yaml o11y
```

## Generated output

```text
pours/deployment/
  compose.yaml
  configs/
    ingester/
      ingester.yaml
      opamp.yaml
    telemetrykeeper/
      clickhousekeeper/
        keeper-0.yaml
    telemetrystore/
      clickhouse/
        config.yaml
        functions.yaml
```

## After deployment

```bash
# List services in the stack
docker stack services o11y

# View logs for a service
docker service logs o11y_o11y -f

# Remove the stack
docker stack rm o11y
```

## Customization

For platform-level changes to the generated `compose.yaml`, use [patches](../../../concepts/patches.md).
