import mongoose from "mongoose";
import { registrationSessionModelName } from "./registrationSession.model";
import { foreignKey } from "@fcai-sis/shared-models";

export const stagedStudentModelName = "StagedStudents";

export interface IStagedStudent extends mongoose.Document {
  student: any;
  registrationSessionId: mongoose.Schema.Types.ObjectId;
}

export type StagedStudentType = Omit<IStagedStudent, keyof mongoose.Document>;

export const stagedStudentSchema = new mongoose.Schema<IStagedStudent>({
  student: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  registrationSessionId: foreignKey(registrationSessionModelName),
});

const StagedStudentModel =
  mongoose.models[stagedStudentModelName] ||
  mongoose.model<IStagedStudent>(stagedStudentModelName, stagedStudentSchema);

export default StagedStudentModel;
