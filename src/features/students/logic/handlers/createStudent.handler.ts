import { Request, Response } from "express";
import {
  AcademicStudentModel,
  AcademicStudentType,
  BylawModel,
  IByLaw,
  IStudent,
  RoleEnum,
  StudentModel,
  StudentType,
  UserModel,
  UserType,
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

  const user = await UserModel.create<UserType>({
    password: await bcrypt.hash(student.studentId!, 10),
    role: RoleEnum[1],
  });

  const latestBylaw: IByLaw = await BylawModel.findOne({}).sort({
    createdAt: -1,
  });

  if (!latestBylaw) {
    return res.status(400).json({
      errors: [
        {
          code: "no-bylaw",
          message: "There is no bylaw to assign to the student",
        },
      ],
    });
  }

  const createdStudent = await StudentModel.create<StudentType>({
    ...student,
    user: user._id,
    bylaw: latestBylaw._id,
  });

  if (!createdStudent) {
    return res.status(500).json({
      errors: [
        {
          code: "student-creation-failed",
          message: "Failed to create student, please contact support.",
        },
      ],
    });
  }

  const academicStudent =
    await AcademicStudentModel.create<AcademicStudentType>({
      student: createdStudent._id,
      gpa: latestBylaw.gpaScale,
    });

  const response = {
    student: {
      ...createdStudent.toJSON(),
      _id: undefined,
      __v: undefined,
      ...{
        ...academicStudent.toJSON(),
        _id: undefined,
        __v: undefined,
      },
    },
  };

  return res.status(201).json(response);
};

export default createStudentHandler;
