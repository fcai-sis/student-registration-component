import StudentField, { MappedStudentField } from "./studentField.type";

/**
 * An object that has the fields of the Student model.
 */
type HasStudentFields = {
  [key in StudentField]: any;
};

export type HasMappedStudentFields = {
  [key in MappedStudentField]: any;
};

export default HasStudentFields;
