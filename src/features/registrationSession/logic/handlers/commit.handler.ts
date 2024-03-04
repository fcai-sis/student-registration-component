import { Request, Response } from "express";

import logger from "../../../../core/logger";
import StagedStudentModel from "../../data/models/stagedStudents.model";
import RegistrationSessionModel from "../../data/models/registrationSession.model";
import MappedStudentModel from "../../../common/data/models/mappedStudent.model";
import StudentModel from "../../../common/data/models/student.model";

type HandlerRequest = Request<{}, {}, {}>;

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

  const insertResult = await StudentModel.insertMany(mappedStudents);

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

  currentActiveSession.active = false;
  currentActiveSession.endDate = new Date();

  await currentActiveSession.save();

  await MappedStudentModel.deleteMany();
  await StagedStudentModel.deleteMany();

  res.status(200).json({
    code: "success",
    message:
      "Successfully committed the staged students to the students collection",
  });
};

export default handler;
