import xlsx from "xlsx";
import { Request, Response } from "express";

import StudentType from "../../data/types/student.type.js";
import StudentModel from "../../data/models/student.model.js";

/**
 * Uploads an excel file containing student data to the database.
 */
export default async (req: Request, res: Response) => {
  const workbook = req.body.workbook as xlsx.WorkBook;
  const mapping = req.body.mapping;

  // Assuming the first sheet of the Excel file contains the students data
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json<any>(workbook.Sheets[sheetName]);

  // Prepare the students to be inserted into the database by mapping each excel field
  // to its corresponding field in the Student model, for all rows in the excel file
  const students = data.map(
    (row): StudentType =>
      (Object.keys(mapping) as Array<keyof StudentType>).reduce(
        // Loop through all keys in the mapping
        (student, key) => {
          student[key] = row[mapping[key]]; // For each key, map the excel field to the corresponding Student model field
          return student; // Return the student object with the new field for the next iteration
        },
        {} as StudentType // Start with an empty student object
      )
  );

  try {
    const result = await StudentModel.insertMany(students);

    res
      .status(200)
      .json({ message: `${result.length} students uploaded successfully` });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      res.status(400).json({ error: "student-validation-error", messages });
    }
  }
};
