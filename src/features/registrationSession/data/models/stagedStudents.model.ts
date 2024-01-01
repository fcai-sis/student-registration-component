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
  // backup: {
  //   any: {
  //     type: Schema.Types.Mixed,how to reset the zoom in in visual studio
  //     default: null,
  //   },
  // },
});

export const stagedStudentModelName = "StagedStudents";

const StagedStudentModel = mongoose.model(
  stagedStudentModelName,
  stagedStudentSchema
);

export default StagedStudentModel;
