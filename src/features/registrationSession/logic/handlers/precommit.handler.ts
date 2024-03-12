import { Request, Response } from "express";

import logger from "../../../../core/logger";
import unsetMapping from "../../data/types/unsetMapping.type";
import StudentType from "../../../common/data/types/student.type";
import MappedStudentModel from "../../../common/data/models/mappedStudent.model";
import StagedStudentModel from "../../data/models/stagedStudents.model";
import RegistrationSessionModel from "../../data/models/registrationSession.model";
import { mapStagedStudent } from "../utils";

type HandlerRequest = Request<{}, {}, {}>;

/**
 * Saves the staged students in the current active registration session to the mapped students collection
 */
const precommitHandler = async (_: HandlerRequest, res: Response) => {
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

  // Check if there already are mapped students from previous precommit
  const existingMappedStudents = await MappedStudentModel.find();

  // If there are already mapped students, throw an error
  if (existingMappedStudents.length > 0) {
    logger.debug(
      `There are already ${existingMappedStudents.length} mapped students in the current active registration session`
    );
    res.status(200).json({
      code: "mapped-students-exist",
      message:
        "There are already mapped students in the current active registration session",
    });
    return;
  }

  const mapping = currentActiveSession.mapping;

  // TODO: extract mapping validation to a separate middleware
  // If any of the fields in the mapping are not set, throw an error
  const unsetFields = Object.entries(mapping)
    .filter(([_, value]) => value === unsetMapping)
    .map(([key, _]) => key);

  if (unsetFields.length > 0) {
    logger.debug(`Unset fields found in the mapping: ${unsetFields}`);
    res.status(400).json({
      code: "unset-fields-in-mapping",
      message: "There are unset fields in the mapping",
      unsetFields,
    });
    return;
  }

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

  // Loop over the staged students and save them to the mapped students collection after mapping the fields using the mapping object and the excel columns headers
  const mappedStudents: StudentType[] = [];

  // TODO: Type the errors array properly
  const errors: any[] = [];

  // For each staged student, map the fields using the mapping object
  for (const stagedStudent of stagedStudents) {
    logger.debug(
      `Mapping the staged student: ${JSON.stringify(stagedStudent)}`
    );
    try {
      const mappedStudent = mapStagedStudent(stagedStudent.student, mapping);
      mappedStudents.push(mappedStudent);
    } catch (error) {
      logger.debug(`Error mapping the staged student: ${stagedStudent}`);
      errors.push(`Error mapping the staged student: ${stagedStudent}`);
      continue;
    }
  }

  if (errors.length > 0) {
    res.status(400).json({
      code: "error-mapping-staged-students",
      message: "There was an error mapping the staged students",
      errors,
    });
    return;
  }

  logger.debug(`Mapped students: ${JSON.stringify(mappedStudents, null, 2)}`);

  // Save the mapped students to the mapped students collection
  for (const mappedStudent of mappedStudents) {
    // Try to save the mapped student to the mapped students collection
    // If there is an error, catch it and add it to the errors array, which is guaranteed to be empty
    try {
      await MappedStudentModel.create(mappedStudent);
    } catch (error: any) {
      // Get the row that caused the error, and a human readable error message describing the error, and add it to the errors array
      const index = mappedStudents.indexOf(mappedStudent);

      const e = {
        row: index + 1,
        errors: Object.values(error.errors).map((e: any) => e.message), // TODO: Map error messages to localized human readable messages
      };

      logger.debug(JSON.stringify(e, null, 2));

      errors.push(e);

      continue;
    }
  }

  if (errors.length > 0) {
    await MappedStudentModel.deleteMany();
    res.status(400).json({
      code: "error-saving-mapped-students",
      message: "There was an error saving the mapped students",
      errors,
    });
    return;
  }

  res.status(200).json({
    message: "Successfully saved the mapped students",
  });
};

export default precommitHandler;
