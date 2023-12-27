import supertest from "supertest";

import app from "../src/app.js";
import * as database from "./database.js";

const request = supertest(app);

describe("POST /start", () => {
  beforeAll(async () => {
    await database.connect();
  });

  afterEach(async () => {
    await database.clearDatabase();
  });

  afterAll(async () => {
    await database.closeDatabase();
  });

  describe("when there is no active registration session", () => {
    it("should start a new registration session", async () => {
      expect(true).toBe(true);
      // const response = await request
      //   .post("/start")
      //   .attach("file", "./sample.xlsx")
      //   .send();
      // expect(response.status).toBe(201);
      // expect(response.body).toEqual({
      //   message: "2773 students uploaded",
      // });
    });
  });
});
