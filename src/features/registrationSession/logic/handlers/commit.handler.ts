import { Request, Response } from "express";

import logger from "../../../../core/logger";
import StagedStudentModel from "../../data/models/stagedStudents.model";
import RegistrationSessionModel from "../../data/models/registrationSession.model";
import MappedStudentModel from "../../../common/data/models/mappedStudent.model";
import { StudentModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<{}, {}, {}>;

/**
 * Saves the staged students in the current active registration session to the actual students collection.
 * The active registration session is then marked as inactive.
 */
const handler = async (_: HandlerRequest, res: Response) => {
  // Find the current active registration session
  const currentActiveSession = await RegistrationSessionModel.findOne({
    active: true,
  });

  // If there is no active registration session, return an error
  if (!currentActiveSession) {
    logger.debug(`No active registration session found`);
    res.status(400).json({
      code: "no-active-registration-session",
      message: "There is no active registration session",
    });
    return;
  }

  // Get all the mapped students
  const mappedStudents = await MappedStudentModel.find();

  // if there are 0 mapped students, then there's nothing to commit
  if (mappedStudents.length === 0) {
    logger.debug(`No mapped students found`);
    res.status(400).json({
      code: "no-mapped-students",
      message: "There are no mapped students to commit",
    });
    return;
  }

  // Copy the mapped students to the students collection
  const insertResult = await StudentModel.insertMany(mappedStudents);

  // If the insert failed, return an error
  if (!insertResult) {
    logger.error(
      `Failed to insert mapped students into the students collection`
    );
    res.status(500).json({
      code: "failed-insert-mapped-students",
      message: "Failed to insert mapped students into the students collection",
    });
    return;
  }

  logger.debug(
    `Inserted ${insertResult.length} mapped students into the students collection`
  );

  // End the current active registration session
  currentActiveSession.active = false;
  currentActiveSession.endDate = new Date();

  await currentActiveSession.save();

  // Clear the staged students and mapped students for the next registration session
  await MappedStudentModel.deleteMany();
  await StagedStudentModel.deleteMany();

  res.status(200).json({
    message:
      "Successfully committed the staged students to the students collection",
  });
};

export default handler;
