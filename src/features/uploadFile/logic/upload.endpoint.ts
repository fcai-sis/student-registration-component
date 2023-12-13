import express, { Request, Response, Router } from "express";
import xlsx from "xlsx";
import fs from "fs";

type sRow = {
  Timestamp: string;
  Score: number;
};

export default async (req: Request, res: Response) => {
  try {
    // Access the uploaded file from req.file.buffer
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }
    // console.log(req.file);
    const buffer = await fs.readFileSync(req.file.path);
    const workbook = xlsx.read(buffer, { type: "buffer" });

    // Assuming the first sheet of the Excel file is of interest
    // console.log(workbook);

    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json<sRow>(workbook.Sheets[sheetName]);

    // Now 'data' contains the parsed data from the Excel file
    // console.log(data);

    res.json(data[43].Score);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing the uploaded file.");
  }
};
