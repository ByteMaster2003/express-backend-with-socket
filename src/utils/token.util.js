import httpStatus from "http-status";
import jwt from "jsonwebtoken";

import { generateMD5Hash, ApiError, redisClient } from "./index.js";
import { AppConfig } from "../config/index.js";

/**
 * Signs an access token for a given user.
 *
 * @param {string} userId - The user's unique identifier (email).
 * @param {Object} [payload={}] - Additional claims to include in the token.
 * @returns {Promise<string>} A promise that resolves with the signed access token.
 *
 *
 * @description
 * This function generates a signed access token using a secret key from `AppConfig.AUTH.ACCESS_TOKEN_SECRET`.
 * The token is issued with:
 * - `expiresIn`: 1 hour
 * - `issuer`: "auth service"
 * - `audience`: userId (email)
 *
 * Once generated, the token is cached using `authenticationCache.putSync` with a hashed key.
 * If an error occurs, it is logged and an `ApiError` with HTTP 500 status is thrown.
 */
const signAccessToken = async (userId, payload = {}) => {
  const secret = AppConfig.AUTH.ACCESS_TOKEN_SECRET;
  const expiryInSeconds = AppConfig.AUTH.ACCESS_TOKEN_EXPIRY;

  const options = {
    expiresIn: expiryInSeconds,
    issuer: "auth service",
    audience: userId
  };

  const token = jwt.sign(payload, secret, options);

  // Store AccessToken in cache
  const cacheKey = generateMD5Hash(`${userId}_access_token`);
  await redisClient.set(cacheKey, token, "EX", expiryInSeconds);

  return token;
};

/**
 * Verifies an access token and checks its validity against the cache.
 *
 * @param {string} accessToken - The access token to verify.
 * @returns {Promise<Object>} A promise that resolves with the decoded token payload if verification is successful.
 *
 * @throws {ApiError} If the token is expired, invalid, or verification fails.
 *
 * @description
 * This function verifies the given access token using the secret key from `AppConfig.AUTH.ACCESS_TOKEN_SECRET`.
 *
 * Once verified, the function retrieves the email from the token payload and checks if the token matches the cached one.
 * If the token does not match the cached token, an `ApiError` with HTTP 401 (Unauthorized) is thrown.
 */
const verifyAccessToken = async (accessToken) => {
  // Validate JWT Token
  const payload = jwt.verify(accessToken, AppConfig.AUTH.ACCESS_TOKEN_SECRET);

  // Validate against cache
  const { id } = payload;
  const cachedAccessToken = await redisClient.get(generateMD5Hash(`${id}_access_token`));

  // Throw Error if doesn't matches
  if (accessToken !== cachedAccessToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid access token!");
  }

  return payload;
};

/**
 * Signs an session token for a given user.
 *
 * @param {string} userId - The user's unique identifier (email/id).
 * @param {Object} [payload={}] - Additional claims to include in the token.
 * @returns {Promise<string>} A promise that resolves with the signed access token.
 *
 *
 * @description
 * This function generates a signed access token using a secret key from `AppConfig.AUTH.ACCESS_TOKEN_SECRET`.
 * The token is issued with:
 * - `expiresIn`: 1 hour
 * - `issuer`: "auth service"
 * - `audience`: userId (email)
 *
 * Once generated, the token is cached using `authenticationCache.putSync` with a hashed key.
 * If an error occurs, it is logged and an `ApiError` with HTTP 500 status is thrown.
 */
const signSessionToken = async (userId, payload = {}) => {
  const secret = AppConfig.AUTH.SESSION_TOKEN_SECRET;
  const expiryInSeconds = AppConfig.AUTH.SESSION_TOKEN_EXPIRY;

  const options = {
    expiresIn: expiryInSeconds,
    issuer: "auth service",
    audience: userId
  };

  const token = jwt.sign(payload, secret, options);

  // Store AccessToken in cache
  const cacheKey = generateMD5Hash(`${userId}_session_token`);
  await redisClient.set(cacheKey, token, "EX", expiryInSeconds);

  return token;
};

/**
 * Verifies an session token and checks its validity against the cache.
 *
 * @param {string} accessToken - The access token to verify.
 * @returns {Promise<Object>} A promise that resolves with the decoded token payload if verification is successful.
 *
 * @throws {ApiError} If the token is expired, invalid, or verification fails.
 *
 * @description
 * This function verifies the given access token using the secret key from `AppConfig.AUTH.ACCESS_TOKEN_SECRET`.
 *
 * Once verified, the function retrieves the email from the token payload and checks if the token matches the cached one.
 * If the token does not match the cached token, an `ApiError` with HTTP 401 (Unauthorized) is thrown.
 */
const verifySessionToken = async (sessionToken) => {
  // Validate JWT Token
  const payload = jwt.verify(sessionToken, AppConfig.AUTH.SESSION_TOKEN_SECRET);

  // Validate against cache
  const { id } = payload;
  const cachedSessionToken = await redisClient.get(generateMD5Hash(`${id}_session_token`));

  // Throw Error if doesn't matches
  if (sessionToken !== cachedSessionToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid session!");
  }

  return payload;
};

export default {
  signAccessToken,
  verifyAccessToken,
  signSessionToken,
  verifySessionToken
};
