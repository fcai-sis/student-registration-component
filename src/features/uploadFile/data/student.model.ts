import mongoose, { Schema } from "mongoose";
type IStudentModel = {
  name: string;
  email: string;
  gpa: number;
  address: string;
}

const studentSchema: Schema = new Schema<IStudentModel>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  gpa: { type: Number, required: true },
  address: { type: String, required: true },
});

const StudentModel = mongoose.model<IStudentModel>("Student", studentSchema);

export default StudentModel;
