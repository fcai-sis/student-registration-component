import { Router } from "express";

import asyncHandler from "../../core/asyncHandler.js";
import commitHandler from "./logic/handlers/commit.handler.js";
import startSessionHandler from "./logic/handlers/startSession.handler.js";
import updateMappingHandler from "./logic/handlers/updateMapping.handler.js";
import cancelSessionHandler from "./logic/handlers/cancelSession.handler.js";
import uploadFileMiddleware from "./logic/middlewares/uploadFile.middleware.js";
import ensureFileIsExcelMiddleware from "./logic/middlewares/ensureFileIsExcel.middleware.js";
import ensureFileUploadedMiddleware from "./logic/middlewares/ensureFileUploaded.middleware.js";
import checkActiveSessionMiddleware from "./logic/middlewares/checkActiveSession.middleware.js";
import validateMappingJsonMiddleware from "./logic/middlewares/validateMappingJson.middleware.js";
import readStudentsFromExcelMiddlerware from "./logic/middlewares/readStudentsFromExcel.middleware.js";
import validateMappingAgainstExcelFileMiddleware from "./logic/middlewares/validateMappingAgainstExcelFile.middleware.js";
import validateMappingAgainstStudentModelMiddleware from "./logic/middlewares/validateMappingAgainstStudentModel.middleware.js";

export default (router: Router) => {
  /**
   * Starts a new registration session if there isn't an active one.
   * The student affairs employee uploades an Excel file containing the students data.
   */
  router.post(
    "/start",

    // Ensure there is no active registration session
    asyncHandler(checkActiveSessionMiddleware(false)),

    // Validate the uploaded excel file
    uploadFileMiddleware,
    ensureFileUploadedMiddleware,
    ensureFileIsExcelMiddleware,

    // Read students data from the uploaded excel file
    asyncHandler(readStudentsFromExcelMiddlerware),

    // Start the registration session
    asyncHandler(startSessionHandler)
  );

  /**
   * Updates the mapping from the uploaded students Excel file to the Student model.
   * The new mapping is validated against the Student model and the previously uploaded Excel file, then saved in the registration session.
   */
  router.patch(
    "/mapping",

    // Check if there is an active registration session
    asyncHandler(checkActiveSessionMiddleware(true)),

    // Validate the mapping
    validateMappingJsonMiddleware,
    validateMappingAgainstStudentModelMiddleware,
    validateMappingAgainstExcelFileMiddleware,

    // Update the mapping
    asyncHandler(updateMappingHandler)
  );

  /**
   * Commits the staged students to the actual students collection.
   */
  router.post(
    "/commit",

    // Check if there is an active registration session
    asyncHandler(checkActiveSessionMiddleware(true)),

    // Commit the staged students
    asyncHandler(commitHandler)
  );

  /**
   * Cancels the active registration session.
   */
  router.post(
    "/cancel",

    // Check if there is an active registration session
    asyncHandler(checkActiveSessionMiddleware(true)),

    // Cancel the active registration session
    asyncHandler(cancelSessionHandler)
  );
};
