import { Request, Response, json } from "express";
import StagedStudentModel from "../../data/models/stagedStudents.model";
import RegistrationSessionModel from "../../data/models/registrationSession.model";
import mongoose from "mongoose";
//import logger from "../../../../core/logger";

type HandlerRequest = Request<
  {
    EXCEL_ROW_ID: string;
  },
  {},
  {}
>;

const resetStagedStudentHandler = async (
  req: HandlerRequest,
  res: Response
) => {
  //get the active session
  const activeSession = await RegistrationSessionModel.findOne({
    active: true,
  });

  //If there is no active session, throw an error
  if (!activeSession) {
    res.status(400).json({
      code: "no-active-session",
      message: "No active registration session",
    });
    return;
  }

  //get the student with the req.params.studentID
  const stagedStudent = await StagedStudentModel.findOne({
    registrationSessionId: activeSession._id,
    _id: new mongoose.Types.ObjectId(req.params.EXCEL_ROW_ID),
  });

  //If there is no staged student with the given ID, throw an error
  if (!stagedStudent) {
    res.status(400).json({
      code: "no-staged-student",
      message: "No staged student with the given ID",
    });
    return;
  }

  //If there is no backup, throw an error
  if (!stagedStudent.backup) {
    res.status(400).json({
      code: "no-backup",
      message: "No backup for the staged student",
    });

    return;
  }

  //Restore the backup
  stagedStudent.student = stagedStudent.backup;
  await stagedStudent.save();
};

export default resetStagedStudentHandler;
