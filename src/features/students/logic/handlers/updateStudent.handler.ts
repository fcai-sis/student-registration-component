import { Request, Response } from "express";
import {
  GenderEnumType,
  NationalityEnumType,
  ReligionEnumType,
  ScientificDivision,
  StudentModel,
} from "@fcai-sis/shared-models";

type UpdateHandlerRequest = Request<
  {
    studentId: string;
  },
  {},
  {
    fullName?: string;
    scientificDivision?: ScientificDivision;
    gender?: GenderEnumType;
    religion?: ReligionEnumType;
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
    nationality?: NationalityEnumType;
    address?: string;
  }
>;

const handler = async (req: UpdateHandlerRequest, res: Response) => {
  const studentId = req.params.studentId;
  const {
    fullName,
    scientificDivision,
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
  const student = await StudentModel.findOneAndUpdate(
    { studentId },
    {
      ...(fullName && { fullName }),
      ...(scientificDivision && { scientificDivision }),
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
    { new: true, runValidators: true }
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

  const response = {
    student: {
      ...student.toObject(),
    },
  };

  return res.status(200).json(response);
};

const updateStudentHandler = handler;
export default updateStudentHandler;
