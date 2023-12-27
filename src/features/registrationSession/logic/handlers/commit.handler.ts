import { Request, Response } from "express";

import logger from "../../../../core/logger.js";
import StudentType from "../../data/types/student.type.js";
import ExcelMapping from "../../data/types/mapping.type.js";
import StudentModel from "../../data/models/student.model.js";
import unsetMapping from "../../data/types/unsetMapping.type.js";
import StagedStudentType from "../../data/types/stagedStudent.type.js";
import StagedStudentModel from "../../data/models/stagedStudents.model.js";
import { getStudentKeys } from "../../../common/logic/utils/mapping.utils.js";
import RegistrationSessionModel from "../../data/models/registrationSession.model.js";

type HandlerRequest = Request<{}, {}, { mapping: ExcelMapping }>;

/**
 * Saves the staged students in the current active registration session to the actual students collection.
 * The active registration session is then marked as inactive.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const currentActiveSession = await RegistrationSessionModel.findOne({
    active: true,
  });

  if (!currentActiveSession) {
    logger.debug(`No active registration session found`);
    res.status(400).json({
      code: "no-active-registration-session",
      message: "There is no active registration session",
    });
    return;
  }

  logger.debug(`Found active registration session: ${currentActiveSession}`);

  // Get the excel columns headers and mapping from the current active registration session
  const excelColumnsHeaders = currentActiveSession.excelColumnsHeaders;
  const mapping = currentActiveSession.mapping;

  // Get the staged students from the current active registration session
  const stagedStudents = await StagedStudentModel.find({
    registrationSessionId: currentActiveSession._id,
  });

  // If there are no staged students, throw an error
  if (!stagedStudents) {
    logger.debug(`No staged students found`);
    res.status(400).json({
      code: "no-staged-students",
      message: "There are no staged students",
    });
    return;
  }

  logger.debug(
    `Found ${stagedStudents.length} staged students in the current active registration session`
  );

  try {
    // Create the actual students from the staged students by applying the mapping
    const students = stagedStudents.map(
      ({ student: stagedStudent }: StagedStudentType) => {
        const student: Partial<StudentType> = {};

        // Loop through all keys in the mapping
        for (const studentFieldInMapping of getStudentKeys(mapping)) {
          logger.debug(`Mapping ${studentFieldInMapping}...`);

          // Get the corresponding excel column header for the current key
          const correspondingExcelColumnHeader = mapping[studentFieldInMapping];

          logger.debug(
            `Corresponding excel column header: ${correspondingExcelColumnHeader}`
          );

          // If the corresponding excel column header is <unset>, throw an error
          if (correspondingExcelColumnHeader === unsetMapping) {
            logger.debug(`Unset mapping for ${studentFieldInMapping}`);
            throw {
              code: "unset-mapping",
              message: `Unset mapping for ${studentFieldInMapping}`,
            };
          }

          // TODO: This might be redundant
          if (!correspondingExcelColumnHeader) {
            logger.debug(
              `No corresponding excel column header for ${studentFieldInMapping}`
            );
            throw {
              code: "no-corresponding-excel-column-header",
              message: `No corresponding excel column header for ${studentFieldInMapping}`,
            };
          }

          // If the corresponding excel column header is not found in the excel columns headers, throw an error
          // TODO: This might be redundant
          if (!excelColumnsHeaders.includes(correspondingExcelColumnHeader)) {
            logger.debug(
              `Corresponding excel column header ${correspondingExcelColumnHeader} for ${studentFieldInMapping} not found in excel columns headers`
            );
            throw {
              code: "corresponding-excel-column-header-not-found",
              message: `Corresponding excel column header ${correspondingExcelColumnHeader} for ${studentFieldInMapping} not found in excel columns headers`,
            };
          }

          logger.debug(
            `Found corresponding excel column header ${correspondingExcelColumnHeader} for ${studentFieldInMapping}`
          );

          // Get the value of the current key in the staged student
          const correspondingFieldValue =
            stagedStudent[correspondingExcelColumnHeader];

          logger.debug(
            `Corresponding field value: ${correspondingFieldValue} (${typeof correspondingFieldValue})`
          );

          // If no value is found, throw an error
          if (!correspondingFieldValue) {
            logger.debug(
              `No value found for field "${correspondingExcelColumnHeader}" in staged student with id ${stagedStudent._id}`
            );
            throw {
              code: "no-value-found",
              message: `No value found for field "${correspondingExcelColumnHeader}" in one of the staged students, please update the mapping or upload another excel file.`,
            };
          }

          // Set the value of the current key in the student to the value of the corresponding excel column header in the staged student
          student[studentFieldInMapping] = correspondingFieldValue;

          logger.debug(
            `Set ${studentFieldInMapping} to ${correspondingFieldValue} in ${student}`
          );
        }

        return student;
      }
    );

    // Create the students in the database
    const result = await StudentModel.insertMany(students);

    // If the creation failed, throw an error
    if (!result) {
      throw {
        code: "failed-to-create-students",
        message: "Failed to create students",
      };
    }

    // Mark the current active registration session as inactive
    currentActiveSession.active = false;
    currentActiveSession.endDate = new Date();

    await currentActiveSession.save();

    // Clear the staged students from the database
    await StagedStudentModel.deleteMany({
      registrationSessionId: currentActiveSession._id,
    });

    logger.debug(`Marked current active registration session as inactive`);

    res.status(200).json({ message: `${result.length} students created` });
  } catch (error) {
    logger.debug(`Error while mapping: ${error}`);
    res.status(400).json(error);
    return;
  }
};

export default handler;
