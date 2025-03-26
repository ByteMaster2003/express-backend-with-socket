import mongoose from "mongoose";

import { Logger } from "../config/index.js";

let connection = null;
const options = {
  serverSelectionTimeoutMS: 5000,
  retryWrites: true,
  retryReads: true,
  bufferCommands: false,
  connectTimeoutMS: 10000
};

const ConnectDB = async (MONGO_URI) => {
  if (connection == null) {
    connection = await mongoose.connect(MONGO_URI, options).catch((err) => {
      if (err.code === "ETIMEDOUT") {
        Logger.error("Connection timed out! %s", err.message);
      } else {
        Logger.error("Connection error: %s", err.message);
      }
    });
    Logger.info("Database connection established.");
  }

  return connection;
};

if (mongoose.connection) {
  mongoose.connection.on("error", (err) => {
    Logger.error("Connection error: %s", err.message);
    process.exit(1);
  });
}

export { ConnectDB };
