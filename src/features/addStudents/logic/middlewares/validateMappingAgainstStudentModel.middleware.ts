import { NextFunction, Request, Response } from "express";

import StudentModel from "../../data/student.model.js";

/**
 * Validates the `mapping` field against the Student model, ensuring that all
 * Student model fields are present in the `mapping` field.
 */
export default (req: Request, res: Response, next: NextFunction) => {
  const mapping = req.body.mapping;
  const mappingKeys = Object.keys(mapping);

  const studentModelFields = Object.keys(StudentModel.schema.obj);

  // Get all student model fields that are missing from the mapping
  const missingFields = studentModelFields.filter(
    (field) => !mappingKeys.includes(field)
  );

  // Get all mapping fields that are not in the student model
  const incorrectMappingFields = mappingKeys.filter(
    (field) => !studentModelFields.includes(field)
  );

  // If there are missing fields, return an error
  if (missingFields.length > 0) {
    res.status(400).json({
      error: "mapping-missing-fields",
      message: "Please provide a mapping for the fields in the Student model",
      missing: missingFields,
      incorrect: incorrectMappingFields,
    });
    return;
  }

  next();
};
