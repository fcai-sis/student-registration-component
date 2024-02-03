import logger from "../../../../core/logger";
import ExcelRow from "../../../registrationSession/data/types/excelRow.type";
import StudentType from "../../../registrationSession/data/types/student.type";
import StudentField from "../../../registrationSession/data/types/studentField.type";
import HasStudentFields from "../../../registrationSession/data/types/hasStudentFields.type";

/**
 * Gets the fields of the Student model as an array of strings.
 *
 * This is just to avoid repeating `as StudentField[]` all over the codebase.
 *
 * @param object An object that has the fields of the Student model, like a student object or an Excel mapping.
 * @returns The fields of the Student model as an array of strings.
 */
export const getStudentKeys = (object: HasStudentFields): StudentField[] =>
  Object.keys(object) as StudentField[];

/**
 * Takes a student row from the Excel file and a mapping and returns a student object.
 *
 * @param row A row from the Excel file.
 * @param mapping A mapping of the Excel columns to the Student fields.
 * @returns A student object.
 */
export const rowToStudent = (row: ExcelRow, mapping: Record<StudentField, string>): StudentType => {
  logger.debug(`Row ${JSON.stringify(row)}`);
  logger.debug(`Mapping ${JSON.stringify(mapping)}`);

  const student: Partial<StudentType> = {};
  Object.entries(mapping).forEach(([field, column]) => {
    student[field as StudentField] = row[column];
  });

  return student as StudentType;
}
