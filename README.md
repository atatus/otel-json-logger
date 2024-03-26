# README

OTel JSON Logger accepts telemetry directly from OpenTelemetry code instrumentation or collectors and print them in JSON format.

## Requirements

* Node 16


## Common setup

Clone the repo and install the dependencies.

```bash
git clone https://github.com/atatus/otel-json-logger.git
cd otel-json-logger
npm install
```

Clone the repo `opentelemetry-proto` for  OTLP protocol specification

```bash
git clone https://github.com/open-telemetry/opentelemetry-proto
```

## Usage

1. To start the express server, run the following

```bash
npm run start
```

This will run the server at `localhost:4318`

2. Configure the server endpoint in OTel collector configuration as follows

```yaml
receivers:
  otlp:

exporters:
  # HTTP setup
  otlphttp/otel-json-logger:
    endpoint: 'http://localhost:4318'
    compression: gzip

processors:
  batch:

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlphttp/otel-json-logger]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlphttp/otel-json-logger]
    logs:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlphttp/otel-json-logger]
```

> Instead of `localhost`, you can give your local IP in case you run OTel collector in different machine or inside the docker.


