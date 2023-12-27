import { Request, Response } from "express";

import ExcelMapping from "../../data/types/mapping.type";
import RegistrationSessionModel from "../../data/models/registrationSession.model";

type HandlerRequest = Request<{}, {}, { mapping: ExcelMapping }>;

/**
 * Updates the mapping from the uploaded students Excel file to the Student model.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const mapping = req.body.mapping;

  const result = await RegistrationSessionModel.findOneAndUpdate(
    { active: true },
    { mapping },
    { new: true }
  );

  if (!result) {
    throw new Error("Failed to update mapping");
  }

  res.status(200).json({ message: "Mapping updated", mapping: result.mapping });
};

export default handler;
