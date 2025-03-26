import { ZodError } from "zod";

/**
 * validate object with given schema
 * @param {import("zod").ZodSchema} schema
 * @param {object} data
 * @returns {object} object
 */
export const validatePayloadWithSchema = (schema, data) => {
  const result = {};

  try {
    result.data = schema.parse(data);
  } catch (error) {
    let errorMessage = "";
    if (error instanceof ZodError) {
      errorMessage = error.errors.map((err) => err.message).join(", ");
    } else {
      errorMessage = "Invalid Data";
    }
    result.error = errorMessage;
  }

  return result;
};
