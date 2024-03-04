import { Request, Response } from "express";

import ExcelMapping from "../../data/types/mapping.type";
import RegistrationSessionModel from "../../data/models/registrationSession.model";
import MappedStudentModel from "../../../common/data/models/mappedStudent.model";

type HandlerRequest = Request<{}, {}, { mapping: ExcelMapping }>;

/**
 * Updates the mapping from the uploaded students Excel file to the Student model.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const mapping = req.body.mapping;

  const activeRegistrationSession = await RegistrationSessionModel.findOne({
    active: true,
  });

  if (!activeRegistrationSession) {
    return res
      .status(404)
      .json({ error: "No active registration session found" });
  }

  // update only the keys that are present in the mapping
  activeRegistrationSession.mapping = {
    ...activeRegistrationSession.mapping,
    ...mapping,
  };

  const result = await activeRegistrationSession.save();

  if (!result) {
    throw new Error("Failed to update mapping");
  }

  await MappedStudentModel.deleteMany();

  res.status(200).json({ message: "Mapping updated", mapping: result.mapping });
};

export default handler;
