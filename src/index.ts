import morgan from "morgan";
import helmet from "helmet";
import express, { NextFunction, Request, Response } from "express";
import compression from "compression";
import cors from "cors";
import env, { isDev, validateEnvironmentVariables } from "./env.js";
import router from "./router.js";
import logger from "./core/logger.js";

validateEnvironmentVariables();

const app = express();

app.use(
  morgan("combined", {
    stream: { write: (message) => logger.http(message) },
    skip: () => isDev,
  })
);

app.use(helmet());
app.disable("x-powered-by");

app.use(compression());

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router());

// last app.use calls right before app.listen():

// TODO: custom 404
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Not found" });
});

// TODO: custom error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).json({ message: "Something broke!" });
});

app.listen(env.PORT, () => {
  logger.info(`Server is listening on port ${env.PORT}`);
});
