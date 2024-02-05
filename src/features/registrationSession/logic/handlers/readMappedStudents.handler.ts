import { Request, Response } from 'express';

import logger from '../../../../core/logger';
import unsetMapping from '../../data/types/unsetMapping.type';
import StagedStudentModel from "../../data/models/stagedStudents.model";
import { rowToStudent } from '../../../common/logic/utils/mapping.utils';
import RegistrationSessionModel from '../../data/models/registrationSession.model';

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

  const mapping = currentActiveSession.mapping;

  // if any of the mapping is unsetMapping, throw an error
  for (const key in mapping) {
    if (mapping[key] === unsetMapping) {
      res.status(400).json({
        message: `Mapping for ${key} is not set. Please set the mapping first.`
      });
      return;
    }
  }

  const stagedStudents = await StagedStudentModel.find({
    registrationSessionId: currentActiveSession._id,
  })
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  const students = stagedStudents.map(({ student }) => {
    logger.debug(`Student ${JSON.stringify(student)}`);
    return rowToStudent(student, mapping);
  });

  res.json({ students });
};

const readMappedStudentsHandler = handler;
export default readMappedStudentsHandler;
