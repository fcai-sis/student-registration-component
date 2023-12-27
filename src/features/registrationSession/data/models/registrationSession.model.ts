import mongoose, { Schema } from "mongoose";

import StudentModel from "./student.model.js";
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
      validator: function (mapping: HasStudentFields) {
        const mappingKeys = getStudentKeys(mapping);
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
});

export const registrationSessoinModelName = "RegistrationSession";

const RegistrationSessionModel = mongoose.model(
  registrationSessoinModelName,
  registrationSessionSchema
);

export default RegistrationSessionModel;
