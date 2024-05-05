import { Request, Response } from "express";
import { StudentModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {},
  {},
  {
    fullName: string;
    address: string;
  }
>;

/*
 * Creates a new student
 * */
const handler = async (req: HandlerRequest, res: Response) => {
  const { fullName, address } = req.body;

  const student = new StudentModel({
    fullName,
    address,
  });

  await student.save();

  const response = {
    student: {
      _id: student._id,
      fullName: student.fullName,
      address: student.address,
    },
  };

  return res.status(201).json(response);
};

const createStudentHandler = handler;
export default createStudentHandler;
