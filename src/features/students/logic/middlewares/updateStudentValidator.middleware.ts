import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

import logger from "../../../../core/logger";

const updateStudentValidatorMiddleware = [
  body("fullName")
    .optional()

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

  body("groupCode")
    .optional()

    .isBoolean()
    .withMessage("groupCode must be a boolean"),

  body("gender")
    .optional()

    .isIn(["male", "female", "other"])
    .withMessage(
      `gender must be one of the following: ${["male", "female", "other"].join(
        ", "
      )}`
    ),

  body("religion")
    .optional()

    .isIn(["muslim", "christian", "other"])
    .withMessage(
      `religion must be one of the following: ${[
        "muslim",
        "christian",
        "other",
      ].join(", ")}`
    ),

  body("nationalId")
    .optional()

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

  body("administration")
    .optional()

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

  body("directorate")
    .optional()

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

  body("phoneNumber")
    .optional()

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

  body("educationType")
    .optional()

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

  body("birthYear")
    .optional()

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

  body("birthMonth")
    .optional()

    .isNumeric()
    .withMessage("birthMonth must be a number")
    .custom((value) => {
      // birthMonth must be at most 2 digits and between 1 and 12
      const isValid =
        /^\d{1,2}$/.test(value) &&
        parseInt(value) >= 1 &&
        parseInt(value) <= 12;
      if (!isValid) {
        throw new Error(
          "birthMonth must be at most 2 digits, between 1 and 12"
        );
      }
      return true;
    }),

  body("birthDay")
    .optional()

    .isNumeric()
    .withMessage("birthDay must be a number")
    .custom((value) => {
      // birthDay must be at most 2 digits and between 1 and 31
      const isValid =
        /^\d{1,2}$/.test(value) &&
        parseInt(value) >= 1 &&
        parseInt(value) <= 31;
      if (!isValid) {
        throw new Error("birthDay must be at most 2 digits, between 1 and 31");
      }
      return true;
    }),

  body("birthPlace")
    .optional()

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

  body("governorateId")
    .optional()

    .isNumeric()
    .withMessage("governorateId must be a number"),

  body("nationality")
    .optional()

    .isString()
    .withMessage("nationality must be a string")
    .isIn(["egyptian", "foreigner"])
    .withMessage(
      `nationality must be one of the following: ${[
        "egyptian",
        "foreigner",
      ].join(", ")}`
    ),

  body("address")
    .optional()

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
      `Validating update student req body: ${JSON.stringify(req.body)}`
    );

    // if the request body contains any field other than the below fields, return an error
    const allowedFields = [
      "fullName",
      "groupCode",
      "gender",
      "religion",
      "nationalId",
      "administration",
      "directorate",
      "phoneNumber",
      "educationType",
      "birthYear",
      "birthMonth",
      "birthDay",
      "birthPlace",
      "governorateId",
      "nationality",
      "address",
      "user",
    ];
    const receivedFields = Object.keys(req.body);
    const invalidFields = receivedFields.filter(
      (field) => !allowedFields.includes(field)
    );
    if (invalidFields.length > 0) {
      logger.debug(
        `Invalid req body provided ${JSON.stringify(invalidFields)}`
      );
      return res.status(400).json({
        error: {
          message: `Invalid fields provided: ${invalidFields}`,
        },
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.debug(
        `Invalid req body provided ${JSON.stringify(errors.array())}`
      );
      return res.status(400).json({
        error: {
          message: errors.array()[0].msg,
        },
      });
    }

    if (req.body.fullName) req.body.fullName = req.body.fullName.trim();
    if (req.body.groupCode) req.body.groupCode = req.body.groupCode;
    if (req.body.gender) req.body.gender = req.body.gender.trim();
    if (req.body.religion) req.body.religion = req.body.religion.trim();
    if (req.body.nationalId) req.body.nationalId = req.body.nationalId.trim();
    if (req.body.administration)
      req.body.administration = req.body.administration.trim();
    if (req.body.directorate)
      req.body.directorate = req.body.directorate.trim();
    if (req.body.phoneNumber)
      req.body.phoneNumber = req.body.phoneNumber.trim();
    if (req.body.educationType)
      req.body.educationType = req.body.educationType.trim();
    if (req.body.birthYear) req.body.birthYear = req.body.birthYear;
    if (req.body.birthMonth) req.body.birthMonth = req.body.birthMonth;
    if (req.body.birthDay) req.body.birthDay = req.body.birthDay;
    if (req.body.birthPlace) req.body.birthPlace = req.body.birthPlace.trim();
    if (req.body.governorateId) req.body.governorateId = req.body.governorateId;
    if (req.body.nationality)
      req.body.nationality = req.body.nationality.trim();
    if (req.body.address) req.body.address = req.body.address.trim();

    next();
  },
];

export default updateStudentValidatorMiddleware;
