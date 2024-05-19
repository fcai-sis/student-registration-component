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
import updateStudentValidatorMiddleware from "./logic/middlewares/updateStudentValidator.middleware";
import countStudentCollectionHandler from "./logic/handlers/countStudents.handler";
import meHandler from "./logic/handlers/me.handler";
import updateStudentHandler from "./logic/handlers/updateStudent.handler";
import findStudentByStudentIdHandler from "./logic/handlers/findStudentByStudentId.handler";

const studentsRoutes = (router: Router) => {
  /*
   * Create student
   **/
  router.post(
    "/create",

    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    // Validate request body
    validateCreateStudentRequestBodyMiddleware,

    asyncHandler(createStudentHandler)
  );

  /*
   * Read paginated students
   **/
  router.get(
    "/read",
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    // Validate request query params for pagination
    paginationQueryParamsMiddleware,

    asyncHandler(readStudentsHandler)
  );

  /*
   * Count all students
   **/
  router.get(
    "/count",
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    asyncHandler(countStudentCollectionHandler)
  );

  /*
   * Delete student
   **/
  router.delete(
    "/delete/:studentId",
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    // Ensure student id in params
    ensureStudentIdInParamsMiddleware,

    asyncHandler(deleteStudentHandler)
  );

  /*
   * Update student
   **/
  router.patch(
    "/update/:studentId",

    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    // Ensure announcement id in params
    ensureStudentIdInParamsMiddleware,

    // Validate request body
    updateStudentValidatorMiddleware,

    asyncHandler(updateStudentHandler)
  );

  /*
   * Find student by id
   **/
  router.get(
    "/find/:studentId",

    // Ensure student id in params
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    ensureStudentIdInParamsMiddleware,

    asyncHandler(findStudentByStudentIdHandler)
  );

  router.get(
    "/me",

    (req, res, next) => {
      console.log(`COOKIES: ${JSON.stringify(req.cookies)}`);
      console.log(`SIGNED COOKIES: ${JSON.stringify(req.signedCookies)}`);
      next();
    },

    checkRole([Role.STUDENT]),

    asyncHandler(meHandler)
  );
};

export default studentsRoutes;
