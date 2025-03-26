import httpStatus from "http-status";
import mongoose from "mongoose";

import { AppConfig, Logger } from "../config/index.js";
import { ApiError } from "../utils/index.js";

const errorConverter = (err, _req, _res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;

    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  const { statusCode, message } = err;
  const response = {
    success: false,
    message
  };
  if (AppConfig.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.locals.errorMessage = err.message;
  Logger.error(
    "======================================== Error ========================================\n" +
      `Query: ${JSON.stringify(req.query)}\n` +
      `Params: ${JSON.stringify(req.params)}\n` +
      `Body: ${JSON.stringify(req.body)}\n\n` +
      `${err.stack}\n`
  );
  res.status(statusCode).send(response);
};

export { errorConverter, errorHandler };
