import StudentField from "../../data/types/studentField.type.js";

/**
 * Gets the fields of the Student model as an array of strings.
 *
 * This is just to avoid repeating `as StudentField[]` all over the codebase.
 *
 * @param object An object that has the fields of the Student model, like a student object or an Excel mapping.
 * @returns The fields of the Student model as an array of strings.
 */
export const getStudentKeys = (object: any): StudentField[] =>
  Object.keys(object) as StudentField[];
