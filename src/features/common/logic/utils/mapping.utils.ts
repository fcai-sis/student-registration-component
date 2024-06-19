import ExcelRow from "../../../registrationSession/data/types/excelRow.type";
import StudentField, {
  MappedStudentField,
} from "../../../registrationSession/data/types/studentField.type";
import { HasMappedStudentFields } from "../../../registrationSession/data/types/hasStudentFields.type";
import { StudentWithoutUser } from "features/common/data/models/mappedStudent.model";

/**
 * Gets the fields of the Student model as an array of strings.
 *
 * This is just to avoid repeating `as StudentField[]` all over the codebase.
 *
 * @param object An object that has the fields of the Student model, like a student object or an Excel mapping.
 * @returns The fields of the Student model as an array of strings.
 */
export const getMappedStudentKeys = (
  object: HasMappedStudentFields
): MappedStudentField[] => Object.keys(object) as MappedStudentField[];

/**
 * Takes a student row from the Excel file and a mapping and returns a student object.
 *
 * @param row A row from the Excel file.
 * @param mapping A mapping of the Excel columns to the Student fields.
 * @returns A student object.
 */
export const rowToStudent = (
  row: ExcelRow,
  mapping: Record<StudentField, string>
): StudentWithoutUser => {
  const student: Partial<StudentWithoutUser> = {};
  Object.entries(mapping).forEach(([field, column]) => {
    student[field as MappedStudentField] = row[column];
  });

  return student as StudentWithoutUser;
};
