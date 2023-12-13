import { Request, Response } from "express";
import xlsx from "xlsx";
import fs from "fs";
import StudentModel, { IStudentModel } from "../data/student.model.js";
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
  const data = xlsx.utils.sheet_to_json<any>(workbook.Sheets[sheetName]);

  // Validate that the excel file's fields match those that are in "mapping"
  if (!req.body.mapping) {
    res.status(400).send("No mapping provided.");
    return;
  }
  const mapping = JSON.parse(req.body.mapping);

  const excelFields = Object.keys(data[0]);
  const mappingFields = Object.keys(mapping);

  // Make sure that every "mapping" field exists within the excel file
  const isMappingValid = mappingFields.every((field) =>
    excelFields.includes(mapping[field])
  );
  if (!isMappingValid) {
    res.status(400).send("Excel file fields do not match Mapping fields");
    console.log(excelFields);
    console.log(mappingFields);

    return;
  }

  // Make sure that every "student" field exists wtihin the "mapping"
  const studentModelFields = Object.keys(StudentModel.schema.obj);
  const isMappingFieldsValid = studentModelFields.every((field) =>
    mappingFields.includes(field)
  );
  if (!isMappingFieldsValid) {
    res.status(400).send("Mapping fields do not match Student model fields");
    return;
  }

  // Map each excel field to its corresponding field in the Student model
  const students = data.map(
    (studentRow): IStudentModel => ({
      studentId: studentRow[mapping["studentId"]],
      name: studentRow[mapping["name"]],
      address: studentRow[mapping["address"]],
    })
  );

  await StudentModel.create(students, { validateBeforeSave: true });
  res.status(200).send("File uploaded successfully.");
};
