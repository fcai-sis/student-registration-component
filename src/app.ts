import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";

import { sessionRouter, studentsRouter } from "./router";
import { isDev } from "./env";
import logger from "./core/logger";
import cookieParser from "cookie-parser";

// Create Express server
const app = express();

// Initialize the context object
app.use((req: Request, _: Response, next: NextFunction) => {
  req.context = {};
  next();
});

// Parse cookies
app.use(cookieParser());

// Configure HTTP request logger middleware
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.http(message) },
    skip: () => isDev,
  })
);

// Use helmet to secure HTTP headers
// https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
app.use(helmet());

// Disable the `X-Powered-By` HTTP header for security
// https://expressjs.com/en/advanced/best-practice-security.html#reduce-fingerprinting
app.disable("x-powered-by");

// Use compression middleware to compress HTTP responses
// https://stackoverflow.com/a/58813283/14174934
app.use(compression());

// Enable CORS
// https://stackoverflow.com/a/61988727/14174934
app.use(cors({
  origin: "http://localhost:5174",
  credentials: true,
}));

// Parse JSON and url-encoded query
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Parse cookies
app.use(cookieParser());

// Mount API routes
app.use("/students", studentsRouter());
app.use("/session", sessionRouter());

// TODO: Custom 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Not found" });
});

// TODO: Custom error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).json({ message: "Something broke on our end" });
});

export default app;
