import { createLogger, format, transports } from "winston";

const isDev = process.env.NODE_ENV !== "production";

const devFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true }),
  format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let msg = `[${timestamp}] ${level}: ${message}`;
    if (stack) {
      msg += `\n${stack}`;
    }
    if (Object.keys(meta).length) {
      msg += ` | meta: ${JSON.stringify(meta, null, 2)}`;
    }
    return msg;
  })
);

const prodFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

const logger = createLogger({
  level: "info",
  format: isDev ? devFormat : prodFormat,
  transports: [
    new transports.Console(),
    // Uncomment to log to files:
    // new transports.File({ filename: "error.log", level: "error" }),
    // new transports.File({ filename: "combined.log" }),
  ],
});

// Helper to always log an Error object
export function logError(err: unknown, context?: string) {
  if (err instanceof Error) {
    logger.error(context ? `${context}: ${err.message}` : err.message, {
      stack: err.stack,
    });
  } else {
    logger.error(context ? `${context}: ${String(err)}` : String(err));
  }
}

export default logger;
