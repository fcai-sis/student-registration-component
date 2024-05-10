import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import {
  Role,
  checkRole,
  paginationQueryParamsMiddleware,
} from "@fcai-sis/shared-middlewares";
import validateCreateStudentRequestBodyMiddleware from "./logic/middlewares/validateCreateStudentRequestBody.middleware";
import createStudentHandler from "./logic/handlers/createStudent.handler";
import readStudentsHandler from "./logic/handlers/readStudents.handler";
import ensureStudentIdInParamsMiddleware from "./logic/middlewares/ensureStudentIdInParams.middleware";
import deleteStudentHandler from "./logic/handlers/deleteStudent.handler";
import updateStudentValidator from "./logic/middlewares/updateStudentValidator.middleware";
import findStudentByIdHandler from "./logic/handlers/findStudentById.handler";
import countStudentCollectionHandler from "./logic/handlers/countStudents.handler";
import meHandler from "./logic/handlers/me.handler";
import updateStudentHandler from "./logic/handlers/updateStudent.handler";

const studentsRoutes = (router: Router) => {
  /*
   * Create student
   **/
  router.post(
    "/create",

    // Validate request body
    // validateCreateStudentRequestBodyMiddleware,

    asyncHandler(createStudentHandler)
  );

  /*
   * Read paginated students
   **/
  router.get(
    "/read",

    // Validate request query params for pagination
    paginationQueryParamsMiddleware,

    asyncHandler(readStudentsHandler)
  );

  /*
   * Count all students
   **/
  router.get(
    "/count",

    asyncHandler(countStudentCollectionHandler)
  );

  /*
   * Delete student
   **/
  router.delete(
    "/delete/:studentId",

    // Ensure student id in params
    ensureStudentIdInParamsMiddleware,

    asyncHandler(deleteStudentHandler)
  );

  /*
   * Update student
   **/
  router.patch(
    "/update/:studentId",

    // Ensure announcement id in params
    ensureStudentIdInParamsMiddleware,

    // Validate request body
    // updateStudentValidator,

    asyncHandler(updateStudentHandler)
  );

  /*
   * Find student by id
   **/
  router.get(
    "/find/:studentId",

    // Ensure student id in params
    // checkRole([Role.ADMIN]),
    ensureStudentIdInParamsMiddleware,

    asyncHandler(findStudentByIdHandler)
  );

  router.get(
    "/me",

    checkRole([Role.STUDENT]),

    asyncHandler(meHandler)
  );
};

export default studentsRoutes;
