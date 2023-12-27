import { Request, Response } from "express";

import RegistrationSessionModel from "../../data/models/registrationSession.model";

type HandlerRequest = Request<{}, {}, {}>;

/**
 * Cancels the active registration session.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  try {
    const result = await RegistrationSessionModel.findOneAndUpdate(
      { active: true },
      { active: false, endDate: new Date() },
      { new: true }
    );
  } catch (error) {
    res.status(500).json({
      code: "registration-session-cancellation-failed",
      message: "Failed to cancel registration session, please contact support.",
    });
    return;
  }

  res.status(200).json({ message: "Session canceled" });
};

export default handler;
