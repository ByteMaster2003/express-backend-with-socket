import IORedis from "ioredis";

import { AppConfig, Logger } from "../config/index.js";

export const redisClient = new IORedis(AppConfig.REDIS_URL, {
  maxRetriesPerRequest: null
});

redisClient.on("ready", () => {
  Logger.info("Redis Server Ready To Use");
});

redisClient.on("error", (error) => {
  Logger.error(
    "==================================== Cache Error ===================================="
  );
  Logger.error(error);
});

redisClient.on("end", () => {
  Logger.info("Client disconnected from redis!");
});

process.on("SIGINT", () => {
  redisClient.quit();
});
