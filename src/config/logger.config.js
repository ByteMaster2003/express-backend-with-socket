import path from "path";

import winston from "winston";

import { AppConfig } from "./env.config.js";

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const Logger = winston.createLogger({
  level: AppConfig.NODE_ENV === "development" ? "debug" : "info",
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.timestamp({
      format: () => new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level}: ${message}`;
        })
      )
    }),
    // Error log file transport
    new winston.transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 20
    }),
    // Combined log file transport
    new winston.transports.File({
      filename: path.join("logs", "info.log"),
      maxsize: 5242880, // 5MB
      maxFiles: 20
    })
  ]
});

const socketLogFormat = winston.format.printf(({ timestamp, level, message, metadata, data }) => {
  const eventType = `[==================== ${message} ====================]`;
  let logMessage = `${timestamp} ${level}: ${eventType} ${JSON.stringify(metadata, null, 2)}\n`;

  if (data) {
    logMessage = `${logMessage}Data: ${JSON.stringify(data)}\n`;
  }

  return logMessage;
});

const SocketLogger = winston.createLogger({
  level: AppConfig.NODE_ENV === "development" ? "debug" : "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    }),
    socketLogFormat
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
      format: winston.format.combine(winston.format.colorize(), socketLogFormat)
    }),
    // Error log file transport
    new winston.transports.File({
      filename: path.join("logs", "socket-error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 20
    }),
    // Combined log file transport
    new winston.transports.File({
      filename: path.join("logs", "socket-info.log"),
      level: "info",
      maxsize: 5242880, // 5MB
      maxFiles: 20
    })
  ]
});

export { Logger, SocketLogger };
