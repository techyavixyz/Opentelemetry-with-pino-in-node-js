// // tracing.js
// 'use strict'
// const process = require('process');
// const opentelemetry = require('@opentelemetry/sdk-node');
// const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
// const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
// const { Resource } = require('@opentelemetry/resources');
// const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
// const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

// // Set the logger for OpenTelemetry's diagnostics
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

// // Set up the OTLP exporter options
// const exporterOptions = {
//   url: 'http://localhost:4318/v1/traces' // Make sure this matches the Signoz OTLP endpoint
// };

// // Create the trace exporter
// const traceExporter = new OTLPTraceExporter(exporterOptions);

// // Set up the OpenTelemetry SDK
// const sdk = new opentelemetry.NodeSDK({
//   traceExporter,
//   instrumentations: [getNodeAutoInstrumentations()],
//   resource: new Resource({
//     [SemanticResourceAttributes.SERVICE_NAME]: 'node_login'
//   })
// });

// // Start the OpenTelemetry SDK to begin tracing
// sdk.start();

// // Gracefully shut down the SDK on process exit
// process.on('SIGTERM', () => {
//   sdk.shutdown()
//     .then(() => console.log('Tracing terminated'))
//     .catch((error) => console.log('Error terminating tracing', error))
//     .finally(() => process.exit(0));
// });


'use strict'
const process = require('process');
const opentelemetry = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

// Disable OpenTelemetry's internal logging by setting it to a lower level
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.NONE);  // No internal OpenTelemetry logs in console

// Set up the OTLP exporter options (Signoz endpoint)
const exporterOptions = {
  url: 'http://localhost:4318/v1/traces' // Make sure this matches the Signoz OTLP endpoint
};

// Create the trace exporter
const traceExporter = new OTLPTraceExporter(exporterOptions);

// Set up the OpenTelemetry SDK for tracing
const sdk = new opentelemetry.NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'node_login'
  })
});

// Start the OpenTelemetry SDK to begin tracing
sdk.start();

// Gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});



