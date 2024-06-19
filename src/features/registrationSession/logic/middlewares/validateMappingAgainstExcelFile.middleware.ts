import { Request, Response, NextFunction } from "express";

import ExcelMapping from "../../data/types/mapping.type";
import { getMappedStudentKeys } from "../../../common/logic/utils/mapping.utils";
import RegistrationSessionModel from "../../data/models/registrationSession.model";

type MiddlewareRequest = Request<{}, {}, { mapping: { [K: string]: any } }>;

/**
 * Validates the mapping against the uploaded excel file, ensuring that
 * all values of keys in the mapping are present in the excel file.
 *
 * @returns `400 Bad Request` if there are any fields in the mapping that do not exist in the excel file
 */
const middleware = async (
  req: MiddlewareRequest,
  res: Response,
  next: NextFunction
) => {
  // Get the current active registration session
  const currentActiveSession = await RegistrationSessionModel.findOne({
    active: true,
  });

  const mapping = req.body.mapping;
  const excelColumnsHeaders = currentActiveSession!.excelColumnsHeaders;

  const mappingKeys = getMappedStudentKeys(mapping as unknown as ExcelMapping);

  const valuesInMappingThatAreNotInExcelColumns = mappingKeys.filter(
    (key) => !excelColumnsHeaders.includes(mapping[key])
  );

  if (valuesInMappingThatAreNotInExcelColumns.length > 0) {
    return res.status(400).send({
      error: {
        message: "Some field values are not present in the excel file",
        fields: valuesInMappingThatAreNotInExcelColumns,
      },
    });
  }

  next();
};

export default middleware;
