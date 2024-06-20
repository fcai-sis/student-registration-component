import { Router } from "express";
import { asyncHandler } from "@fcai-sis/shared-utilities";
import { Role, checkRole } from "@fcai-sis/shared-middlewares";
import validateCreateStudentRequestMiddleware from "./logic/middlewares/validateCreateStudentRequest.middleware";
import createStudentHandler from "./logic/handlers/createStudent.handler";
import fetchPaginatedStudents from "./logic/handlers/readStudents.handler";
import ensureStudentIdInParamsMiddleware from "./logic/middlewares/ensureStudentIdInParams.middleware";
import deleteStudentHandler from "./logic/handlers/deleteStudent.handler";
import valiateUpdateStudentRequestMiddleware from "./logic/middlewares/updateStudentValidator.middleware";
import fetchMeHandler from "./logic/handlers/me.handler";
import updateStudentHandler from "./logic/handlers/updateStudent.handler";
import findStudentByStudentIdHandler from "./logic/handlers/findStudentByStudentId.handler";

const studentsRoutes = (router: Router) => {
  // Create student
  router.post(
    "/",
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    validateCreateStudentRequestMiddleware,
    asyncHandler(createStudentHandler)
  );

  // Read paginated students
  router.get(
    "/",
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    fetchPaginatedStudents
  );

  /*
   * Delete student
   **/
  router.delete(
    "/:studentId",
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    ensureStudentIdInParamsMiddleware,
    asyncHandler(deleteStudentHandler)
  );

  /*
   * Update student
   **/
  router.patch(
    "/:studentId",
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    ensureStudentIdInParamsMiddleware,
    valiateUpdateStudentRequestMiddleware,
    asyncHandler(updateStudentHandler)
  );

  router.get("/me", checkRole([Role.STUDENT]), asyncHandler(fetchMeHandler));

  /*
   * Find student by id
   **/
  router.get(
    "/:studentId",

    // Ensure student id in params
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    ensureStudentIdInParamsMiddleware,

    asyncHandler(findStudentByStudentIdHandler)
  );
};

export default studentsRoutes;
