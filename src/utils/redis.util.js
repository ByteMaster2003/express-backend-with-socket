import IORedis from "ioredis";

import { AppConfig, Logger } from "../config/index.js";

let redisInstance = null;

const createRedisClient = () => {
  if (redisInstance) {
    return redisInstance;
  }

  const client = new IORedis(AppConfig.REDIS_URL, {
    maxRetriesPerRequest: null
  });

  client.on("ready", () => {
    Logger.info("Redis server ready to use");
  });

  client.on("error", (error) => {
    Logger.error(`Redis error: ${error.message}`);
  });

  client.on("end", () => {
    Logger.info("Redis client disconnected");
    redisInstance = null;
  });

  redisInstance = client;
  return redisInstance;
};

export const redisClient = createRedisClient();

export const closeRedisConnection = async () => {
  if (redisInstance && redisInstance.status === "ready") {
    await redisInstance.quit();
    redisInstance = null;
    Logger.info("Redis connection closed");
  }
};
