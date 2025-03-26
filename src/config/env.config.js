import { dirname, join } from "path";
import { fileURLToPath } from "url";

import dotenv from "dotenv";
import { ZodError } from "zod";

import { envSchema } from "../validations/env.validation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envFilePath = join(__dirname, "./../../.env");
dotenv.config({ path: envFilePath });

let Vars = null;
try {
  Vars = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    const errorMessage = error.errors.map((err) => err.message).join(", ");
    throw new Error(`ENV Error: ${errorMessage}`);
  }
  throw new Error(error.message);
}

const AppConfig = {
  NODE_ENV: Vars.NODE_ENV || "development",
  PORT: Vars.PORT || 8080,
  MONGO_URI: Vars.MONGO_URI,
  REDIS_URL: Vars.REDIS_URL,
  AUTH: {
    ACCESS_TOKEN_SECRET: Vars.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY: 30 * 24 * 60 * 60,
    SESSION_TOKEN_SECRET: Vars.SESSION_TOKEN_SECRET,
    SESSION_TOKEN_EXPIRY: 30 * 60
  }
};

export { AppConfig };
