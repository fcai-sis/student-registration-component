import * as validator from "express-validator";
import { NextFunction, Request, Response } from "express";

/**
 * Validates the `mapping` field in the request body.
 *
 * Because this endpoint uses form data (to be able to upload the Excel file), the `mapping` field is a stringified JSON.
 * This middleware parses the JSON and attaches it to the request body for the next middlewares to use.
 */
export default [
  validator
    // Get the `mapping` field from the request body (which is a stringified JSON)
    .body("mapping")

    // Ensure that the `mapping` field exists
    .exists()
    .withMessage("mapping-missing")

    // Ensure that the `mapping` field is a valid JSON (apparently stringified JSON is valid JSON)
    .isJSON()
    .withMessage("mapping-not-valid-json"),

  (req: Request, res: Response, next: NextFunction) => {
    // If any of the validations above failed, return an error response
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({
        error: errors.mapped().mapping.msg,
        message: "Please provide a valid mapping",
      });
      return;
    }

    // If all is good, attach the mapping to the request for the next middlewares to use
    req.body.mapping = JSON.parse(req.body.mapping);

    next();
  },
];
