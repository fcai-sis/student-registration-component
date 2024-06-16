import { Request, Response } from "express";
import {
  AcademicStudentModel,
  StudentModel,
  UserModel,
} from "@fcai-sis/shared-models";
import bcrypt from "bcrypt";

type HandlerRequest = Request<
  {},
  {},
  {
    studentId: string;
    fullName: string;
    groupCode: boolean;
    gender: "male" | "female" | "other";
    religion: "christian" | "muslim" | "other";
    nationalId: string;
    administration: string;
    directorate: string;
    phoneNumber: string;
    educationType: string;
    birthYear: number;
    birthMonth: number;
    birthDay: number;
    birthPlace: string;
    governorateId: string;
    nationality: "egyptian" | "foreigner";
    address: string;
  }
>;

/*
 * Creates a new student
 * */
const handler = async (req: HandlerRequest, res: Response) => {
  const {
    studentId,
    fullName,
    groupCode,
    gender,
    religion,
    nationalId,
    administration,
    directorate,
    phoneNumber,
    educationType,
    birthYear,
    birthMonth,
    birthDay,
    birthPlace,
    governorateId,
    nationality,
    address,
  } = req.body;
  // create a new user for the student
  const hashedPassword = await bcrypt.hash(studentId, 10);
  const user = await UserModel.create({ password: hashedPassword });
  // create a new student
  const student = new StudentModel({
    studentId,
    fullName,
    groupCode,
    gender,
    religion,
    nationalId,
    administration,
    directorate,
    phoneNumber,
    educationType,
    birthYear,
    birthMonth,
    birthDay,
    birthPlace,
    governorateId,
    nationality,
    address,
    userId: user._id,
  });

  await student.save();

  if (!student) {
    return res.status(500).json({
      code: "student-creation-failed",
      message: "Failed to create student, please contact support.",
    });
  }

  const academicStudent = new AcademicStudentModel({
    student: student._id,
  });

  await academicStudent.save();

  const response = {
    student: {
      ...student.toObject(),
    },
  };

  return res.status(201).json(response);
};

const createStudentHandler = handler;
export default createStudentHandler;
