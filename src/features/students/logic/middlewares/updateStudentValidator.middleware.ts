import * as validator from "express-validator";
import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import {
  GenderEnum,
  NationalityEnum,
  ReligionEnum,
  ScientificDivisionEnum,
} from "@fcai-sis/shared-models";

/**
 * Validates the request body of the create student endpoint.
 */
const validateCreateStudentRequestMiddleware = [
  validator
    .body("fullName")

    .optional()

    .isString()
    .withMessage("fullName must be a string"),

  validator
    .body("scientificDivision")

    .optional()

    .isString()
    .withMessage("scientificDivision must be a string")

    .isIn(ScientificDivisionEnum)
    .withMessage(
      `scientificDivision must be one of the following: ${ScientificDivisionEnum.join(
        ", "
      )}`
    ),

  validator
    .body("gender")

    .optional()

    .isString()
    .withMessage("gender must be a string")

    .isIn(GenderEnum)
    .withMessage(
      `gender must be one of the following: ${GenderEnum.join(", ")}`
    ),

  validator
    .body("religion")

    .optional()

    .isString()
    .withMessage("religion must be a string")

    .isIn(ReligionEnum)
    .withMessage(
      `religion must be one of the following: ${ReligionEnum.join(", ")}`
    ),

  validator
    .body("nationalId")

    .optional()

    .isString()
    .withMessage("nationalId must be a string"),

  validator
    .body("administration")

    .optional()

    .isString()
    .withMessage("administration must be a string"),

  validator
    .body("directorate")

    .optional()

    .isString()
    .withMessage("directorate must be a string"),

  validator
    .body("phoneNumber")

    .optional()

    .isString()
    .withMessage("phoneNumber must be a string"),

  validator
    .body("educationType")

    .optional()

    .isString()
    .withMessage("educationType must be a string"),

  validator
    .body("birthYear")

    .optional()

    .isInt()
    .withMessage("birthYear must be an integer"),

  validator
    .body("birthMonth")

    .optional()

    .isInt()
    .withMessage("birthMonth must be an integer"),

  validator
    .body("birthDay")

    .optional()

    .isNumeric()
    .withMessage("birthDay must be an integer"),

  validator
    .body("birthPlace")

    .optional()

    .isString()
    .withMessage("birthPlace must be a string"),

  validator
    .body("governorateId")

    .optional()

    .isInt()
    .withMessage("governorateId must be an integer"),

  validator
    .body("nationality")

    .optional()

    .isString()
    .withMessage("nationality must be a string")

    .isIn(NationalityEnum)
    .withMessage(
      `nationality must be one of the following: ${NationalityEnum.join(", ")}`
    ),

  validator
    .body("address")

    .optional()

    .isString()
    .withMessage("address must be a string"),

  validateRequestMiddleware,
];

export default validateCreateStudentRequestMiddleware;
