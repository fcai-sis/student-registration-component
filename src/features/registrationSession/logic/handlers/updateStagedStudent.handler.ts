import { Request, Response, json } from "express";
import StagedStudentModel from "../../data/models/stagedStudents.model";
import RegistrationSessionModel from "../../data/models/registrationSession.model";
import mongoose from "mongoose";
import logger from "../../../../core/logger";

type HandlerRequest = Request<
  {
    EXCEL_ROW_ID: string;
  },
  {},
  {
    UpdatedFileds: any;
  }
>;

const updateStagedStudentHandler = async (
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

  // get the student with the req.params.studentID

  const stagedStudent = await StagedStudentModel.findOne({
    registrationSessionId: activeSession._id,
    _id: new mongoose.Types.ObjectId(req.params.EXCEL_ROW_ID),
  });

  // If there is no staged student with the given ID, throw an error
  if (!stagedStudent) {
    res.status(400).json({
      code: "no-staged-student",
      message: "No staged student with the given ID",
    });
    return;
  }

  // Backup the existing data before the update
  if (!stagedStudent.backup) {
    stagedStudent.backup = stagedStudent.student;
    await stagedStudent.save();
  }

  // Get the updated student data from the request body
  for (const [key, value] of Object.entries(req.body.UpdatedFileds)) {
    if (key in stagedStudent.student) {
      logger.debug(`Updating ${key} to ${value}`);
      logger.debug(JSON.stringify(stagedStudent.student));
      logger.debug(stagedStudent.student[key]);

      stagedStudent.student[key] = value;
    } else {
      res.status(400).json({
        code: "invalid-field",
        message: `Invalid field ${key}`,
      });
      return;
    }
  }

  logger.debug(JSON.stringify(stagedStudent));
  stagedStudent.markModified("student"); // Mark the 'student' field as modified
  await stagedStudent.save();

  // For demonstration, we will just send a success response
  res.status(200).json({
    code: "update-success",
    message: "Staged student data updated successfully",
  });
};

export default updateStagedStudentHandler;
