import xlsx from "xlsx";

export function getExcelColumnsHeaders(worksheet: xlsx.WorkSheet) {
  // Get the range of the worksheet
  const range = xlsx.utils.decode_range(worksheet["!ref"]!);

  // Initialize an array to hold the headers
  const excelColumnsHeaders: string[] = [];

  // Loop through all columns in the worksheet
  for (let i = range.s.c; i <= range.e.c; ++i) {
    const address = xlsx.utils.encode_col(i) + "1"; // Get cells in the first row (hence the "1")
    const header = worksheet[address]; // Get the cell
    excelColumnsHeaders.push(header.v); // Push the cell value to the headers array
  }

  return excelColumnsHeaders;
}

// Get the first worksheet in the workbook (assuming the first sheet contains the students data)
export const getStudentsWorkSheet = (workbook: xlsx.WorkBook): xlsx.WorkSheet =>
  workbook.Sheets[workbook.SheetNames[0]];
