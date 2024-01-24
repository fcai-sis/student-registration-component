import { Workbook } from "exceljs";
import { Request, Response, NextFunction } from "express";

import logger from "../../../../core/logger";
import ExcelRow from "../../data/types/excelRow.type";
import {
  getExcelColumnsHeaders,
  getExcelRows,
  getStudentsWorkSheet,
} from "../../../common/logic/utils/excel.utils";

type MiddlewareRequest = Request<
  {},
  {},
  {
    workbook: Workbook;
    students: ExcelRow[];
    excelColumnsHeaders: string[];
  }
>;

/**
 * Reads the students from the uploaded Excel file,
 * and attaches the students and the Excel columns headers to the request object.
 */
const middleware = async (
  req: MiddlewareRequest,
  _: Response,
  next: NextFunction
) => {
  const workbook = req.body.workbook;

  const worksheet = getStudentsWorkSheet(workbook);

  const excelRows = getExcelRows(worksheet);

  const excelColumnsHeaders = getExcelColumnsHeaders(worksheet);

  req.body.students = excelRows;
  req.body.excelColumnsHeaders = excelColumnsHeaders;

  logger.debug(
    `Read ${excelRows.length} students from the uploaded Excel file`
  );
  logger.debug(`Excel columns headers: ${excelColumnsHeaders}`);

  next();
};

export default middleware;
