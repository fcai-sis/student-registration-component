import mongoose, { Schema } from "mongoose";

import StudentType from "../types/student.type.js";

const studentSchema: Schema = new Schema<StudentType>({
  studentId: { type: Number, required: true },
  fullName: { type: String, required: true },
  address: { type: String, required: true },
});

const StudentModel = mongoose.model<StudentType>("Student", studentSchema);

export default StudentModel;
