import supertest from "supertest";

import { database, expectErrorResponse, expectResponse, request } from "../index";
import StagedStudentModel from "../../src/features/registrationSession/data/models/stagedStudents.model";
import unsetMapping from "../../src/features/registrationSession/data/types/unsetMapping.type";
import RegistrationSessionModel from "../../src/features/registrationSession/data/models/registrationSession.model";

const sampleExcelColumnHeaders = [
  'توزيع المرحلة',
  'رقم جلوس الطالب',
  'اسم الطالب',
  'المجموع بدون المستوى الرفيع',
  'المجموع بالمستوى الرفيع والحافز',
  'ملحوظة',
  'المجموع الكلى لغات',
  'درجة المستوى الرفيع',
  'الحافز الرياضى',
  'كود الكلية',
  'الكلية',
  'كود الجامعة',
  'الجامعة',
  'كود التخصص',
  'اسم التخصص',
  'كود المجموعة العلمية',
  'المجموعة العلمية',
  'النوع',
  'الديانة',
  'نوع التوزيع او الترشيح للكلية',
  'الرقم القومى',
  'الادارة',
  'المدرية',
  'الكنترول',
  'الغة الاجنبية الاولى',
  'اللغة الاجنبية الثــانية',
  'اللغة العربية1',
  'اللغة العربية2',
  'اللغة الاجنبية الاولى1',
  'اللغة الاجنبية الاولى2',
  'اللغة الاجنبية الثانية2',
  'رياضيات1',
  'تاريخ',
  'جغرافيا',
  'فلسفة',
  'علم نفس',
  'اقتصاد واحصاء',
  'كيمياء',
  'احياء',
  'جيولوجيا',
  'رياضيات2',
  'الفيزياء',
  'التربية الدينية',
  'التربية الدينية2',
  'التربية القومية',
  'مستوى رفيع لغة عربية',
  'مستوى رفيع لغة اولى',
  'مستوى رفيع جغرافيا',
  'مستوى رفيع فلسفة',
  'مستوى رفيع احياء',
  'مستوى رفيع  رياضيات',
  'رقم تليفون الطالب',
  'كود المدرسة',
  'مدرسة',
  'نوع التعليم',
  'سنة الميلاد',
  'شهر الميلاد',
  'يوم الميلاد',
  'كود المدرية',
  'الجنسية',
  'كود الادارة',
  'كود الشرطة',
  'العنوان',
  'قسم الشرطة',
  'محافظة العنوان',
  'محل الميلاد'
];

describe("POST /start", () => {
  // Connect to the database before running any tests
  beforeAll(async () => {
    await database.connect();
  });

  // Disconnect from the database after running all tests
  afterAll(async () => {
    await database.disconnect();
  });

  describe("when there is already an active registration session", () => {
    let response: supertest.Response;

    beforeAll(async () => {
      await database.clear();

      await RegistrationSessionModel.create({});

      response = await request.post("/start").attach("file", "test/ملف التنسيق.xls");
    });

    it("should return a 409 status code", () => {
      expectErrorResponse(response, 409, "There is already an active registration session");
    });

    it("should not create a new registration session", async () => {
      const registrationSessions = await RegistrationSessionModel.find();

      expect(registrationSessions.length).toBe(1);
    });

    it("should not create a new staged student", async () => {
      const stagedStudents = await StagedStudentModel.find();

      expect(stagedStudents.length).toBe(0);
    });
  });

  describe("when there is no active registration session", () => {
    describe("when the request body is valid", () => {
      let response: supertest.Response;

      beforeAll(async () => {
        await database.clear();

        response = await request.post("/start").attach("file", "test/ملف التنسيق.xls");
      });

      const initialRegistrationSessionData = {
        mapping: {
          studentId: unsetMapping,
          fullName: unsetMapping,
          status: unsetMapping,
          address: unsetMapping,
        },
        excelColumnsHeaders: sampleExcelColumnHeaders,
      }

      it("should return a 201 status code", () => {
        expectResponse(
          response,
          201,
          {
            message: "Registration session started",
            registrationSession: {
              _id: expect.any(String),
              active: true,
              startDate: expect.any(String),
              ...initialRegistrationSessionData,
            },
          },
        );
      });

      it("should create a new registration session", async () => {
        const registrationSessions = await RegistrationSessionModel.find({
          active: true,
        });

        expect(registrationSessions.length).toBe(1);
      });

      it("should create a new staged student for each student in the excel file", async () => {
        const stagedStudents = await StagedStudentModel.find({
          registrationSessionId: response.body.registrationSession._id,
        });

        expect(stagedStudents.length).toBe(349);
      });
    });

    describe("when the request body is invalid", () => {
      describe("when the file field is missing", () => {
        let response: supertest.Response;

        beforeAll(async () => {
          await database.clear();

          response = await request.post("/start");
        });

        it("should return a 400 status code", () => {
          expectErrorResponse(response, 400, "File is required");
        });

        it("should not create a new registration session", async () => {
          const registrationSessions = await RegistrationSessionModel.find();

          expect(registrationSessions.length).toBe(0);
        });

        it("should not create a new staged student", async () => {
          const stagedStudents = await StagedStudentModel.find();

          expect(stagedStudents.length).toBe(0);
        });
      });

      describe("when the file field is not a valid excel file", () => {
        let response: supertest.Response;

        beforeAll(async () => {
          await database.clear();

          response = await request.post("/start").attach("file", "test/setup.ts");
        });

        it("should return a 400 status code", () => {
          expectErrorResponse(response, 400, "File must be an excel file");
        });

        it("should not create a new registration session", async () => {
          const registrationSessions = await RegistrationSessionModel.find();

          expect(registrationSessions.length).toBe(0);
        });

        it("should not create a new staged student", async () => {
          const stagedStudents = await StagedStudentModel.find();

          expect(stagedStudents.length).toBe(0);
        });
      });
    });
  });
});
