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
  const student = await StudentModel.findById(studentId, {
    __v: 0,
  });

  if (!student) {
    return res.status(404).json({
      error: {
        message: "Student not found",
      },
    });
  }

  return res.status(200).send({
    student,
  });
};

const findStudentByIdHandler = handler;

export default findStudentByIdHandler;
