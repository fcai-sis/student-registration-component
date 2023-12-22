import StudentField from "./studentField.type.js";

/**
 * An object that has the fields of the Student model.
 */
type HasStudentFields = {
  [key in StudentField]: any;
};

export default HasStudentFields;
