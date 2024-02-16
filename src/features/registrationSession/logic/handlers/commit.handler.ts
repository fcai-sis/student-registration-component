import { Request, Response } from "express";

import logger from "../../../../core/logger";
import StudentType from "../../../common/data/types/student.type";
import ExcelMapping from "../../data/types/mapping.type";
import StudentModel from "../../../common/data/models/student.model";
import unsetMapping from "../../data/types/unsetMapping.type";
import StagedStudentType from "../../data/types/stagedStudent.type";
import StagedStudentModel from "../../data/models/stagedStudents.model";
import { getStudentKeys } from "../../../common/logic/utils/mapping.utils";
import RegistrationSessionModel from "../../data/models/registrationSession.model";

type HandlerRequest = Request<{}, {}, { mapping: ExcelMapping }>;

/**
 * Saves the staged students in the current active registration session to the actual students collection.
 * The active registration session is then marked as inactive.
 */
const handler = async (_: HandlerRequest, res: Response) => {
  // Get the current action registration session
  const currentActiveSession = await RegistrationSessionModel.findOne({
    active: true,
  });

  // If none exists, throw an error
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

  // Get the staged students for the current active registration session
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
    let errorMessages: string[] = [];
    let insertedIds: any[] = [];
    // Create the actual students from the staged students by applying the mapping
    const students = stagedStudents.map(
      ({ student: stagedStudent }: StagedStudentType, index) => {
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
            errorMessages.push(
              `No value found for field "${correspondingExcelColumnHeader}" in staged student with id ${stagedStudent._id} at row ${index + 2}`
            );
            continue;
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

    if (errorMessages.length > 0) {
      res.status(400).json({
        error: {
          code: "no-value-found",
          message: errorMessages,
        }
      });
      return;
    }
    logger.debug(`Mapped ${students} students successfully`);

    // Create the students in the database
    const result = await StudentModel.insertMany(students, {
      ordered: false,
    }).then((result) => {
      return result;
    }).catch((error: any) => {
      if (error.writeErrors && error.code === 11000) {
        insertedIds = Object.values(error.result.insertedIds);
        error.writeErrors.forEach((writeError: any) => {
          console.log(writeError);

          //TODO: This is a hack, fix it
          const field = writeError.err.errmsg.split("{")[1].split("}")[0].trim();
          const duplicatedField = field.split(":")[0].trim();
          const duplicatedValue = field.split(":")[1].trim();
          errorMessages.push(`${duplicatedField} ${duplicatedValue} at row ${writeError.index + 2}`);
        }
        );
      }
    }
    );
    if (insertedIds.length > 0) {
      const result = await StudentModel.deleteMany({
        _id: {
          $in: insertedIds
        }
      });
    }

    if (errorMessages.length > 0) {
      res.status(400).json({
        error: {
          code: "duplicate-entry",
          message: errorMessages,
        }
      });
      return;
    }

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
