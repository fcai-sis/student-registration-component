import { Request, Response } from "express";
import {
  AcademicStudentModel,
  IAcademicStudent,
  IStudent,
  IUser,
  StudentModel,
  UserModel,
} from "@fcai-sis/shared-models";
import bcrypt from "bcrypt";

type HandlerRequest = Request<
  {},
  {},
  {
    student: Partial<IStudent>;
  }
>;

/*
 * Creates a new student
 * */
const createStudentHandler = async (req: HandlerRequest, res: Response) => {
  const { student } = req.body;

  const user = new UserModel<Partial<IUser>>({
    password: await bcrypt.hash(student.studentId!, 10),
  });

  const createdStudent = await new StudentModel<Partial<IStudent>>({
    ...student,
    user: user._id,
  }).save();

  if (!createdStudent) {
    return res.status(500).json({
      code: "student-creation-failed",
      message: "Failed to create student, please contact support.",
    });
  }

  const academicStudent = await new AcademicStudentModel<
    Partial<IAcademicStudent>
  >({
    student: createdStudent._id,
  }).save();

  const response = {
    student: {
      ...createdStudent.toJSON(),
      _id: undefined,
      __v: undefined,
    },
    academicDetails: {
      ...academicStudent.toJSON(),
      _id: undefined,
      __v: undefined,
    },
  };

  return res.status(201).json(response);
};

export default createStudentHandler;
