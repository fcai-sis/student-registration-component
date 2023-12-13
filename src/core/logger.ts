import env from "../env.js";
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Structure logs for efficient analysis
  ),
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({
      filename: `${env.LOGS_PATH}/error.log`,
      level: "error",
    }),

    // Write all logs with importance level of `info` or less to `all.log`
    new winston.transports.File({ filename: `${env.LOGS_PATH}/all.log` }),
  ],
});

// If we're not in production then log to the `console`
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
