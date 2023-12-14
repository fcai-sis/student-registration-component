import xlsx from "xlsx";
import { Request, Response, NextFunction } from "express";

import { getExcelColumnsHeaders } from "../utils/excel.utils.js";

/**
 * Validates the `mapping` field against the uploaded excel file, ensuring that
 * all values of keys in the `mapping` field are present in the excel file.
 */
export default (req: Request, res: Response, next: NextFunction) => {
  const workbook = req.body.workbook as xlsx.WorkBook;
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  // Get all excel columns headers
  const excelColumnsHeaders = getExcelColumnsHeaders(worksheet);

  const mapping = req.body.mapping;

  // Get mapping keys
  const mappingKeys = Object.keys(mapping);

  // Get all mapping keys that do not exist in the excel file
  const incorrectMappingKeys = mappingKeys.filter(
    (key) => !excelColumnsHeaders.includes(mapping[key])
  );

  // If there are any incorrect mappings, return an error
  if (incorrectMappingKeys.length > 0) {
    res.status(400).json({
      error: "mapping-invalid-excel-fields",
      message:
        "Please make sure all fields are mapped to the correct fields in the excel file",
      fields: incorrectMappingKeys.map((key) => mapping[key]),
      availableFields: excelColumnsHeaders,
    });
    return;
  }

  next();
};
