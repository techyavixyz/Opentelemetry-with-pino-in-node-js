const winston = require('winston');
const { trace, context } = require('@opentelemetry/api'); // Import context and trace

// Custom log format to include trace ID
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  const span = trace.getSpan(context.active());  // Access the active span
  const traceId = span ? span.context().traceId : 'no-trace-id';  // If there's an active span, include the trace ID
  return `${timestamp} ${level}: ${message} (traceId: ${traceId})`;
});

// Create the Winston logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),  // Log to console
  ],
});

module.exports = logger;
