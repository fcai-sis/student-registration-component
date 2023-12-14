import * as validator from "express-validator";
import { NextFunction, Request, Response } from "express";

export default [
  validator
    .body("mapping")
    .exists()
    .withMessage("mapping-missing")
    .isJSON()
    .withMessage("mapping-not-valid-json"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({
        error: errors.mapped().mapping.msg,
        message: "Please provide a valid mapping",
      });
      return;
    }

    req.body.mapping = JSON.parse(req.body.mapping);

    next();
  },
];
