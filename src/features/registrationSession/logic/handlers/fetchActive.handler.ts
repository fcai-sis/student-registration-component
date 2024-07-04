import { Request, Response } from "express";

import RegistrationSessionModel from "../../data/models/registrationSession.model";
import { studentLocalizedFields } from "../../data/utils/studentModel.util";

type HandlerRequest = Request<{}, {}, {}>;

/**
 * Reads and returns the active registration session from the database without the staged students.
 *
 * The staged students are not returned because of the anticipated large size of the array.
 */
const handler = async (_: HandlerRequest, res: Response) => {
  // Get the active registration session
  const result = await RegistrationSessionModel.findOne(
    { active: true },
    // Exclude stagedStudents for performance reasons
    // and __v and _id for security reasons and because they are not needed
    { __v: 0, _id: 0 }
  );

  // If there is no active registration session, throw an error
  if (!result) {
    res.status(404).json({
      errors: [
        {
          code: "no-active-registration-session",
          message: "There is no active registration session.",
        },
      ],
    });
    return;
  }

  res.json({
    registrationSession: result.toObject(),
    fieldNames: studentLocalizedFields,
  });
};

export default handler;
