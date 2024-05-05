import { Request, Response } from "express";
import { StudentModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request;

/*
 * Reads all students
 * */
const handler = async (req: HandlerRequest, res: Response) => {
  // get the pagination parameters
  const page = req.context.page;
  const pageSize = req.context.pageSize;

  // read the students from the db
  const students = await StudentModel.find()
    .sort({ createdAt: -1 }) // sorts so that latest Students show up first
    .skip((page - 1) * pageSize) // pagination
    .limit(pageSize);

  const count = await StudentModel.countDocuments();

  return res.status(200).send({
    students: students.map((student) => ({
      ...student.toObject(),
    })),
    count,
  });
};

const readStudentsHandler = handler;
export default readStudentsHandler;
