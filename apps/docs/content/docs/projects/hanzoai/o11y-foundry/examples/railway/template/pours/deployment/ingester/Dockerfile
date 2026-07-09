FROM signoz/signoz-otel-collector:latest

COPY ingester.yaml /etc/otel-collector-config.yaml
COPY opamp.yaml /etc/opamp-config.yaml


ENV O11Y_OTEL_COLLECTOR_CLICKHOUSE_DSN=tcp://o11y-telemetrystore-clickhouse.railway.internal:9000

ENV O11Y_OTEL_COLLECTOR_TIMEOUT=10m