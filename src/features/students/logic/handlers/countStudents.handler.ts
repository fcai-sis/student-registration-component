import { Request, Response } from "express";
import { StudentModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request;

/*
 * Counts the number of students in the entire collection
 * */
const handler = async (req: HandlerRequest, res: Response) => {
  const count = await StudentModel.countDocuments();
  return res.status(200).send({ count });
};

const countStudentCollectionHandler = handler;
export default countStudentCollectionHandler;
