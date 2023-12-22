import { Request, Response } from "express";

import logger from "../../../../core/logger.js";
import ExcelRow from "../../data/types/excelRow.type.js";
import ExcelMapping from "../../data/types/mapping.type.js";
import StudentModel from "../../data/models/student.model.js";
import unsetMapping from "../../data/types/unsetMapping.type.js";
import HasStudentFields from "../../data/types/hasStudentFields.type.js";
import { getStudentKeys } from "../../../common/logic/utils/mapping.utils.js";
import RegistrationSessionModel from "../../data/models/registrationSession.model.js";

type HandlerRequest = Request<
  {},
  {},
  { students: ExcelRow[]; excelColumnsHeaders: string[] }
>;

/**
 * Creates a new registration session and stages the students read from the uploaded excel file.
 *
 * The Excel columns headers are also saved in the session, along with an empty mapping that the employee can modify later.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const students = req.body.students;
  const excelColumnsHeaders = req.body.excelColumnsHeaders;

  // Create a new registration session with the staged students, excel columns headers and an empty mapping
  const result = await RegistrationSessionModel.create({
    stagedStudents: students,
    excelColumnsHeaders: excelColumnsHeaders,

    // If we are to have a default mapping, we can set it here instead of an empty mapping
    mapping: getStudentKeys(StudentModel.schema.obj as HasStudentFields).reduce(
      // Loop through all keys in the mapping
      (mapping, key) => {
        mapping[key] = unsetMapping; // For each field in the Student model, set the mapping value to "<unset>"

        return mapping; // Return the mapping object with the new field for the next iteration
      },
      {} as ExcelMapping // The initial value of the mapping is an empty map
    ),
  });

  logger.debug(`Created registration session with id ${result._id}`);

  // If the creation failed, throw an error
  if (!result) {
    res.status(500).json({
      code: "registration-session-creation-failed",
      message: "Failed to create registration session, please contact support.",
    });
  }

  res
    .status(201)
    .json({ message: `${result.stagedStudents.length} students uploaded` });
};

export default handler;
