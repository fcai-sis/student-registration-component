import { NextFunction, Request, Response } from "express";

import logger from "../../../../core/logger";
import ExcelMapping from "../../data/types/mapping.type";
import StudentModel from "../../data/models/student.model";
import HasStudentFields from "../../data/types/hasStudentFields.type";
import { getStudentKeys } from "../../../common/logic/utils/mapping.utils";

type MiddlewareRequest = Request<{}, {}, { mapping: ExcelMapping }>;

/**
 * Validates the mapping against the Student model, ensuring that all
 * Student model fields are present in the mapping.
 *
 * @returns `400 Bad Request` if there are missing or incorrect fields in the mapping
 */
const middleware = (
  req: MiddlewareRequest,
  res: Response,
  next: NextFunction
) => {
  // Get the mapping keys
  const mapping = req.body.mapping;
  const mappingKeys = getStudentKeys(mapping);

  const studentModelFields = getStudentKeys(
    StudentModel.schema.obj as HasStudentFields
  );

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
      error: {
        message: "Please provide a mapping for the fields in the Student model",
        missing: missingFields,
        incorrect: incorrectMappingFields,
      },
    });

    return;
  }

  next();
};

export default middleware;
