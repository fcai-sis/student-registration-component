import { Request, Response } from "express";
import StudentModel from "../../../common/data/models/student.model";


type HandlerRequest = Request<
  {},
  {},
  {
    fullName: string;
    address: string;
    status: "active" | "pending" | "inactive";
  }
>;

/*
 * Creates a new student
 * */
const handler = async (req: HandlerRequest, res: Response) => {
  const { fullName, address, status } = req.body;


  const student = new StudentModel({
    fullName,
    address,
    status,
  });

  await student.save();

  const response = {
    student: {
      _id: student._id,
      fullName: student.fullName,
      address: student.address,
      status: student.status,
    }
  }

  return res.status(201).json(response);
}

const createStudentHandler = handler;
export default createStudentHandler;
