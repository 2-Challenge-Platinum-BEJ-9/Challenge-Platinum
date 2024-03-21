const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    winston.format.prettyPrint()
  ),
  transports: [
    new DailyRotateFile({
      level: "error",
      filename: "./log/app-error-%DATE%.log",
      zippedArchive: true,
      maxSize: "2m",
      maxFiles: "14d",
      handleExceptions: true,
      handleRejections: true,
    }),
    new DailyRotateFile({
      level: "warn",
      filename: "./log/app-exception-%DATE%.log",
      zippedArchive: true,
      maxSize: "2m",
      maxFiles: "14d",
    }),
    new DailyRotateFile({
      level: "info",
      filename: "./log/app-info-%DATE%.log",
      zippedArchive: true,
      maxSize: "2m",
      maxFiles: "14d",
    }),
  ],
});

module.exports = logger;
