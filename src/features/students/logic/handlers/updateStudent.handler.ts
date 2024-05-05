import { Request, Response } from "express";
import { StudentModel } from "@fcai-sis/shared-models";

//TODO: Create middleware to check for if user authorized to update student
type UpdateHandlerRequest = Request<
  {
    studentId: string;
  },
  {},
  { fullName?: string; address?: string }
>;

const updateStudentHandler = async (
  req: UpdateHandlerRequest,
  res: Response
) => {
  const studentId = req.params.studentId;
  // Check if the student exists
  const student = await StudentModel.findByIdAndUpdate(
    studentId,
    { ...req.body },
    { new: true }
  );

  if (!student) {
    return res.status(404).json({
      error: {
        message: "Student not found",
      },
    });
  }

  const response = {
    student: {
      _id: student._id,
      fullName: student.fullName,
      address: student.address,
    },
  };

  return res.status(200).json(response);
};

export default updateStudentHandler;
