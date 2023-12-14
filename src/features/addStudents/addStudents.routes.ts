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
  router.post(
    "/upload",

    // Validate uploaded excel file
    uploadFileMiddleware,
    ensureFileUploadedMiddleware,
    ensureFileIsExcelMiddleware,

    // Validate `mapping` field
    validateMappingJsonMiddleware,
    validateMappingAgainstStudentModelMiddleware,
    validateMappingAgainstExcelFileMiddleware,

    // Upload students data to the database
    asyncHandler(addStudentsFromExcel)
  );
};
