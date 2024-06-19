import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import * as validator from "express-validator";

const ensureStudentIdInParamsMiddleware = [
  validator
    .param("studentId")

    .exists()
    .withMessage("Student ID is required")

    .isString()
    .withMessage("Student ID must be a string"),

  validateRequestMiddleware,
];

export default ensureStudentIdInParamsMiddleware;
