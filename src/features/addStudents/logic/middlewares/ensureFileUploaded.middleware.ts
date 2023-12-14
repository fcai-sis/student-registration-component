import { NextFunction, Request, Response } from "express";

/**
 * Checks if a file was uploaded. Returns `400 Bad Request` if no file was uploaded.
 */
export default (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    res.status(400).json({
      error: "no-file-uploaded",
      message: "Please upload the students excel file",
    });
    return;
  }

  next();
};
