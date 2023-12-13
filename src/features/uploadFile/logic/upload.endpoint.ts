import { Request, Response } from "express";
import xlsx from "xlsx";
import fs from "fs";
import StudentModel from "../data/student.model.js";

export default async (req: Request, res: Response) => {
  // Check if the file was uploaded
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }

  // Read the file
  const buffer = fs.readFileSync(req.file.path);

  // Parse the file
  const workbook = xlsx.read(buffer, { type: "buffer" });

  // Assuming the first sheet of the Excel file contains the students data
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json<typeof StudentModel>(
    workbook.Sheets[sheetName]
  );

  // Attempting to map the model into the DB
  try {
    await StudentModel.create(data, { validateBeforeSave: true });
    res.status(200).send("File uploaded successfully.");
  } catch (err) {
    res.status(500).send("Something went wrong.");
  }
};
