import { Request, Response } from "express";
import {
  AcademicStudentModel,
  ProgramEnum,
  StudentModel,
} from "@fcai-sis/shared-models";
import { TokenPayload } from "@fcai-sis/shared-middlewares";

type HandlerRequest = Request<
  {},
  {},
  {
    user: TokenPayload;
  }
>;

/*
 * Get the current student
 * */
const fetchMeHandler = async (req: HandlerRequest, res: Response) => {
  const { userId } = req.body.user;

  // read the student from the db
  const student = await StudentModel.findOne({ user: userId });

  if (!student) {
    return res.status(404).json({
      error: {
        message: "Student not found",
      },
    });
  }

  const academicStudentData = await AcademicStudentModel.findOne({
    student: student._id,
  }).populate("major");

  if (!student) {
    return res.status(404).json({
      error: {
        message: "Student not found",
      },
    });
  }

  return res.status(200).send({
    student: {
      ...student.toJSON(),
      user: undefined,
      _id: undefined,
      __v: undefined,
      ...{
        ...academicStudentData.toJSON(),
        student: undefined,
        _id: undefined,
        __v: undefined,
        major: academicStudentData.major ?? {
          name: {
            en: "No Major",
            ar: "بدون تخصص",
          },
          program: ProgramEnum[0],
        },
      },
    },
  });
};

export default fetchMeHandler;
