import { NextFunction, Request, Response } from "express";

import logger from "../../../../core/logger";
import ExcelMapping from "../../data/types/mapping.type";
import { StudentModel } from "@fcai-sis/shared-models";
import HasStudentFields from "../../data/types/hasStudentFields.type";
import { getStudentKeys } from "../../../common/logic/utils/mapping.utils";
import { TokenPayload } from "@fcai-sis/shared-middlewares";

type MiddlewareRequest = Request<
  {},
  {},
  { mapping: ExcelMapping; user: TokenPayload }
>;

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

  const fieldsInMappingThatAreNotInStudentModel = mappingKeys.filter(
    (key) => !studentModelFields.includes(key)
  );

  if (fieldsInMappingThatAreNotInStudentModel.length > 0) {
    logger.error(
      `The following fields are not present in the Student model: ${fieldsInMappingThatAreNotInStudentModel.join(
        ", "
      )}`
    );
    return res.status(400).send({
      error: `The following fields are not present in the Student model: ${fieldsInMappingThatAreNotInStudentModel.join(
        ", "
      )}`,
    });
  }

  next();
};

export default middleware;
