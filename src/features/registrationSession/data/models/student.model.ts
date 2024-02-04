import mongoose, { Schema } from "mongoose";

import StudentType from "../types/student.type";

const studentSchema: Schema = new Schema<StudentType>({
  studentId: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        // studentId must be a string of digits
        return !/\D/.test(value);
      },
      message: "Student ID must be a number",
    },
  },

  fullName: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        // name must contain only Arabic characters and allow whitespace
        return /^[\p{Script=Arabic}\s]+$/gmu.test(value);
      },
      message: "Full name must contain only Arabic letters (أ - ي)",
    },
  },

  // Group code can only be 1 or 2
  groupCode: {
    type: Boolean,
    required: true,
    set: function (value: any) {
      // convert the string to a number if possible
      const parsedValue = parseInt(String(value), 10);
      // check if the value is a number before mapping
      if (typeof parsedValue === "number" && !isNaN(parsedValue)) {
        // map 1 to true and 2 to false
        return parsedValue === 1;
      } else {
        // for now, let's default to undefined so that it's not mistaken for a boolean
        return undefined;
      }
    },
    validate: {
      validator: function (value: boolean) {
        // Validate if it's a boolean (true or false)
        return typeof value === "boolean";
      },
      message: "Group code must be a boolean value",
    },
  },
  gender: {
    type: Boolean,
    required: true,
    set: function (value: any) {
      // convert the string to a number if possible
      const parsedValue = parseInt(String(value), 10);
      // check if the value is a number before mapping
      if (typeof parsedValue === "number" && !isNaN(parsedValue)) {
        // map 1 to true and 2 to false
        return parsedValue === 1;
      } else {
        // for now, let's default to undefined so that it's not mistaken for a boolean
        return undefined;
      }
    },
    validate: {
      validator: function (value: boolean) {
        // Validate if it's a boolean (true or false)
        return typeof value === "boolean";
      },
      message: "Gender must be specified as either male (1) or female (2)",
    },
  },
  religion: {
    type: String,
    required: true,
    enum: ["muslim", "christian", "other"],
    set: function (value: number | string) {
      // convert the string to a number if possible
      const parsedValue = parseInt(String(value), 10);

      // Map numbers to corresponding strings
      if (typeof parsedValue === "number") {
        switch (parsedValue) {
          case 1:
            return "muslim";
          case 2:
            return "christian";
          case 3:
            return "other";
          default:
            return undefined;
        }
      } else {
        // If the value is already a string, leave it unchanged
        return value;
      }
    },
    validate: {
      validator: function (value: string) {
        return ["muslim", "christian", "other"].includes(value);
      },
      message:
        "Religion must be one of the following: muslim, christian, other",
    },
  },
  nationalId: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        // nationalId must be a string of 14 digits
        return /^\d{14}$/.test(value);
      },
      message: "National ID must be a 14-digit number",
    },
  },
  administration: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        // administration must contain only letters and Arabic characters and allow whitespace
        return /^[\p{Script=Arabic}\s]+$/gmu.test(value);
      },
      message: "Administration must contain only letters and Arabic characters",
    },
  },
  directorate: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        // directorate must contain only letters and Arabic characters and allow whitespace
        return /^[\p{Script=Arabic}\s]+$/gmu.test(value);
      },
      message: "Directorate must contain only letters and Arabic characters",
    },
  },
  phoneNumber: {
    type: String,
    required: false,
    // validate: {
    //   validator: function (value: string) {
    //     // phoneNumber must be a string of 11 digits
    //     return /^\d{11}$/.test(value);
    //   },
    //   message: "Phone number must be an 11-digit number",
    // },
    validate: {
      // just make sure tis a number till we figure out the deal with empty fields
      validator: function (value: string) {
        return !isNaN(Number(value));
      },
      message: "Phone number must be numeric",
    },
    default: undefined,
  },
  educationType: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        // educationType must contain only letters and Arabic characters and allow whitespace
        return /^[\p{Script=Arabic}\s]+$/gmu.test(value);
      },
      message: "Education type must contain only letters and Arabic characters",
    },
  },
  birthYear: {
    type: Number,
    required: true,
    validate: {
      validator: function (value: number) {
        // birthYear must be a number between 1900 and 2021
        return value >= 1900 && value <= 2021;
      },
      message: "Birth year must be a number between 1900 and 2021",
    },
  },
  birthMonth: {
    type: Number,
    required: true,
    validate: {
      validator: function (value: number) {
        // birthMonth must be a number between 1 and 12
        return value >= 1 && value <= 12;
      },
      message: "Birth month must be a number between 1 and 12",
    },
  },
  birthDay: {
    type: Number,
    required: true,
    validate: {
      validator: function (value: number) {
        // birthDay must be a number between 1 and 31
        return value >= 1 && value <= 31;
      },
      message: "Birth day must be a number between 1 and 31",
    },
  },
  governorateId: {
    type: Number,
    required: true,
    validate: {
      validator: function (value: number) {
        // governorateId must be a number

        return !isNaN(value);
      },
      message: "Governorate ID must be a number",
    },
  },
  nationality: {
    type: String,
    required: true,
    set: function (value: string | number) {
      // convert the string to a number if possible
      const parsedValue = parseInt(String(value), 10);
      // Map numbers to corresponding strings
      if (typeof parsedValue === "number") {
        switch (parsedValue) {
          case 1:
            return "egyptian";

          default:
            return "foreigner";
        }
      } else {
        // If the value is already a string, leave it unchanged
        return parsedValue;
      }
    },
    validate: {
      validator: function (value: string) {
        return ["egyptian", "foreigner"].includes(value);
      },
      message: "Nationality must be 'egyptian' or 'foreigner'",
    },
  },

  address: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        // address must contain only letters, numbers and Arabic characters and allow whitespace, and allow / and - characters
        // commented out because ALL THE ADDRESSES ARE ALL OVER THE PLACE
        // return /^[^A-Za-z]+$/gmu.test(value);
      },
      message:
        "Address must contain only letters, numbers, and Arabic characters",
    },
  },
});

const StudentModel = mongoose.model<StudentType>("Student", studentSchema);

export default StudentModel;
