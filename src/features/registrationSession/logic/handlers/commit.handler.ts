import { Request, Response } from "express";
import bcrypt from "bcrypt";

import logger from "../../../../core/logger";
import StagedStudentModel from "../../data/models/stagedStudents.model";
import RegistrationSessionModel from "../../data/models/registrationSession.model";
import MappedStudentModel from "../../../common/data/models/mappedStudent.model";
import {
  AcademicStudentModel,
  BylawModel,
  StudentModel,
  UserModel,
} from "@fcai-sis/shared-models";

type HandlerRequest = Request<{}, {}, {}>;

/**
 * Saves the staged students in the current active registration session to the actual students collection.
 * The active registration session is then marked as inactive.
 */
const commitHandler = async (_: HandlerRequest, res: Response) => {
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
  for (const mappedStudent of mappedStudents) {
    const studentPassword = await bcrypt.hash(mappedStudent.studentId, 10);
    const user = new UserModel({ password: studentPassword });
    await user.save();
    // Assign the latest bylaw to this student
    const latestBylaw = await BylawModel.findOne({}).sort({ createdAt: -1 });
    if (!latestBylaw) {
      res.status(400).json({
        code: "no-bylaw",
        message: "There is no bylaw to assign to the student",
      });
      return;
    }
    const student = new StudentModel({
      ...mappedStudent.toJSON(),
      user: user._id,
      bylaw: latestBylaw._id,
    });
    await student.save();
    await new AcademicStudentModel({
      student: student._id,
      currentGpa: 4.0,
    }).save();
  }

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

export default commitHandler;
