import { Request, Response } from "express";
import paginate from "express-paginate";

import StagedStudentModel from "../../data/models/stagedStudents.model";
import RegistrationSessionModel from "../../data/models/registrationSession.model";
import { asyncHandler } from "@fcai-sis/shared-utilities";

type HandlerRequest = Request;

/**
 * Fetchs the staged students from the active registration session.
 */
const fetchPaginatedStagedStudentsHandler = [
  paginate.middleware(),
  asyncHandler(async (req: HandlerRequest, res: Response) => {
    const currentActiveSession = await RegistrationSessionModel.findOne({
      active: true,
    });

    if (!currentActiveSession) {
      res.status(400).json({
        code: "no-active-registration-session",
        message: "There is no active registration session",
      });
      return;
    }

    const stagedStudents = await StagedStudentModel.find({
      registrationSessionId: currentActiveSession._id,
    })
      .skip(req.skip ?? 0)
      .limit(req.query.limit as unknown as number);

    if (!stagedStudents) {
      res.status(400).json({
        code: "no-staged-students",
        message: "There are no staged students",
      });
      return;
    }

    res.status(200).json({ stagedStudents });
  }),
];

export default fetchPaginatedStagedStudentsHandler;
