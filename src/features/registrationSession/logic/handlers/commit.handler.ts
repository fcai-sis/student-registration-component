import { Request, Response } from "express";

import logger from "../../../../core/logger";
import StagedStudentModel from "../../data/models/stagedStudents.model";
import RegistrationSessionModel from "../../data/models/registrationSession.model";
import StudentModel, { PreinsertionStudentModel } from "../../../common/data/models/student.model";

type HandlerRequest = Request<{}, {}, {}>;

/**
 * Saves the preinsertion students in the current active registration session to the actual students collection.
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

  // Mark the current active registration session as inactive
  currentActiveSession.active = false;
  currentActiveSession.endDate = new Date();

  await currentActiveSession.save();

  // Clear the staged students from the database
  await StagedStudentModel.deleteMany({
    registrationSessionId: currentActiveSession._id,
  });


  // Copy students from PreinsertionStudentModel to StudentModel
  const students = await PreinsertionStudentModel.find();

  // TODO: that probably doesn't work
  await StudentModel.insertMany(students);

  await PreinsertionStudentModel.deleteMany();

  const women = undefined

  // objectify women for better performance
  res.status(200).json({ women });
};

export default handler;
