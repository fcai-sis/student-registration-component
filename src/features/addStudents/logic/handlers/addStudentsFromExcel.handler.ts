import xlsx from "xlsx";
import { Request, Response } from "express";

import ExcelRow from "../../data/types/excelRow.type.js";
import { getStudentKeys } from "../utils/mapping.utils.js";
import StudentType from "../../data/types/student.type.js";
import ExcelMapping from "../../data/types/mapping.type.js";
import StudentModel from "../../data/models/student.model.js";
import { getStudentsWorkSheet } from "../utils/excel.utils.js";

type HandlerRequest = Request<
  {},
  {},
  { workbook: xlsx.WorkBook; mapping: ExcelMapping }
>;

/**
 * Uploads an excel file containing student data to the database.
 */
export default async (req: HandlerRequest, res: Response) => {
  const workbook = req.body.workbook;
  const worksheet = getStudentsWorkSheet(workbook);
  const excelRows = xlsx.utils.sheet_to_json<ExcelRow>(worksheet);

  const mapping = req.body.mapping;

  // Prepare the students to be inserted into the database by mapping each excel column
  // to its corresponding field in the Student model for all rows in the excel file
  const students: StudentType[] = excelRows.map(
    (row) =>
      getStudentKeys(mapping).reduce(
        // Loop through all keys in the mapping
        (student, key) => {
          student[key] = row[mapping[key]]; // For each key, map the excel field to the corresponding Student model field
          return student; // Return the student object with the new field for the next iteration
        },
        {} as Partial<StudentType> // The initial value of the student object is an empty object
      ) as StudentType // Cast the student object to the StudentType
  );

  try {
    // Insert the students into the database
    const result = await StudentModel.insertMany(students);

    res
      .status(200)
      .json({ message: `${result.length} students uploaded successfully` });
  } catch (error: any) {
    // An example of a ValidationError that might happen is when a required field in the Student model
    // is mapped to an excel field that has null values in some rows
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );

      res.status(400).json({ error: "student-validation-error", messages });
    }
  }
};
