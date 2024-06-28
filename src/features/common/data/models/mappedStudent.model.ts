import mongoose from "mongoose";

import {
  GenderEnum,
  IStudent,
  NationalityEnum,
  ReligionEnum,
  ScientificDivisionEnum,
  arabicValidator,
  betweenValidator,
  integerValidator,
  numericStringValidator,
} from "@fcai-sis/shared-models";

export const mappedStudentModelName = "MappedStudent";
const nationalityMapping: { [key: number]: string } = {
  1: "EGYPTIAN",
  2: "BAHRAINI",
  3: "COMORAN",
  4: "DJIBOUTIAN",
  5: "ALGERIAN",
  6: "IRAQI",
  7: "JORDANIAN",
  8: "KUWAITI",
  9: "LEBANESE",
  10: "LIBYAN",
  11: "MAURITANIAN",
  12: "MOROCCAN",
  13: "OMANI",
  14: "PALESTINIAN",
  15: "QATARI",
  16: "SAUDI",
  17: "SOMALI",
  18: "SUDANESE",
  19: "SYRIAN",
  20: "TUNISIAN",
  21: "EMIRATI",
  22: "YEMENI",
  23: "FOREIGN",
};

export type StudentWithoutUser = Omit<
  IStudent,
  keyof mongoose.Document | "user"
>;

const mappedStudentSchema = new mongoose.Schema<StudentWithoutUser>({
  studentId: {
    type: String,
    required: [true, "Student ID is required"],
    unique: true,
    validate: {
      validator: (v: string) => numericStringValidator("Student ID", v),
      message: "Student ID must be a valid ID",
    },
  },
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    validate: {
      validator: (v: string) => arabicValidator("Full Name", v),
      message: "Full name must contain only Arabic letters (أ - ي)",
    },
  },
  scientificDivision: {
    type: String,
    required: [true, "Scientific division is required"],
    enum: ScientificDivisionEnum,
    set: (v: number | string) => {
      const value = typeof v === "number" ? v : parseInt(v);
      switch (value) {
        case 1:
          return ScientificDivisionEnum[0];
        case 2:
          return ScientificDivisionEnum[1];
        default:
          return undefined;
      }
    },
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: GenderEnum,
    set: (v: number | string) => {
      const value = typeof v === "number" ? v : parseInt(v);
      switch (value) {
        case 1:
          return GenderEnum[0];
        case 2:
          return GenderEnum[1];
        default:
          return undefined;
      }
    },
  },
  religion: {
    type: String,
    required: [true, "Religion is required"],
    enum: ReligionEnum,
    set: (v: number | string) => {
      const value = typeof v === "number" ? v : parseInt(v);
      switch (value) {
        case 1:
          return ReligionEnum[0];
        case 2:
          return ReligionEnum[1];
        case 3:
          return ReligionEnum[2];
        default:
          return undefined;
      }
    },
  },
  nationalId: {
    type: String,
    required: [true, "National ID is required"],
    validate: {
      validator: (v: string) => numericStringValidator("National ID", v, 14),
      message: "National ID must be a 14-digit number",
    },
  },
  administration: {
    type: String,
    required: [true, "Administration is required"],
    validate: {
      validator: (v: string) => arabicValidator("Administration", v),
    },
  },
  directorate: {
    type: String,
    required: [true, "Directorate is required"],
    validate: {
      validator: (v: string) => arabicValidator("Directorate", v),
      message: "Directorate must contain only letters and Arabic characters",
    },
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    validate: {
      validator: (v: string) => numericStringValidator("Phone Number", v, 11),
      message: "Phone number must be an 11-digit number",
    },
  },
  educationType: {
    type: String,
    required: [true, "Education type is required"],
    validate: {
      validator: (v: string) => arabicValidator("Education Type", v),
    },
  },
  birthYear: {
    type: Number,
    required: [true, "Birth year is required"],
    validate: {
      validator: (value: number) => {
        integerValidator("Birth Year", value);
        betweenValidator("Birth Year", value, 1900, new Date().getFullYear());
      },
      message: "Birth year must be a number between 1900 and 2021",
    },
  },
  birthMonth: {
    type: Number,
    required: [true, "Birth month is required"],
    validate: {
      validator: (value: number) => {
        integerValidator("Birth Month", value);
        betweenValidator("Birth Month", value, 1, 12);
      },
      message: "Birth month must be a number between 1 and 12",
    },
  },
  birthDay: {
    type: Number,
    required: [true, "Birth day is required"],
    validate: {
      validator: (value: number) => {
        integerValidator("Birth Day", value);
        betweenValidator("Birth Day", value, 1, 31);
      },
      message: "Birth day must be a number between 1 and 31",
    },
  },
  birthPlace: {
    type: String,
    required: [true, "Birth place is required"],
    validate: {
      validator: (v: string) => arabicValidator("Birth Place", v),
    },
  },
  governorateId: {
    type: Number,
    required: [true, "Governorate ID is required"],
    validate: {
      validator: (v: number) => integerValidator("Governorate ID", v),
      message: "Governorate ID must be a number",
    },
  },
  nationality: {
    type: String,
    required: [true, "Nationality is required"],
    enum: NationalityEnum,
    set: (v: number | string) => {
      const value = typeof v === "number" ? v : parseInt(v);
      const nationality = nationalityMapping[value];
      if (!nationality) {
        throw new Error("Invalid numeric value for nationality");
      }
      return nationality;
    },
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
});

const MappedStudentModel = mongoose.model<StudentWithoutUser>(
  mappedStudentModelName,
  mappedStudentSchema
);

export default MappedStudentModel;
