import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

import logger from "../../../../core/logger";

const updateStudentValidator = [
  body("fullName")
    .optional()
    .isString()
    .withMessage("fullName must be a string")
    .custom((value) => {
      // name must contain only Arabic characters and allow whitespace
      if (value.match(/[^أ-ي\s]/i)) {
        throw new Error("Full name must contain only Arabic letters (أ - ي)");
      }
      return true;
    }),

  body("address")
    .optional()
    .isString()
    .withMessage("Content must be a string")
    .custom((value) => {
      // address must contain only letters, numbers and Arabic characters and allow whitespace
      if (value.match(/[^a-z0-9أ-ي\s]/i)) {
        throw new Error("Address must contain only letters, numbers and Arabic characters");
      }
      return true;
    }),

  body("status")
    .optional()
    .isIn(["active", "pending", "inactive"])
    .withMessage(
      `Severity must be one of these values: ${["active", "pending", "inactive"].join(
        ", "
      )}`
    ),

  (req: Request, res: Response, next: NextFunction) => {
    logger.debug(
      `Validating update student req body: ${JSON.stringify(req.body)}`
    );

    // if the request body contains any field other than "fullName", "address", "status", return an error
    const allowedFields = ["fullName", "address", "status"];
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
    if (req.body.address) req.body.address = req.body.address.trim();
    if (req.body.status) req.body.status = req.body.status;

    next();
  },
];

export default updateStudentValidator;
