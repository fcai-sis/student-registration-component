import mongoose from "mongoose";
import unsetMapping from "../types/unsetMapping.type";
import { HasMappedStudentFields } from "../types/hasStudentFields.type";
import { getMappedStudentKeys } from "../../../common/logic/utils/mapping.utils";
import mappableFields from "./constants/mappableFields";

export const registrationSessionModelName = "RegistrationSession";

export interface IRegistrationSession extends mongoose.Document {
  active: boolean;
  startDate: Date;
  endDate?: Date;
  mapping: HasMappedStudentFields;
  excelColumnsHeaders: string[];
}

export const registrationSessionSchema = new mongoose.Schema({
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
      validator: function (mapping: HasMappedStudentFields) {
        const mappingKeys = getMappedStudentKeys(mapping);
        const studentModelFields = mappableFields;
        return mappingKeys.every((key) => studentModelFields.includes(key));
      },
    },
    default: Object.fromEntries(
      mappableFields.map((key) => [key, unsetMapping])
    ),
  },
  excelColumnsHeaders: {
    type: [String],
    required: true,
    default: [],
  },
});

const RegistrationSessionModel =
  mongoose.models[registrationSessionModelName] ||
  mongoose.model<IRegistrationSession>(
    registrationSessionModelName,
    registrationSessionSchema
  );

export default RegistrationSessionModel;
