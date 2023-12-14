import mongoose, { Schema } from "mongoose";

/**
 * Student model in the database.
 */
export type StudentType = {
  studentId: string;
  fullName: string;
  address: string;
};

const studentSchema: Schema = new Schema<StudentType>({
  studentId: { type: String, required: true },
  fullName: { type: String, required: true },
  address: { type: String, required: true },
});

const StudentModel = mongoose.model<StudentType>("Student", studentSchema);

export default StudentModel;
