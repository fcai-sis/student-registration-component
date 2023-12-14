import { NextFunction, Request, Response } from "express";
import fs from "fs";
import xlsx from "xlsx";

/**
 * Checks if the file uploaded is a valid excel file.
 * Returns `400 Bad Request` if the file is not valid.
 *
 * Assumes that the file has already been uploaded in the `req.file` object.
 * Attaches the excel workbook to the request object in `req.body.workbook`.
 */
export default (req: Request, res: Response, next: NextFunction) => {
  // Check if the file uploaded is a valid excel file
  const buffer = fs.readFileSync(req.file!.path);

  try {
    // Parse the file
    const workbook = xlsx.read(buffer, { type: "buffer" });

    // Attach the workbook to the request object
    req.body.workbook = workbook;
  } catch (e) {
    res.status(400).json({
      error: "invalid-excel-file",
      message: "Please upload a valid excel file",
    });
    return;
  }

  next();
};
