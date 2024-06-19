import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import { Role, checkRole } from "@fcai-sis/shared-middlewares";

import commitHandler from "./logic/handlers/commit.handler";
import precommitHandler from "./logic/handlers/precommit.handler";
import startSessionHandler from "./logic/handlers/start.handler";
import updateMappingHandler from "./logic/handlers/updateMapping.handler";
import cancelRegistrationSessionHandler from "./logic/handlers/cancel.handler";
import uploadFileMiddleware from "./logic/middlewares/uploadFile.middleware";
import readActiveSessionHandler from "./logic/handlers/fetchActive.handler";
import fetchPaginatedStagedStudentsHandler from "./logic/handlers/fetchPaginatedStagedStudents.handler";
import readMappedStudentsHandler from "./logic/handlers/fetchPaginatedMappedStudents";
import ensureFileIsExcelMiddleware from "./logic/middlewares/ensureFileIsExcel.middleware";
import ensureFileUploadedMiddleware from "./logic/middlewares/ensureFileUploaded.middleware";
import checkActiveSessionMiddleware from "./logic/middlewares/checkActiveSession.middleware";
import validateMappingJsonMiddleware from "./logic/middlewares/validateMappingJson.middleware";
import readStudentsFromExcelMiddlerware from "./logic/middlewares/readStudentsFromExcel.middleware";
import validateMappingAgainstExcelFileMiddleware from "./logic/middlewares/validateMappingAgainstExcelFile.middleware";
import validateMappingAgainstStudentModelMiddleware from "./logic/middlewares/validateMappingAgainstStudentModel.middleware";
import databaseLockMiddleware from "./logic/middlewares/databaseLock.middleware";

export default (router: Router) => {
  /**
   * Starts a new registration session if there isn't an active one.
   * The student affairs employee uploades an Excel file containing the students data.
   */
  router.post(
    "/start",
    checkRole([Role.EMPLOYEE, Role.ADMIN]),

    checkActiveSessionMiddleware(false),

    uploadFileMiddleware,
    ensureFileUploadedMiddleware,
    asyncHandler(ensureFileIsExcelMiddleware),

    asyncHandler(readStudentsFromExcelMiddlerware),

    asyncHandler(startSessionHandler)
  );

  /**
   * Updates the mapping from the uploaded students Excel file to the Student model.
   * The new mapping is validated against the Student model and the previously uploaded Excel file, then saved in the registration session.
   */
  router.patch(
    "/mapping",
    // Ensure user is authorized
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
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

    // Ensure user is authorized
    checkRole([Role.EMPLOYEE, Role.ADMIN]),

    // Check if there is an active registration session
    asyncHandler(checkActiveSessionMiddleware(true)),

    // Commit the staged students
    asyncHandler(commitHandler)
  );

  /**
   * Commits the staged students to the actual students collection.
   */
  router.post(
    "/precommit",

    databaseLockMiddleware("precommit"),

    // Ensure user is authorized
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    // Check if there is an active registration session
    checkActiveSessionMiddleware(true),
    asyncHandler(precommitHandler)
  );

  /**
   * Cancels the active registration session.
   */
  router.post(
    "/cancel",
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    checkActiveSessionMiddleware(true),
    asyncHandler(cancelRegistrationSessionHandler)
  );

  /**
   * Checks if there is an active registration session.
   */
  router.get(
    "/active",
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    checkActiveSessionMiddleware(true),
    asyncHandler(readActiveSessionHandler)
  );

  /**
   * Get staged students of the active registration session.
   */
  router.get(
    "/active/staged",
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    checkActiveSessionMiddleware(true),
    fetchPaginatedStagedStudentsHandler
  );

  /**
   * Get mapped students of the active registration session.
   */
  router.get(
    "/active/mapped",
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    checkActiveSessionMiddleware(true),
    readMappedStudentsHandler
  );
};
