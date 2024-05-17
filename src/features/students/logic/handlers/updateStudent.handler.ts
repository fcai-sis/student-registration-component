import { Request, Response } from "express";
import { StudentModel } from "@fcai-sis/shared-models";

//TODO: Create middleware to check for if user authorized to update student
type UpdateHandlerRequest = Request<
  {
    studentId: string;
  },
  {},
  {
    fullName?: string;
    groupCode?: boolean;
    gender?: "male" | "female" | "other";
    religion?: "christian" | "muslim" | "other";
    nationalId?: string;
    administration?: string;
    directorate?: string;
    phoneNumber?: string;
    educationType?: string;
    birthYear?: number;
    birthMonth?: number;
    birthDay?: number;
    birthPlace?: string;
    governorateId?: string;
    nationality?: "egyptian" | "foreigner";
    address?: string;
  }
>;

const handler = async (req: UpdateHandlerRequest, res: Response) => {
  const studentId = req.params.studentId;
  const {
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
  // Check if the student exists
  const student = await StudentModel.findByIdAndUpdate(
    studentId,
    {
      ...(fullName && { fullName }),
      ...(groupCode && { groupCode }),
      ...(gender && { gender }),
      ...(religion && { religion }),
      ...(nationalId && { nationalId }),
      ...(administration && { administration }),
      ...(directorate && { directorate }),
      ...(phoneNumber && { phoneNumber }),
      ...(educationType && { educationType }),
      ...(birthYear && { birthYear }),
      ...(birthMonth && { birthMonth }),
      ...(birthDay && { birthDay }),
      ...(birthPlace && { birthPlace }),
      ...(governorateId && { governorateId }),
      ...(nationality && { nationality }),
      ...(address && { address }),
    },
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
      ...student.toObject(),
    },
  };

  return res.status(200).json(response);
};

const updateStudentHandler = handler;
export default updateStudentHandler;
