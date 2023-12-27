import * as validator from "express-validator";
import { NextFunction, Request, Response } from "express";

import logger from "../../../../core/logger";

/**
 * Ensures that the request query parameters `page` and `pageSize` exists and are valid.
 * Also attaches the query parameters to the request body.
 *
 * @returns `400 Bad Request` if the query parameters are missing or invalid
 */
const middlewares = [
  validator
    // Get the `page` query parameter
    .query("page")

    // Ensure that the `page` query parameter exists
    .exists()
    .withMessage(1)

    // Ensure that the `page` query parameter is an integer
    .isInt({ min: 1 })
    .withMessage(2),

  validator
    // Get the `pageSize` query parameter
    .query("pageSize")

    // Ensure that the `pageSize` query parameter exists
    .exists()
    .withMessage(3)

    // Ensure that the `pageSize` query parameter is an integer
    .isInt({ min: 1 })
    .withMessage(4),

  (req: Request, res: Response, next: NextFunction) => {
    logger.debug(
      `Validating pagination query params: ${JSON.stringify(req.query)}`
    );

    // If any of the validations above failed, return an error response
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      logger.debug(
        `Invalid pagination query params provided ${JSON.stringify(
          errors.mapped()
        )}`
      );
      res.status(400).json(
        errors.array()[0].msg === 1
          ? {
              code: "page-missing",
              message: "Please provide a page number",
            }
          : errors.array()[0].msg === 2
          ? {
              code: "page-invalid",
              message: "Please provide a valid page number",
            }
          : errors.array()[0].msg === 3
          ? {
              code: "pageSize-missing",
              message: "Please provide a page size",
            }
          : {
              code: "pageSize-invalid",
              message: "Please provide a valid page size",
            }
      );
      return;
    }

    logger.debug(
      `Valid pagination query params provided: ${JSON.stringify(req.query)}`
    );

    // Attach the pagination query params to the request body
    req.body.page = parseInt(req.query.page as string);
    req.body.pageSize = parseInt(req.query.pageSize as string);

    next();
  },
];

export default middlewares;
