import { Request, Response } from 'express';

import RegistrationSessionModel from '../../data/models/registrationSession.model';
import MappedStudentModel from '../../../common/data/models/mappedStudent.model';

type HandlerRequest = Request;

const handler = async (req: HandlerRequest, res: Response) => {
  const page = req.context.page;
  const pageSize = req.context.pageSize;

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

  const mappedStudents = await MappedStudentModel.find({})
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  res.json({ mappedStudents });
};

const readMappedStudentsHandler = handler;
export default readMappedStudentsHandler;
