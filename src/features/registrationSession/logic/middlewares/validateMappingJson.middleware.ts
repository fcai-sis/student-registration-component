import * as validator from "express-validator";
import { NextFunction, Request, Response } from "express";

import logger from "../../../../core/logger";

/**
 * Ensures that the `mapping` field exists in the request body and is a valid JSON.
 */
const middlewares = [
  validator
    // Get the `mapping` field from the request body (which is a stringified JSON)
    .body("mapping")

    // Ensure that the `mapping` field exists
    .exists()
    .withMessage("Mapping is required")

    // Ensure that the `mapping` field is a valid JSON
    .isObject()
    .withMessage("Mapping must be a valid JSON"),

  (req: Request, res: Response, next: NextFunction) => {
    logger.debug(`Validating mapping: ${JSON.stringify(req.body.mapping)}`);

    // If any of the validations above failed, return an error response
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      logger.debug(
        `Invalid mapping provided ${JSON.stringify(errors.mapped())}`
      );
      res.status(400).json({
        error: {
          message: errors.array()[0].msg,
        },
      });
      return;
    }

    logger.debug(`Valid mapping provided: ${JSON.stringify(req.body.mapping)}`);

    next();
  },
];

export default middlewares;
