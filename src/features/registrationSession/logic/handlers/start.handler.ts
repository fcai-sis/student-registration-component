import { Request, Response } from "express";

import logger from "../../../../core/logger";
import ExcelRow from "../../data/types/excelRow.type";
import ExcelMapping from "../../data/types/mapping.type";
import unsetMapping from "../../data/types/unsetMapping.type";
import StagedStudentModel, {
  StagedStudentType,
} from "../../data/models/stagedStudents.model";
import RegistrationSessionModel from "../../data/models/registrationSession.model";
import mappableFields from "../../data/models/constants/mappableFields";

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
const startHandler = async (req: HandlerRequest, res: Response) => {
  const students = req.body.students;
  const excelColumnsHeaders = req.body.excelColumnsHeaders;

  // Create a new registration session with the staged students, excel columns headers and an empty mapping
  const registrationSessionCreateResult = await RegistrationSessionModel.create(
    {
      excelColumnsHeaders: excelColumnsHeaders,

      // If we are to have a default mapping, we can set it here instead of an empty mapping
      mapping: mappableFields.reduce(
        // Loop through all keys in the mapping
        (mapping, key) => {
          mapping[key as keyof ExcelMapping] = unsetMapping; // TODO: type assertion, idk what that is, typescript shenanigans
          return mapping; // Return the mapping object with the new field for the next iteration
        },
        {} as ExcelMapping // The initial value of the mapping is an empty map
      ),
    }
  );

  // If the creation failed, throw an error
  if (!registrationSessionCreateResult) {
    res.status(500).json({
      error: {
        message:
          "Failed to create registration session, please contact support.",
      },
    });
  }

  logger.debug(
    `Created registration session with id ${registrationSessionCreateResult._id}`
  );

  // Generate row IDs for the staged students
  const studentsWithIds = students.map(
    (student): StagedStudentType => ({
      student,
      registrationSessionId: registrationSessionCreateResult._id,
    })
  );

  // Create a new staged students document with the staged students
  const stagedStudentsCreateResult = await StagedStudentModel.insertMany(
    studentsWithIds
  );

  // If the creation failed, throw an error
  if (!stagedStudentsCreateResult) {
    res.status(500).json({
      error: {
        message: "Failed to create staged students, please contact support.",
      },
    });
  }

  logger.debug(
    `Created ${stagedStudentsCreateResult.length} staged students for registration session ${registrationSessionCreateResult._id}`
  );

  res.status(201).json({
    message: "Registration session started",
    registrationSession: {
      _id: registrationSessionCreateResult._id,
      active: registrationSessionCreateResult.active,
      startDate: registrationSessionCreateResult.startDate,
      mapping: registrationSessionCreateResult.mapping,
      excelColumnsHeaders: registrationSessionCreateResult.excelColumnsHeaders,
    },
  });
};

export default startHandler;
