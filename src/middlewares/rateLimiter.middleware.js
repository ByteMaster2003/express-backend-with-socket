import rateLimit from "express-rate-limit";
import httpStatus from "http-status";

import { AppConfig } from "../config/index.js";

export const RateLimits = {
  THREE_RP_HOUR: { windowMs: 60 * 60 * 1000, max: 3 }, // Allows 3 requests per hour
  THREE_RP_DAY: { windowMs: 60 * 60 * 1000, max: 3 }, // Allows 3 requests per hour
  HUNDRED_RP_HOUR: { windowMs: 60 * 60 * 1000, max: 100 }, // Allows 100 requests per hour
  FIVE_HUNDRED_RP_HOUR: { windowMs: 60 * 60 * 1000, max: 500 }, // Allows 500 requests per hour
  FIVE_RP_MIN: { windowMs: 1 * 60 * 1000, max: 5 }, // Allows 5 requests per minute
  TWENTY_RP_MIN: { windowMs: 1 * 60 * 1000, max: 5 } // Allows 20 requests per minute
};

/**
 * Creates a rate limiter middleware for Express.
 *
 * @param {Object} options - Configuration options for the rate limiter.
 * @param {number} [options.windowMs=60000] - Time window in milliseconds for rate limiting (default: 1 minutes).
 * @param {number} [options.max=5] - Maximum number of requests allowed within the time window (default: 5).
 * @returns {RateLimitRequestHandler} RateLimitRequestHandler - The rate limiter middleware.
 */
export const rateLimiter = (config = RateLimits.FIVE_RP_MIN) =>
  rateLimit({
    windowMs: AppConfig.NODE_ENV === "development" ? 60000 : config.windowMs,
    max: AppConfig.NODE_ENV === "development" ? 100 : config.max,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    handler: (_req, res) => {
      res.status(httpStatus.TOO_MANY_REQUESTS).json({
        success: false,
        message: httpStatus[httpStatus.TOO_MANY_REQUESTS]
      });
    }
  });
