import mongoose, { Schema } from "mongoose";

// The student interface for better dev experience
export type IStudentModel = {
  studentId: string;
  name: string;
  address: string;
};

// Student in the database
const studentSchema: Schema = new Schema<IStudentModel>({
  studentId: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
});

const StudentModel = mongoose.model<IStudentModel>("Student", studentSchema);

export default StudentModel;
