import { StudentWithoutUser } from "features/common/data/models/mappedStudent.model";
import ExcelMapping from "../data/types/mapping.type";

/**
 * Maps the fields of the staged student to the fields of the student using the mapping object and the excel columns headers
 * @param stagedStudent The staged student to map
 * @param mapping The mapping object
 * @param excelColumnsHeaders The excel columns headers
 */
export const mapStagedStudent = (
  stagedStudent: any,
  mapping: ExcelMapping
): StudentWithoutUser => {
  const mappedStudent: Partial<StudentWithoutUser> = {};

  // for each value in the mapping object, map the value from the staged student to the mapped student
  // stagedStudent example: { excelColumn1: "value1", excelColumn2: "value2" }
  // mapping example: { studentId: "excelColumn1", fullName: "excelColumn2" }
  // mappedStudent example: { studentId: "value1", fullName: "value2" }
  for (const [key, value] of Object.entries(mapping)) {
    console.log(key, value);
    if (stagedStudent[value]) {
      mappedStudent[key as keyof ExcelMapping] = stagedStudent[value];
    }
  }

  return mappedStudent as StudentWithoutUser;
};
