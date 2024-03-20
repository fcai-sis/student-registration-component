import mongoose, { Schema } from "mongoose";

import StudentType from "../types/student.type";

const mappedStudentSchema: Schema = new Schema<StudentType>({
  studentId: {
    type: String,
    required: [true, "Student ID is required"],
    unique: true,
    validate: {
      validator: function (value: string) {
        // pattern : string must start with current year and contain only digits
        return new RegExp(`^${new Date().getFullYear()}\\d{4}$`).test(value);
      },
      message: "Student ID must be a valid ID",
    },
  },

  fullName: {
    type: String,
    required: [true, "Full name is required"],
    validate: {
      validator: function (value: string) {
        // name must contain only Arabic characters and allow whitespace
        return /^[\p{Script=Arabic}\s]+$/gmu.test(value);
      },
      message: "Full name must contain only Arabic letters (أ - ي)",
    },
  },
  // refers to علمي علوم او رياضة
  // Group code can only be 1 or 2
  groupCode: {
    type: Boolean,
    required: [true, "Group code is required"],
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
    type: String,
    enum: ["male", "female", "other"],
    required: [true, "Gender is required"],
    set: function (value: number | string) {
      // convert the string to a number if possible
      const parsedValue = parseInt(String(value), 10);

      // Map numbers to corresponding strings
      if (typeof parsedValue === "number") {
        switch (parsedValue) {
          case 1:
            return "male";
          case 2:
            return "female";
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
        return ["male", "female", "other"].includes(value);
      },
      message: "Gender must be one of the following: male, female, other",
    },
  },
  religion: {
    type: String,
    required: [true, "Religion is required"],
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
    required: [true, "National ID is required"],
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
    required: [true, "Administration is required"],
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
    required: [true, "Directorate is required"],
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
    required: [true, "Phone number is required"],
    validate: {
      validator: function (value: string) {
        // phoneNumber must be a string of 11 digits
        return /^\d{11}$/.test(value);
      },
      message: "Phone number must be an 11-digit number",
    },
    // TODO: Remove this default value
    default: "01552452691",
  },
  educationType: {
    type: String,
    required: [true, "Education type is required"],
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
    required: [true, "Birth year is required"],
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
    required: [true, "Birth month is required"],
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
    required: [true, "Birth day is required"],
    validate: {
      validator: function (value: number) {
        // birthDay must be a number between 1 and 31
        return value >= 1 && value <= 31;
      },
      message: "Birth day must be a number between 1 and 31",
    },
  },
  birthPlace: {
    type: String,
    required: [true, "Birth place is required"],
    validate: {
      validator: function (value: string) {
        // birthPlace must contain only letters and Arabic characters and allow whitespace
        return /^[\p{Script=Arabic}\s]+$/gmu.test(value);
      },
      message: "Birth place must contain only letters and Arabic characters",
    },
  },
  governorateId: {
    type: Number,
    required: [true, "Governorate ID is required"],
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
    required: [true, "Nationality is required"],
    set: function (value: string | number) {
      // convert the string to a number if possible
      const parsedValue = parseInt(String(value), 10);
      // Map numbers to corresponding strings

      // TODO: figure out nationality enums and modify this
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
    required: [true, "Address is required"],
    validate: {
      validator: function (value: string) {
        // ensure the address is not empty and not just whitespace
        return !!value && /\S/.test(value);
      },
      message: "Address cannot be empty",
    },
  },
});

const MappedStudentModel = mongoose.model<StudentType>(
  "MappedStudent",
  mappedStudentSchema
);

export default MappedStudentModel;
