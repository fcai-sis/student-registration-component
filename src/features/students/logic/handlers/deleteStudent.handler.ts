import { Request, Response } from "express";
import { StudentModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<{ studentId: string }>;

/*
 * Deletes a student
 * */
const deleteStudentHandler = async (req: HandlerRequest, res: Response) => {
  const deletedStudent = await StudentModel.findByIdAndDelete(
    req.params.studentId
  );

  if (!deletedStudent) {
    return res.status(404).json({
      errors: [
        {
          message: "Student not found",
        },
      ],
    });
  }

  return res.status(200).json({
    data: deletedStudent,
    message: "Student deleted successfully",
  });
};

export default deleteStudentHandler;
