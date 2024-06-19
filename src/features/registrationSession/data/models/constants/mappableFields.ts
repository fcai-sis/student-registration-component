import { MappedStudentField } from "../../types/studentField.type";

/**
 * The fields that can be mapped from the registration session to the student model
 * */
const mappableFields: MappedStudentField[] = [
  "address",
  "administration",
  "birthDay",
  "birthMonth",
  "birthPlace",
  "birthYear",
  "directorate",
  "educationType",
  "fullName",
  "gender",
  "governorateId",
  "nationalId",
  "nationality",
  "phoneNumber",
  "religion",
  "scientificDivision",
  "studentId",
];

export default mappableFields;
