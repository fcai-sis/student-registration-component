import StudentField from "./studentField.type.js";

/**
 * An object that maps the fields of the Student model to the columns of the Excel file.
 *
 * It has all the Student model fields as keys, and the Excel file column names as values.
 */
type ExcelMapping = {
  [Field in StudentField]: string;
};

export default ExcelMapping;
