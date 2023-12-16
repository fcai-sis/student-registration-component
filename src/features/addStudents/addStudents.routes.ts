import { Router } from "express";

import asyncHandler from "../../core/asyncHandler.js";
import uploadFileMiddleware from "./logic/middlewares/uploadFile.middleware.js";
import addStudentsFromExcel from "./logic/handlers/addStudentsFromExcel.handler.js";
import ensureFileIsExcelMiddleware from "./logic/middlewares/ensureFileIsExcel.middleware.js";
import ensureFileUploadedMiddleware from "./logic/middlewares/ensureFileUploaded.middleware.js";
import validateMappingJsonMiddleware from "./logic/middlewares/validateMappingJson.middleware.js";
import validateMappingAgainstExcelFileMiddleware from "./logic/middlewares/validateMappingAgainstExcelFile.middleware.js";
import validateMappingAgainstStudentModelMiddleware from "./logic/middlewares/validateMappingAgainstStudentModel.middleware.js";

export default (router: Router) => {
  /**
   * Upload students data from an Excel file to the database.
   */
  router.post(
    "/upload",

    // Validate the uploaded excel file
    uploadFileMiddleware,
    ensureFileUploadedMiddleware,
    ensureFileIsExcelMiddleware,

    // Validate the `mapping` field, used to map the excel file columns to the Student model fields
    validateMappingJsonMiddleware,
    validateMappingAgainstStudentModelMiddleware,
    validateMappingAgainstExcelFileMiddleware,

    // Upload students data to the database
    asyncHandler(addStudentsFromExcel)
  );
};
