import * as validator from "express-validator";
import { NextFunction, Request, Response } from "express";

import logger from "../../../../core/logger";

/**
 * Validates the request body of the create student endpoint.
 */
const middlewares = [
  validator
    .body("fullName")

    .exists()
    .withMessage("fullName is required")

    .isString()
    .withMessage("fullName must be a string")
    .custom((value) => {
      // name must contain only Arabic characters and allow whitespace
      if (value.match(/[^أ-ي\s]/i)) {
        throw new Error("Full name must contain only Arabic letters (أ - ي)");
      }
      return true;
    }),

  validator
    .body("address")

    .exists()
    .withMessage("address is required")

    .isString()
    .withMessage("address must be a string")

    .custom((value) => {
      // address must contain only letters, numbers and Arabic characters and allow whitespace
      if (value.match(/[^a-z0-9أ-ي\s]/i)) {
        throw new Error("Address must contain only letters, numbers and Arabic characters");
      }
      return true;
    }),

  validator
    .body("status")

    .exists()
    .withMessage("status is required")

    .isIn(["active", "pending", "inactive"])
    .withMessage(
      `status must be one of the following: ${["active", "pending", "inactive"].join(
        ", "
      )}`
    ),

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
    req.body.fullName = req.body.fullName.trim();
    req.body.address = req.body.address.trim();
    req.body.status = req.body.status;

    next();
  },
];

const validateCreateStudentRequestBodyMiddleware = middlewares;
export default validateCreateStudentRequestBodyMiddleware;
