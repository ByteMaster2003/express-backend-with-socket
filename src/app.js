import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import ExpressMongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import httpStatus from "http-status";

import { morganConfig } from "./config/index.js";
import { errorConverter, errorHandler, languageMiddleware } from "./middlewares/index.js";
import appRoutes from "./routes/v1/index.js";
import { ApiError } from "./utils/index.js";

const app = express();

app.use(morganConfig.errorHandler);
app.use(morganConfig.successHandler);

// parse json request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse cookies
app.use(cookieParser());

// sanitize request data
app.use(ExpressMongoSanitize());

// check language
app.use(languageMiddleware);

// enable cors
app.options("*", cors());
app.use(
  cors({
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-refresh-token"],
    credentials: true
  })
);

// set security HTTP headers
app.use(helmet());

// Enable trust proxy
app.set("trust proxy", 1);

// Prevent favicon error
app.get("/favicon.ico", (req, res) => res.status(204));

// Serve Static files
app.use("/uploads", express.static("src/uploads"));

// v1 api routes
app.use("/api/v1", appRoutes);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
