import fs from "fs";
import xlsx from "xlsx";
import { NextFunction, Request, Response } from "express";

type HandlerRequest = Request<{}, {}, { workbook: xlsx.WorkBook }>;

/**
 * Checks if the file uploaded is a valid excel file.
 * Returns `400 Bad Request` if the file is not valid.
 *
 * Assumes that the file has already been uploaded in the `req.file` object.
 * Attaches the excel workbook to the request object in `req.body.workbook`.
 */
export default (req: HandlerRequest, res: Response, next: NextFunction) => {
  // Read the uploaded Excel file
  const buffer = fs.readFileSync(req.file!.path);

  try {
    // Parse the file, if the parsing is successful, the file is a valid excel file
    const workbook = xlsx.read(buffer, { type: "buffer" });

    // Attach the workbook to the request object
    req.body.workbook = workbook;
  } catch (e) {
    // If the parsing failed, the file is not a valid excel file
    res.status(400).json({
      error: "invalid-excel-file",
      message: "Please upload a valid excel file",
    });

    return;
  }

  next();
};
