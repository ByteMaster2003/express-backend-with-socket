import httpStatus from "http-status";
import { z } from "zod";

import { ApiError, pick } from "../utils/index.js";

export const validate = (schema) => (req, __, next) => {
  const validSchema = pick(schema, ["params", "query", "body"]);
  const object = pick(req, Object.keys(validSchema));

  try {
    for (const key of Object.keys(validSchema)) {
      validSchema[key].parse(object[key]);
    }
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message
      }));

      return next(new ApiError(httpStatus.BAD_REQUEST, "Validation Error", errors));
    }
    return next(error);
  }
};
