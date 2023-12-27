import mongoose, { Schema } from "mongoose";
import { registrationSessoinModelName } from "./registrationSession.model.js";

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

export const stagedStudentsModelName = "StagedStudents";

const StagedStudentsModel = mongoose.model(
  stagedStudentsModelName,
  stagedStudentSchema
);

export default StagedStudentsModel;
