import { createServer } from "node:http";

import app from "./app.js";
import { AppConfig, Logger } from "./config/index.js";
import { initializeSocket } from "./socket/index.js";
import { ConnectDB, closeRedisConnection } from "./utils/index.js";

/** @type {import('http').Server | undefined} - HTTP server instance for the application */
let server;
const port = AppConfig.PORT;
/** @type {import('http').Server} - HTTP server created from Express app */
const httpServer = createServer(app);

// Initialize Socket Server
initializeSocket(httpServer);

// ConnectDB, Redis and start Express Server
ConnectDB(AppConfig.MONGO_URI).then(() => {
  server = httpServer.listen(port, () => {
    Logger.info(`Listening on port ${port}`);
  });
});

const exitHandler = async () => {
  try {
    // Close HTTP server
    if (server) {
      Logger.info("Shutting down application...");
      // Close the server gracefully
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      Logger.info("Express server closed");
    }

    // Close Redis connection
    await closeRedisConnection();

    process.exit(0);
  } catch (error) {
    Logger.error(`Error during shutdown: ${error.message}`);
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  Logger.error(`Unexpected error: ${error.message}`);
  exitHandler();
};

process.on("SIGINT", () => {
  exitHandler();
});
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
