import { Request, Response } from "express";
import { StudentModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {
    studentId: string;
  },
  {},
  {}
>;

/*
 * Find student by Id
 * */
const handler = async (req: HandlerRequest, res: Response) => {
  const studentId = req.params.studentId;
  // read the student from the db
  const student = await StudentModel.findOne(
    { studentId },
    {
      __v: 0,
    }
  );

  if (!student) {
    return res.status(404).json({
      errors: [
        {
          message: "Student not found",
        },
      ],
    });
  }

  return res.status(200).json({
    student,
  });
};

const findStudentByStudentIdHandler = handler;

export default findStudentByStudentIdHandler;
