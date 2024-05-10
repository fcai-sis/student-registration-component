import * as validator from "express-validator";
import { NextFunction, Request, Response } from "express";

import logger from "../../../../core/logger";

/**
 * Validates the request body of the create student endpoint.
 */
const middlewares = [
  validator
    .body("studentId")
    .exists()
    .withMessage("studentId is required")
    .isString()
    .withMessage("studentId must be a string")
    .custom((value) => {
      // studentId must be only be digits
      const isValid = /^\d+$/.test(value);
      if (!isValid) {
        throw new Error("studentId must be only digits");
      }
      return true;
    }),

  validator
    .body("fullName")

    .exists()
    .withMessage("fullName is required")

    .isString()
    .withMessage("fullName must be a string")
    .custom((value) => {
      // name must contain only Arabic characters and allow whitespace
      const isValid = /^[\p{Script=Arabic}\s]+$/gmu.test(value);
      if (!isValid) {
        throw new Error("fullName must contain only Arabic characters");
      }
      return true;
    }),

  validator
    .body("groupCode")
    .exists()
    .withMessage("groupCode is required")
    .isBoolean()
    .withMessage("groupCode must be a boolean"),

  validator
    .body("gender")
    .exists()
    .withMessage("gender is required")
    .isIn(["male", "female", "other"])
    .withMessage(
      `gender must be one of the following: ${["male", "female", "other"].join(
        ", "
      )}`
    ),

  validator
    .body("religion")
    .exists()
    .withMessage("religion is required")
    .isIn(["muslim", "christian", "other"])
    .withMessage(
      `religion must be one of the following: ${[
        "muslim",
        "christian",
        "other",
      ].join(", ")}`
    ),

  validator
    .body("nationalId")
    .exists()
    .withMessage("nationalId is required")
    .isString()
    .withMessage("nationalId must be a string")
    .custom((value) => {
      // nationalId must be 14 digits
      const isValid = /^\d{14}$/.test(value);
      if (!isValid) {
        throw new Error("nationalId must be 14 digits");
      }
      return true;
    }),

  validator
    .body("administration")
    .exists()
    .withMessage("administration is required")
    .isString()
    .withMessage("administration must be a string")
    .custom((value) => {
      // administration must contain only Arabic characters and allow whitespace
      const isValid = /^[\p{Script=Arabic}\s]+$/gmu.test(value);
      if (!isValid) {
        throw new Error("administration must contain only Arabic characters");
      }
      return true;
    }),

  validator
    .body("directorate")
    .exists()
    .withMessage("directorate is required")
    .isString()
    .withMessage("directorate must be a string")
    .custom((value) => {
      // directorate must contain only Arabic characters and allow whitespace
      const isValid = /^[\p{Script=Arabic}\s]+$/gmu.test(value);
      if (!isValid) {
        throw new Error("directorate must contain only Arabic characters");
      }
      return true;
    }),

  validator
    .body("phoneNumber")
    .exists()
    .withMessage("phoneNumber is required")
    .isString()
    .withMessage("phoneNumber must be a string")
    .custom((value) => {
      // phoneNumber must be 11 digits
      const isValid = /^\d{11}$/.test(value);
      if (!isValid) {
        throw new Error("phoneNumber must be 11 digits");
      }
      return true;
    }),

  validator
    .body("educationType")
    .exists()
    .withMessage("educationType is required")
    .isString()
    .withMessage("educationType must be a string")
    .custom((value) => {
      // educationType must contain only Arabic characters and allow whitespace
      const isValid = /^[\p{Script=Arabic}\s]+$/gmu.test(value);
      if (!isValid) {
        throw new Error("directorate must contain only Arabic characters");
      }
      return true;
    }),

  validator
    .body("birthYear")
    .exists()
    .withMessage("birthYear is required")
    .isNumeric()
    .withMessage("birthYear must be a number")
    .custom((value) => {
      // birthYear must be 4 digits
      const isValid = /^\d{4}$/.test(value);
      if (!isValid) {
        throw new Error("birthYear must be 4 digits");
      }
      return true;
    }),

  validator
    .body("birthMonth")
    .exists()
    .withMessage("birthMonth is required")
    .isNumeric()
    .withMessage("birthMonth must be a number")
    .custom((value) => {
      // birthMonth must be 2 digits and between 1 and 12
      const isValid =
        /^\d{2}$/.test(value) && parseInt(value) >= 1 && parseInt(value) <= 12;
      if (!isValid) {
        throw new Error("birthMonth must be 2 digits");
      }
      return true;
    }),

  validator
    .body("birthDay")
    .exists()
    .withMessage("birthDay is required")
    .isNumeric()
    .withMessage("birthDay must be a number")
    .custom((value) => {
      // birthDay must be 2 digits and between 1 and 31
      const isValid =
        /^\d{2}$/.test(value) && parseInt(value) >= 1 && parseInt(value) <= 31;
      if (!isValid) {
        throw new Error("birthDay must be 2 digits");
      }
      return true;
    }),

  validator
    .body("birthPlace")
    .exists()
    .withMessage("birthPlace is required")
    .isString()
    .withMessage("birthPlace must be a string")
    .custom((value) => {
      // birthPlace must contain only Arabic characters and allow whitespace
      const isValid = /^[\p{Script=Arabic}\s]+$/gmu.test(value);
      if (!isValid) {
        throw new Error("birthPlace must contain only Arabic characters");
      }
      return true;
    }),

  validator
    .body("governorateId")
    .exists()
    .withMessage("governorateId is required")
    .isNumeric()
    .withMessage("governorateId must be a number"),

  validator
    .body("nationality")
    .exists()
    .withMessage("nationality is required")
    .isString()
    .withMessage("nationality must be a string")
    .isIn(["egyptian", "foreigner"])
    .withMessage(
      `nationality must be one of the following: ${[
        "egyptian",
        "foreigner",
      ].join(", ")}`
    ),

  validator
    .body("address")
    .exists()
    .withMessage("address is required")
    .isString()
    .withMessage("address must be a string")
    .custom((value) => {
      // make sure it's not empty and not just whitespace
      const isValid = value.trim().length > 0;
      if (!isValid) {
        throw new Error("address must not be empty");
      }
      return true;
    }),

  (req: Request, res: Response, next: NextFunction) => {
    logger.debug(
      `Validating create student req body: ${JSON.stringify(req.body)}`
    );

    // If any of the validations above failed, return an error response
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      logger.debug(
        `Validation failed for create student req body: ${JSON.stringify(
          req.body
        )}`
      );

      return res.status(400).json({
        error: {
          message: errors.array()[0].msg,
        },
      });
    }

    // Attach the validated data to the request body
    req.body.studentId = req.body.studentId.trim();
    req.body.fullName = req.body.fullName.trim();
    req.body.groupCode = req.body.groupCode;
    req.body.gender = req.body.gender.trim();
    req.body.religion = req.body.religion.trim();
    req.body.nationalId = req.body.nationalId.trim();
    req.body.administration = req.body.administration.trim();
    req.body.directorate = req.body.directorate.trim();
    req.body.phoneNumber = req.body.phoneNumber.trim();
    req.body.educationType = req.body.educationType.trim();
    req.body.birthYear = req.body.birthYear;
    req.body.birthMonth = req.body.birthMonth;
    req.body.birthDay = req.body.birthDay;
    req.body.birthPlace = req.body.birthPlace.trim();
    req.body.governorateId = req.body.governorateId;
    req.body.nationality = req.body.nationality.trim();
    req.body.address = req.body.address.trim();
    next();
  },
];

const validateCreateStudentRequestBodyMiddleware = middlewares;
export default validateCreateStudentRequestBodyMiddleware;
