import mongoose, { Schema } from "mongoose";

import StudentType from "../types/student.type";

const studentSchema: Schema = new Schema<StudentType>({
  studentId: {
    type: String,
    unique: true,
    validate: {
      validator: function(value: string) {
        // studentId must be a string of digits
        if (value.match(/\D/)) {
          return false;
        }
      },
      message: "Student ID must be a number",
    },
  },
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    validate: {
      validator: function(value: string) {
        // name must contain only Arabic characters and allow whitespace
        if (value.match(/[^أ-ي\s]/i)) {
          return false;
        }
      },
      message: "Full name must contain only Arabic letters (أ - ي)",
    },
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    validate: {
      validator: function(value: string) {
        // address must contain only letters, numbers and Arabic characters and allow whitespace
        if (value.match(/[^a-z0-9أ-ي\s]/i)) {
          return false;
        }
      },
      message:
        "Address must contain only letters, numbers and Arabic characters",
    },
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "pending", "inactive"],
    default: "pending",
    validate: {
      validator: function(value: string) {
        return ["active", "pending", "inactive"].includes(value);
      },
      message:
        "Status must be one of the following: pending, accepted, rejected",
    },
  },
});

const StudentModel = mongoose.model<StudentType>("Student", studentSchema);
export const PreinsertionStudentModel = mongoose.model<StudentType>("PreinsertionStudent", studentSchema);

export default StudentModel;
