import { NextFunction, Response, Request } from "express";

import logger from "../../../../core/logger.js";
import RegistrationSessionModel from "../../data/models/registrationSession.model.js";

type MiddlewareRequest = Request<{}, {}, {}>;

/**
 * Checks whether there is an active registration session.
 *
 * @param checkIfExists  Whether to check if there is an active registration session or not
 * @returns `400 Bad Request` if checking for an active registration session and there is none, or if checking for no active registration session and there is one
 */
const middleware =
  (checkIfExists: boolean) =>
  async (req: MiddlewareRequest, res: Response, next: NextFunction) => {
    logger.debug(`Checking for active registration session: ${checkIfExists}`);

    // Get the current active registration session
    const thereIsAnActiveSession = await RegistrationSessionModel.exists({
      active: true,
    });

    logger.debug(`There is an active session: ${!!thereIsAnActiveSession}`);

    // If there is no active registration session and we are checking for an active registration session, return an error
    if (checkIfExists && !thereIsAnActiveSession) {
      logger.debug(
        `Checked for active registration session but didn't find one`
      );

      res.status(400).json({
        code: "no-active-registration-session",
        message: "There is no active registration session",
      });
      return;
    }

    // If there is an active registration session and we are checking for no active registration session, return an error
    if (!checkIfExists && thereIsAnActiveSession) {
      logger.debug(`Checked for no active registration session but found one`);

      res.status(400).json({
        code: "active-registration-session",
        message: "An active registration session already exists",
      });
      return;
    }

    next();
  };

export default middleware;
