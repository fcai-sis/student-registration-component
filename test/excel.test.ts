import { Workbook } from 'exceljs';
import { getStudentsWorkSheet, getExcelColumnsHeaders, getExcelRows } from "../src/features/common/logic/utils/excel.utils";

describe('Excel utils', () => {
  describe('Reading Excel columns headers', () => {
    it('should return a list of strings', async () => {
      const workbook = new Workbook();
      await workbook.xlsx.readFile('test/ملف التنسيق.xls');
      const worksheet = getStudentsWorkSheet(workbook);
      const headers = getExcelColumnsHeaders(worksheet);
      const expectedHeaders = [
        "توزيع المرحلة",
        "رقم جلوس الطالب",
        "اسم الطالب",
        "المجموع بدون المستوى الرفيع",
        "المجموع بالمستوى الرفيع والحافز",
        "ملحوظة",
        "المجموع الكلى لغات",
        "درجة المستوى الرفيع",
        "الحافز الرياضى",
        "كود الكلية",
        "الكلية",
        "كود الجامعة",
        "الجامعة",
        "كود التخصص",
        "اسم التخصص",
        "كود المجموعة العلمية",
        "المجموعة العلمية",
        "النوع",
        "الديانة",
        "نوع التوزيع او الترشيح للكلية",
        "الرقم القومى",
        "الادارة",
        "المدرية",
        "الكنترول",
        "الغة الاجنبية الاولى",
        "اللغة الاجنبية الثــانية",
        "اللغة العربية1",
        "اللغة العربية2",
        "اللغة الاجنبية الاولى1",
        "اللغة الاجنبية الاولى2",
        "اللغة الاجنبية الثانية2",
        "رياضيات1",
        "تاريخ",
        "جغرافيا",
        "فلسفة",
        "علم نفس",
        "اقتصاد واحصاء",
        "كيمياء",
        "احياء",
        "جيولوجيا",
        "رياضيات2",
        "الفيزياء",
        "التربية الدينية",
        "التربية الدينية2",
        "التربية القومية",
        "مستوى رفيع لغة عربية",
        "مستوى رفيع لغة اولى",
        "مستوى رفيع جغرافيا",
        "مستوى رفيع فلسفة",
        "مستوى رفيع احياء",
        "مستوى رفيع  رياضيات",
        "رقم تليفون الطالب",
        "كود المدرسة",
        "مدرسة",
        "نوع التعليم",
        "سنة الميلاد",
        "شهر الميلاد",
        "يوم الميلاد",
        "كود المدرية",
        "الجنسية",
        "كود الادارة",
        "كود الشرطة",
        "العنوان",
        "قسم الشرطة",
        "محافظة العنوان",
        "محل الميلاد",
      ];

      expect(headers.length).toBe(expectedHeaders.length);
    });
  });

  describe('Reading Excel rows', () => {
    it('should return a list of rows', async () => {
      const workbook = new Workbook();
      await workbook.xlsx.readFile('test/ملف التنسيق.xls');
      const worksheet = getStudentsWorkSheet(workbook!);
      const rows = getExcelRows(worksheet);

      expect(rows.length).toBe(349);
    });

    it('should return first row', async () => {
      const workbook = new Workbook();
      await workbook.xlsx.readFile('test/ملف التنسيق.xls');
      const worksheet = getStudentsWorkSheet(workbook!);
      const rows = getExcelRows(worksheet);
      const firstRow = rows[0];

      const expectedRow = [
        "المرحلة الأولى والثانية",
        "1013240",
        "محمد هشام محمد مرزوق",
        "3795",
        "3795",
        "ثانوية حديثة - برجاء مراجعة درجة الطالب والحد الأدنى للكلية",
        "2255",
        "2",
        "0",
        "511",
        "حاسبات ومعلومات القاهره",
        "1",
        " جامعة القاهرة",
        "22",
        "كلية حاسبات ومعلومات",
        "2",
        "علمي رياضة",
        "1",
        "1",
        undefined,
        "29812302100113",
        "أكتوبر",
        "الجيزة",
        "11",
        "الفرنسية",
        "الانجليزية",
        "680",
        "0",
        "480",
        "0",
        "380",
        "555",
        "-40",
        "-40",
        "-40",
        "-40",
        "-40",
        "590",
        "-40",
        "-40",
        "530",
        "580",
        "23",
        "0",
        "18",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "01157160425",
        "0",
        "الملكية لغات",
        "مدارس خاصة لغات",
        "1998",
        "12",
        "30",
        "21",
        "1",
        "1418",
        "1",
        "الدقـى شارع الانصار عمارة 5 / الجيزة",
        "قسم الدقى",
        "21",
        "الجيزة",
      ]

      expect(firstRow).toEqual(expectedRow);
      expect(firstRow.length).toBe(expectedRow.length);
    });

    it('should return last row', async () => {
      const workbook = new Workbook();
      await workbook.xlsx.readFile('test/ملف التنسيق.xls');
      const worksheet = getStudentsWorkSheet(workbook!);
      const rows = getExcelRows(worksheet);
      const lastRow = rows[rows.length - 1];

      const expectedRow = [
        "نتيجة تحويلات",
        "1204323",
        "اسماء عبدالسلام محمد حسن",
        "3790",
        "3790",
        "ثانوية حديثة - برجاء مراجعة درجة الطالب والحد الأدنى للكلية",
        "2165",
        "2",
        "0",
        "511",
        "حاسبات ومعلومات القاهره",
        "1",
        " جامعة القاهرة",
        "22",
        "كلية حاسبات ومعلومات",
        "2",
        "علمي رياضة",
        "2",
        "1",
        undefined,
        "29804190104681",
        "البساتين ودار السلام",
        "القاهرة",
        "13",
        "الانجليزية",
        "الايطالية",
        "735",
        "0",
        "490",
        "0",
        "400",
        "520",
        "-40",
        "-40",
        "-40",
        "-40",
        "-40",
        "580",
        "-40",
        "-40",
        "560",
        "505",
        "14",
        "0",
        "19",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "01127458583",
        "0",
        "اسماء بنت ابى بكر ث بنات",
        "مدارس رسمية",
        "1998",
        "4",
        "19",
        "1",
        "1",
        "123",
        "2",
        "ق 2 بلوك 2 الشطر الثانى عشر",
        "قسم المعادى",
        "1",
        "القاهرة"
      ];

      expect(lastRow).toEqual(expectedRow);
      expect(lastRow.length).toBe(expectedRow.length);
    });

  });
});

