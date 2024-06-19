import { Request, Response } from "express";
import { AcademicStudentModel, StudentModel } from "@fcai-sis/shared-models";
import { TokenPayload } from "@fcai-sis/shared-middlewares";

type HandlerRequest = Request<
  {},
  {},
  {
    user: TokenPayload;
  }
>;

/*
 * Find student by Id
 * */
const meHandler = async (req: HandlerRequest, res: Response) => {
  const { userId } = req.body.user;

  // read the student from the db
  const student = await StudentModel.findOne({ userId });

  if (!student) {
    return res.status(404).json({
      error: {
        message: "Student not found",
      },
    });
  }

  const academicStudentData = await AcademicStudentModel.findOne({
    student: student._id,
  });

  if (!student) {
    return res.status(404).json({
      error: {
        message: "Student not found",
      },
    });
  }

  return res.status(200).send({
    student: {
      ...student.toObject(),
      academicStudentData,
    },
  });
};

export default meHandler;
