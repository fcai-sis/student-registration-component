import { InferSchemaType } from "mongoose";
import { stagedStudentSchema } from "../models/stagedStudents.model.js";

type StagedStudentType = InferSchemaType<typeof stagedStudentSchema>;

export default StagedStudentType;
