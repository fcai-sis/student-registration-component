import mongoose, { Schema } from "mongoose";

import StudentModel from "./student.model.js";
import ExcelMapping from "../types/mapping.type.js";
import unsetMapping from "../types/unsetMapping.type.js";
import HasStudentFields from "../types/hasStudentFields.type.js";
import { getStudentKeys } from "../../../common/logic/utils/mapping.utils.js";

export const registrationSessionSchema = new Schema({
  active: {
    type: Boolean,
    required: true,
    default: true,
  },

  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },

  endDate: {
    type: Date,
  },

  mapping: {
    type: Object,
    validate: {
      validator: function (mapping: Map<String, String>) {
        const mappingKeys = getStudentKeys(mapping as unknown as ExcelMapping);
        const studentModelFields = getStudentKeys(
          StudentModel.schema.obj as HasStudentFields
        );

        return studentModelFields.every((field) => mappingKeys.includes(field));
      },
    },
    default: Object.fromEntries(
      getStudentKeys(StudentModel.schema.obj as HasStudentFields).map((key) => [
        key,
        unsetMapping,
      ])
    ),
  },

  excelColumnsHeaders: {
    type: [String],
    required: true,
    default: [],
  },

  stagedStudents: {
    type: [Object],
    required: true,
    default: [],
  },
});

const RegistrationSessionModel = mongoose.model(
  "RegistrationSession",
  registrationSessionSchema
);

export default RegistrationSessionModel;
