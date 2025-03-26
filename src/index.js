import { createServer } from "node:http";

import app from "./app.js";
import { AppConfig, Logger } from "./config/index.js";
import { initializeSocket } from "./socket/index.js";
import { ConnectDB } from "./utils/index.js";

let server;
const port = AppConfig.PORT;
const httpServer = createServer(app);

// Initialize Socket Server
initializeSocket(httpServer);

// ConnectDB, Redis and start Express Server
ConnectDB(AppConfig.MONGO_URI).then(() => {
  server = httpServer.listen(port, () => {
    Logger.info(`Listening on port ${port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      Logger.info("Terminated Express Server");
      process.exit(1);
    });
  } else {
    Logger.error("Server didn't start properly");
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  Logger.error(error);
  exitHandler();
};

process.on("SIGINT", () => {
  exitHandler();
});
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
