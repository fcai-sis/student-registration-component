import xlsx from "xlsx";
import { Request, Response, NextFunction } from "express";

import logger from "../../../../core/logger.js";
import ExcelRow from "../../data/types/excelRow.type.js";
import {
  getExcelColumnsHeaders,
  getStudentsWorkSheet,
} from "../../../common/logic/utils/excel.utils.js";

type MiddlewareRequest = Request<
  {},
  {},
  {
    workbook: xlsx.WorkBook;
    students: ExcelRow[];
    excelColumnsHeaders: string[];
  }
>;

/**
 * Reads the students from the uploaded Excel file,
 * and attaches the students and the Excel columns headers to the request object.
 */
const middlware = async (
  req: MiddlewareRequest,
  _: Response,
  next: NextFunction
) => {
  const workbook = req.body.workbook;
  const workSheet = getStudentsWorkSheet(workbook);

  const excelRows = xlsx.utils.sheet_to_json<ExcelRow>(workSheet);
  const excelColumnsHeaders = getExcelColumnsHeaders(workSheet);

  req.body.students = excelRows;
  req.body.excelColumnsHeaders = excelColumnsHeaders;

  logger.debug(
    `Read ${excelRows.length} students from the uploaded Excel file`
  );
  logger.debug(`Excel columns headers: ${excelColumnsHeaders}`);

  next();
};

export default middlware;
