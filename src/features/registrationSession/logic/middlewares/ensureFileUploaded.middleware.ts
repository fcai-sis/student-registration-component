import { NextFunction, Request, Response } from "express";

import logger from "../../../../core/logger.js";

/**
 * Ensures that there is a file uploaded in the request object.
 *
 * @returns `400 Bad Request` if there is no file uploaded
 */
const middleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    logger.debug(`No file uploaded`);
    res.status(400).json({
      code: "no-file-uploaded",
      message: "No file uploaded, please upload an Excel file",
    });
    return;
  }

  logger.debug(`File uploaded`);

  next();
};

export default middleware;
