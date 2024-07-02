import { Request, Response, NextFunction } from "express";
import { DBLock } from "@fcai-sis/shared-models";

export default function databaseLockMiddleware(lockName: string) {
  return async (_: Request, res: Response, next: NextFunction) => {
    let lock = await DBLock.findOne({ lockName });

    if (!lock) {
      lock = new DBLock({ lockName });
      await lock.save();

      return next();
    }

    return res.status(409).json({
      errors: [
        {
          message: `The lock ${lockName} is already locked.`,
        },
      ],
    });
  };
}
