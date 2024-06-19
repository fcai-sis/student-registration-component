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
    .body("student.studentId")

    .exists()
    .withMessage("studentId is required")

    .isString()
    .withMessage("studentId must be a string"),

  validator
    .body("student.fullName")

    .exists()
    .withMessage("fullName is required")

    .isString()
    .withMessage("fullName must be a string"),

  validator
    .body("student.scientificDivision")

    .exists()
    .withMessage("scientificDivision is required")

    .isString()
    .withMessage("scientificDivision must be a string")

    .isIn(ScientificDivisionEnum)
    .withMessage(
      `scientificDivision must be one of the following: ${ScientificDivisionEnum.join(
        ", "
      )}`
    ),

  validator
    .body("student.gender")

    .exists()
    .withMessage("gender is required")

    .isString()
    .withMessage("gender must be a string")

    .isIn(GenderEnum)
    .withMessage(
      `gender must be one of the following: ${GenderEnum.join(", ")}`
    ),

  validator
    .body("student.religion")

    .exists()
    .withMessage("religion is required")

    .isString()
    .withMessage("religion must be a string")

    .isIn(ReligionEnum)
    .withMessage(
      `religion must be one of the following: ${ReligionEnum.join(", ")}`
    ),

  validator
    .body("student.nationalId")

    .exists()
    .withMessage("nationalId is required")

    .isString()
    .withMessage("nationalId must be a string"),

  validator
    .body("student.administration")

    .exists()
    .withMessage("administration is required")

    .isString()
    .withMessage("administration must be a string"),

  validator
    .body("student.directorate")

    .exists()
    .withMessage("directorate is required")

    .isString()
    .withMessage("directorate must be a string"),

  validator
    .body("student.phoneNumber")

    .exists()
    .withMessage("phoneNumber is required")

    .isString()
    .withMessage("phoneNumber must be a string"),

  validator
    .body("student.educationType")

    .exists()
    .withMessage("educationType is required")

    .isString()
    .withMessage("educationType must be a string"),

  validator
    .body("student.birthYear")

    .exists()
    .withMessage("birthYear is required")

    .isInt()
    .withMessage("birthYear must be an integer"),

  validator
    .body("student.birthMonth")

    .exists()
    .withMessage("birthMonth is required")

    .isInt()
    .withMessage("birthMonth must be an integer"),

  validator
    .body("student.birthDay")

    .exists()
    .withMessage("birthDay is required")

    .isNumeric()
    .withMessage("birthDay must be an integer"),

  validator
    .body("student.birthPlace")

    .exists()
    .withMessage("birthPlace is required")

    .isString()
    .withMessage("birthPlace must be a string"),

  validator
    .body("student.governorateId")

    .exists()
    .withMessage("governorateId is required")

    .isInt()
    .withMessage("governorateId must be an integer"),

  validator
    .body("student.nationality")

    .exists()
    .withMessage("nationality is required")

    .isString()
    .withMessage("nationality must be a string")

    .isIn(NationalityEnum)
    .withMessage(
      `nationality must be one of the following: ${NationalityEnum.join(", ")}`
    ),

  validator
    .body("student.address")

    .exists()
    .withMessage("address is required")

    .isString()
    .withMessage("address must be a string"),

  validateRequestMiddleware,
];

export default validateCreateStudentRequestMiddleware;
