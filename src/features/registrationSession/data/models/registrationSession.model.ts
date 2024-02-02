import mongoose, { InferSchemaType, Schema } from "mongoose";

import StudentModel from "../../../common/data/models/student.model";
import unsetMapping from "../types/unsetMapping.type";
import HasStudentFields from "../types/hasStudentFields.type";
import { getStudentKeys } from "../../../common/logic/utils/mapping.utils";

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
      validator: function(mapping: HasStudentFields) {
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

export type RegistrationSessionType = InferSchemaType<typeof registrationSessionSchema>;

const RegistrationSessionModel = mongoose.model<RegistrationSessionType>(
  registrationSessoinModelName,
  registrationSessionSchema
);

export default RegistrationSessionModel;
