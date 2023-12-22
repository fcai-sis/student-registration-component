import { Request, Response, NextFunction } from "express";

import ExcelMapping from "../../data/types/mapping.type.js";
import { getStudentKeys } from "../../../common/logic/utils/mapping.utils.js";
import RegistrationSessionModel from "../../data/models/registrationSession.model.js";

type MiddlewareRequest = Request<{}, {}, { mapping: { [K: string]: any } }>;

/**
 * Validates the mapping against the uploaded excel file, ensuring that
 * all values of keys in the mapping are present in the excel file.
 *
 * @returns `400 Bad Request` if there are any fields in the mapping that do not exist in the excel file
 */
const middlware = async (
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

  const mappingKeys = getStudentKeys(mapping as unknown as ExcelMapping);

  // Get all mapping keys that do not exist in the excel file
  const incorrectMappingKeys = mappingKeys.filter(
    (key) => !excelColumnsHeaders.includes(mapping[key])
  );

  // If there are any incorrect mappings, return an error
  if (incorrectMappingKeys.length > 0) {
    res.status(400).json({
      code: "mapping-invalid-excel-fields",
      message:
        "Please make sure all fields are mapped to the correct fields in the excel file",
      fields: incorrectMappingKeys.map((key) => mapping[key]),
      availableFields: excelColumnsHeaders, // TODO: Remove this since it's probably HUGE and useless
    });
    return;
  }

  next();
};

export default middlware;
