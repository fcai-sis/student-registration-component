import StudentType from "./student.type";

/**
 * A field in the Student model.
 *
 * Apparently, this was used all over the codebase, so...
 */
type StudentField = keyof StudentType;

export default StudentField;
