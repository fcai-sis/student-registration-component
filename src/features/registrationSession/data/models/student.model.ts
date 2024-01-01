import mongoose, { Schema } from "mongoose";

import StudentType from "../types/student.type";

const studentSchema: Schema = new Schema<StudentType>({
  studentId: {
    type: String,
    required: true,
    min: 20200000,
    max: 20300000,
    validate: {
      validator: function (value: string) {
        // studentId must be a number
        if (isNaN(Number(value))) {
          return false;
        }
      },
      message: "Student ID must be a number",
    },
  },
  fullName: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        // name must contain only letters and Arabic characters
        if (value.match(/[^أ-ي]/i)) {
          return false;
        }
      },
      message: "Full name must contain only Arabic letters (أ - ي)",
    },
  },
  address: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        // address must contain only letters, numbers and Arabic characters
        if (value.match(/[^a-z0-9أ-ي]/i)) {
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
      validator: function (value: string) {
        return ["active", "pending", "inactive"].includes(value);
      },
      message:
        "Status must be one of the following: pending, accepted, rejected",
    },
  },
});

const StudentModel = mongoose.model<StudentType>("Student", studentSchema);

export default StudentModel;
