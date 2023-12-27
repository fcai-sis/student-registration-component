import { Request, Response } from "express";

import logger from "../../../../core/logger.js";
import ExcelRow from "../../data/types/excelRow.type.js";
import ExcelMapping from "../../data/types/mapping.type.js";
import StudentModel from "../../data/models/student.model.js";
import unsetMapping from "../../data/types/unsetMapping.type.js";
import StagedStudentType from "../../data/types/stagedStudent.type.js";
import HasStudentFields from "../../data/types/hasStudentFields.type.js";
import StagedStudentsModel from "../../data/models/stagedStudents.model.js";
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
  const registrationSessionCreateResult = await RegistrationSessionModel.create(
    {
      excelColumnsHeaders: excelColumnsHeaders,

      // If we are to have a default mapping, we can set it here instead of an empty mapping
      mapping: getStudentKeys(
        StudentModel.schema.obj as HasStudentFields
      ).reduce(
        // Loop through all keys in the mapping
        (mapping, key) => {
          mapping[key] = unsetMapping; // For each field in the Student model, set the mapping value to "<unset>"

          return mapping; // Return the mapping object with the new field for the next iteration
        },
        {} as ExcelMapping // The initial value of the mapping is an empty map
      ),
    }
  );

  // If the creation failed, throw an error
  if (!registrationSessionCreateResult) {
    res.status(500).json({
      code: "registration-session-creation-failed",
      message: "Failed to create registration session, please contact support.",
    });
  }

  logger.debug(
    `Created registration session with id ${registrationSessionCreateResult._id}`
  );

  // Generate row IDs for the staged students
  const studentsWithIds = students.map(
    (student): StagedStudentType => ({
      student: student,
      registrationSessionId: registrationSessionCreateResult._id,
    })
  );

  // Create a new staged students document with the staged students
  const stagedStudentsCreateResult = await StagedStudentsModel.insertMany(
    studentsWithIds
  );

  // If the creation failed, throw an error
  if (!stagedStudentsCreateResult) {
    res.status(500).json({
      code: "staged-students-creation-failed",
      message: "Failed to create staged students, please contact support.",
    });
  }

  logger.debug(
    `Created ${stagedStudentsCreateResult.length} staged students for registration session ${registrationSessionCreateResult._id}`
  );

  res.status(201).json({
    message: `${stagedStudentsCreateResult.length} students uploaded`,
  });
};

export default handler;
