import { Server } from "socket.io";

import { socketLogger } from "./socket.logger.js";
import { Logger } from "../config/index.js";
import { verifySocketSession } from "../middlewares/index.js";

export let io;
export const initializeSocket = (server) => {
  io = new Server(server);

  // Authenticate user
  io.use(verifySocketSession);

  // Connection event
  io.on("connection", (socket) => {
    const userId = socket.user.id;
    Logger.info(`User connected: ${userId}`);

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Register socket logger
    socketLogger(io, socket);

    // Register events
    // auctionEvents(io, socket);
    // notificationEvents(io, socket);
    // bidEvents(io, socket);

    socket.on("error", (error) => {
      Logger.error(
        "===================================== Socket Error =====================================\n" +
          `${error.stack}\n`
      );
    });
  });

  Logger.info("Socket Server Initialized");
  return io;
};
