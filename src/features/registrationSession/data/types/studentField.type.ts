import { IStudent } from "@fcai-sis/shared-models";

/**
 * A field in the Student model.
 *
 * Apparently, this was used all over the codebase, so...
 */
type StudentField = keyof IStudent;

export default StudentField;
