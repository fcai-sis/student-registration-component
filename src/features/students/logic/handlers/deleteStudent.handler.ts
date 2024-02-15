import { Request, Response } from "express";
import StudentModel from "../../../common/data/models/student.model";


type HandlerRequest = Request<{ studentId: string }>;

/*
 * Deletes a student
 * */
const handler = async (req: HandlerRequest, res: Response) => {
  const student = req.params.studentId;

  const deletedStudent = await StudentModel.findByIdAndDelete(
    student
  );

  if (!deletedStudent) {
    return res.status(404).send({
      error: {
        message: "Student not found",
      },
    });
  }

  return res.status(200).send({
    data: deletedStudent,
    message: "Student deleted successfully",
  });
};

const deleteStudentHandler = handler;
export default deleteStudentHandler;
