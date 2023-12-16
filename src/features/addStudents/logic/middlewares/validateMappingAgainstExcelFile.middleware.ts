import xlsx from "xlsx";
import { Request, Response, NextFunction } from "express";

import {
  getExcelColumnsHeaders,
  getStudentsWorkSheet,
} from "../utils/excel.utils.js";
import ExcelMapping from "../../data/types/mapping.type.js";
import { getStudentKeys } from "../utils/mapping.utils.js";

type MiddlewareRequest = Request<
  {},
  {},
  { workbook: xlsx.WorkBook; mapping: ExcelMapping }
>;

/**
 * Validates the `mapping` field against the uploaded excel file, ensuring that
 * all values of keys in the `mapping` field are present in the excel file.
 */
export default (req: MiddlewareRequest, res: Response, next: NextFunction) => {
  const workbook = req.body.workbook as xlsx.WorkBook;

  // Get all excel columns headers
  const worksheet = getStudentsWorkSheet(workbook);
  const excelColumnsHeaders = getExcelColumnsHeaders(worksheet);

  // Get mapping keys
  const mapping = req.body.mapping;
  const mappingKeys = getStudentKeys(mapping);

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
