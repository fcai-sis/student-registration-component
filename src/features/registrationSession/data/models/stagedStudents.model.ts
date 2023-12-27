import mongoose, { Schema } from "mongoose";
import { registrationSessoinModelName } from "./registrationSession.model";

export const stagedStudentSchema = new Schema({
  student: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  registrationSessionId: {
    type: Schema.Types.ObjectId,
    ref: registrationSessoinModelName,
    required: true,
  },
});

export const stagedStudentModelName = "StagedStudents";

const StagedStudentModel = mongoose.model(
  stagedStudentModelName,
  stagedStudentSchema
);

export default StagedStudentModel;
