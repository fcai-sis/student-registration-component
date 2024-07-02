import { NextFunction, Response, Request } from "express";

import RegistrationSessionModel from "../../data/models/registrationSession.model";
import { asyncHandler } from "@fcai-sis/shared-utilities";

type MiddlewareRequest = Request;

/**
 * Checks whether there is an active registration session.
 *
 * @param checkIfExists  Whether to check if there is an active registration session or not
 * @returns `400 Bad Request` if checking for an active registration session and there is none, or if checking for no active registration session and there is one
 */
const middleware = (checkIfExists: boolean) =>
  asyncHandler(
    async (_: MiddlewareRequest, res: Response, next: NextFunction) => {
      const thereIsAnActiveSession = await RegistrationSessionModel.exists({
        active: true,
      });

      // If there is no active registration session and we are checking for an active registration session, return an error
      if (checkIfExists && !thereIsAnActiveSession)
        return res.status(404).json({
          errors: [
            {
              message: "There is no active registration session",
            },
          ],
        });

      // If there is an active registration session and we are checking for no active registration session, return an error
      if (!checkIfExists && thereIsAnActiveSession)
        return res.status(409).json({
          errors: [
            {
              message: "There is already an active registration session",
            },
          ],
        });

      next();
    }
  );

export default middleware;
