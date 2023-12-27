import { Request, Response } from "express";

import StagedStudentModel from "../../data/models/stagedStudents.model.js";
import RegistrationSessionModel from "../../data/models/registrationSession.model.js";

type HandlerRequest = Request<
  {},
  {},
  {
    page: number;
    pageSize: number;
  }
>;

/**
 * Reads and returns the staged students from the active registration session.
 *
 * The staged students are paginated.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const page = req.body.page;
  const pageSize = req.body.pageSize;

  // Get the current active registration session
  const currentActiveSession = await RegistrationSessionModel.findOne({
    active: true,
  });

  // If there is no active registration session, throw an error
  if (!currentActiveSession) {
    res.status(400).json({
      code: "no-active-registration-session",
      message: "There is no active registration session",
    });
    return;
  }

  // Get the staged students from the current active registration session
  const stagedStudents = await StagedStudentModel.find({
    registrationSessionId: currentActiveSession._id,
  })
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  // If there are no staged students, throw an error
  if (!stagedStudents) {
    res.status(400).json({
      code: "no-staged-students",
      message: "There are no staged students",
    });
    return;
  }

  res.status(200).json({
    students: stagedStudents,
  });
};

export default handler;
