/* eslint-disable camelcase */
import z from "zod";

const listOfVariables = ["MONGO_URI", "ACCESS_TOKEN_SECRET", "SESSION_TOKEN_SECRET"];

const schemaObject = {
  PORT: z.string().optional(),
  NODE_ENV: z.string().optional()
};

listOfVariables.forEach((variable) => {
  schemaObject[variable] = z.string({
    required_error: `${variable} is required!`
  });
});

export const envSchema = z.object(schemaObject);
