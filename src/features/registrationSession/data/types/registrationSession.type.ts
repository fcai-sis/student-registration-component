import { InferSchemaType } from "mongoose";
import { registrationSessionSchema } from "../models/registrationSession.model";

/**
 * Represents a student registration session.
 *
 * A registration session starts once the employee uploads an excel file containing the students' data.
 * A default mapping is created for the session, and the employee can modify it before committing the session.
 */
type RegistrationSessionType = InferSchemaType<
  typeof registrationSessionSchema
>;

export default RegistrationSessionType;
