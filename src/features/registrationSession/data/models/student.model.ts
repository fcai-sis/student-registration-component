import mongoose, { Schema } from "mongoose";

import StudentType from "../types/student.type";

const studentSchema: Schema = new Schema<StudentType>({
  studentId: {
    type: Number,
    required: true,
    min: 20200000,
    max: 20300000,
    validate: {
      validator: function (value: number) {
        return value > 0; // this is probably useless but yahoo
      },
      message: "Student ID must be greater than 0",
    },
  },
  fullName: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        // full name must contain only letters (a-z, A-Z, Arabic)
        if (value.match(/^[a-zA-Z\u0600-\u06FF\s]+$/)) {
          return true;
        }
      },
      message: "Full name must contain only letters (a-z, أ - ي)",
    },
  },
  address: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        // address must contain only letters, numbers and Arabic characters
        if (value.match(/^[a-zA-Z0-9\u0600-\u06FF\s]+$/)) {
          return true;
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
