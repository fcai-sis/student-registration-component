import StudentModel from "../models/student.model";
import StudentType from "../types/student.type";

/**
 * Validate the fields before saving it into the actual model
 */

// Define a mapping of field names to their expected types
const fieldTypes: { [key: string]: string } = {
  studentId: "number",
  fullName: "string",
  address: "string",
  // guessing we add more fields here as we change it
};

StudentModel.schema.pre("insertMany", function (next) { // either do this before "insertMany" or "save"
  // ensure types match
  const student = this

  // iterate over the fields of the student
  for (const field in student) {
    // if the field is in the mapping and its type doesn't match the expected type
    if (field in fieldTypes && typeof student[field] !== fieldTypes[field]) {
      next(new Error(`Field ${field} must be a ${fieldTypes[field]}`));
      return;
    }
  }

  next();
});
