import { StudentType } from "@fcai-sis/shared-models";
import { StudentWithoutUser } from "features/common/data/models/mappedStudent.model";

/**
 * A field in the Student model.
 *
 * Apparently, this was used all over the codebase, so...
 */
type StudentField = keyof StudentType;
export type MappedStudentField = keyof StudentWithoutUser;

export default StudentField;
