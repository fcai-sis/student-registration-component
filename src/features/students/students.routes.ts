import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import { paginationQueryParamsMiddleware } from "@fcai-sis/shared-middlewares";
import validateCreateStudentRequestBodyMiddleware from "./logic/middlewares/validateCreateStudentRequestBody.middleware";
import createStudentHandler from "./logic/handlers/createStudent.handler";
import readStudentsHandler from "./logic/handlers/readStudents.handler";
import ensureStudentIdInParamsMiddleware from "./logic/middlewares/ensureStudentIdInParams.middleware";
import deleteStudentHandler from "./logic/handlers/deleteStudent.handler";
import updateStudentValidator from "./logic/middlewares/updateStudentValidator.middleware";
import updateStudentHandler from "./logic/handlers/updateStudent.handler";
import findStudentById from "./logic/handlers/FindStudentById.handler";


export default (router: Router) => {
  /*
   * Create student
   **/
  router.post(
    "/student/create",

    // Validate request body
    validateCreateStudentRequestBodyMiddleware,

    asyncHandler(createStudentHandler)
  );

  /*
   * Read paginated students
   **/
  router.get(
    "/student/read",

    // Validate request query params for pagination
    paginationQueryParamsMiddleware,

    asyncHandler(readStudentsHandler)
  );

  /*
   * Delete student
   **/
  router.delete(
    "/student/delete/:studentId",

    // Ensure student id in params
    ensureStudentIdInParamsMiddleware,

    asyncHandler(deleteStudentHandler)
  );

  /*
   * Update student
   **/
  router.patch(
    "/student/update/:studentId",

    // Ensure announcement id in params
    ensureStudentIdInParamsMiddleware,

    // Validate request body
    updateStudentValidator,

    asyncHandler(updateStudentHandler)
  );

  /*
   * Find student by id
   **/
  router.get(
    "/student/find/:studentId",

    // Ensure student id in params
    ensureStudentIdInParamsMiddleware,

    asyncHandler(findStudentById)
  );

};
