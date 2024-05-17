import { Request, Response } from "express";
import { StudentModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<{ studentId: string }>;

/*
 * Deletes a student
 * */
const handler = async (req: HandlerRequest, res: Response) => {
  const student = req.params.studentId;

  const deletedStudent = await StudentModel.findByIdAndDelete(student);

  if (!deletedStudent) {
    return res.status(404).json({
      error: {
        message: "Student not found",
      },
    });
  }

  return res.status(200).json({
    data: deletedStudent,
    message: "Student deleted successfully",
  });
};

const deleteStudentHandler = handler;
export default deleteStudentHandler;
