import { Router } from "express";

import asyncHandler from "../../core/asyncHandler";
import commitHandler from "./logic/handlers/commit.handler";
import startSessionHandler from "./logic/handlers/startSession.handler";
import updateMappingHandler from "./logic/handlers/updateMapping.handler";
import cancelSessionHandler from "./logic/handlers/cancelSession.handler";
import uploadFileMiddleware from "./logic/middlewares/uploadFile.middleware";
import readActiveSessionHandler from "./logic/handlers/readActiveSession.handler";
import readStagedStudentsHandler from "./logic/handlers/readStagedStudents.handler";
import ensureFileIsExcelMiddleware from "./logic/middlewares/ensureFileIsExcel.middleware";
import ensureFileUploadedMiddleware from "./logic/middlewares/ensureFileUploaded.middleware";
import checkActiveSessionMiddleware from "./logic/middlewares/checkActiveSession.middleware";
import validateMappingJsonMiddleware from "./logic/middlewares/validateMappingJson.middleware";
import readStudentsFromExcelMiddlerware from "./logic/middlewares/readStudentsFromExcel.middleware";
import validatePaginationQueryParams from "./logic/middlewares/validatePaginationQueryParams.middleware";
import validateMappingAgainstExcelFileMiddleware from "./logic/middlewares/validateMappingAgainstExcelFile.middleware";
import validateMappingAgainstStudentModelMiddleware from "./logic/middlewares/validateMappingAgainstStudentModel.middleware";

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

  /**
   * Checks if there is an active registration session.
   */
  router.get(
    "/active",

    // Check if there is an active registration session
    asyncHandler(checkActiveSessionMiddleware(true)),

    // Read and return the active registration session
    asyncHandler(readActiveSessionHandler)
  );

  /**
   * Get staged students of the active registration session.
   */
  router.get(
    "/active/staged",

    // Check if there is an active registration session
    asyncHandler(checkActiveSessionMiddleware(true)),

    // Validate the page and pageSize query parameters
    validatePaginationQueryParams,

    // Read and return the staged students
    asyncHandler(readStagedStudentsHandler)
  );
  /**
   * An endpoint to update the staged student data
   */

  // router.patch(
  //   "/update",
  //   asyncHandler(checkActiveSessionMiddleware(true)),
  //   asyncHandler(updateStagedStudentHandler)
  // );

  /**
   * An endpoint to rest the data to the original data
   */
  // router.patch(
  //   "/reset",
  //   asyncHandler(checkActiveSessionMiddleware(true)),
  //   asyncHandler(resetStagedStudentHandler)
  // );
};
