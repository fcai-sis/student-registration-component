import { Router } from "express";
import { asyncHandler } from "@fcai-sis/shared-utilities";
import { Role, checkRole } from "@fcai-sis/shared-middlewares";
import validateCreateStudentRequestMiddleware from "./logic/middlewares/validateCreateStudentRequest.middleware";
import createStudentHandler from "./logic/handlers/createStudent.handler";
import fetchPaginatedStudents from "./logic/handlers/readStudents.handler";
import ensureStudentIdInParamsMiddleware from "./logic/middlewares/ensureStudentIdInParams.middleware";
import deleteStudentHandler from "./logic/handlers/deleteStudent.handler";
import valiateUpdateStudentRequestMiddleware from "./logic/middlewares/updateStudentValidator.middleware";
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
    validateCreateStudentRequestMiddleware,
    asyncHandler(createStudentHandler)
  );

  /*
   * Read paginated students
   **/
  router.get(
    "/read",
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    fetchPaginatedStudents
  );

  /*
   * Delete student
   **/
  router.delete(
    "/delete/:studentId",
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    ensureStudentIdInParamsMiddleware,
    asyncHandler(deleteStudentHandler)
  );

  /*
   * Update student
   **/
  router.patch(
    "/update/:studentId",
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    ensureStudentIdInParamsMiddleware,
    valiateUpdateStudentRequestMiddleware,
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
