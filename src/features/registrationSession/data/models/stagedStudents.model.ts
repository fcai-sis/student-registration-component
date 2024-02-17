import mongoose, { Schema } from "mongoose";
import { registrationSessionModelName } from "./registrationSession.model";

export const stagedStudentSchema = new Schema({
  student: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  registrationSessionId: {
    type: Schema.Types.ObjectId,
    ref: registrationSessionModelName,
    required: true,
  },
});

export const stagedStudentModelName = "StagedStudents";

const StagedStudentModel = mongoose.model(
  stagedStudentModelName,
  stagedStudentSchema
);

export default StagedStudentModel;
