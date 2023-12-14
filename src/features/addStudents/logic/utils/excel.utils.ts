import xlsx from "xlsx";

export function getExcelColumnsHeaders(worksheet: xlsx.WorkSheet) {
  const range = xlsx.utils.decode_range(worksheet["!ref"]!);
  const excelColumnsHeaders: string[] = [];

  // Get all excel columns headers
  for (let i = range.s.c; i <= range.e.c; ++i) {
    const address = xlsx.utils.encode_col(i) + "1";
    const header = worksheet[address];
    excelColumnsHeaders.push(header.v);
  }

  return excelColumnsHeaders;
}
