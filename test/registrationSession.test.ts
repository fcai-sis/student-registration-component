import supertest from "supertest";

import app from "../src/app";
import * as database from "./database";
import { validateEnvironmentVariables } from "../src/env";

const request = supertest(app);

describe("POST /start", () => {
  beforeAll(async () => {
    validateEnvironmentVariables();
    await database.connect();
  });

  beforeEach(async () => {
    await database.clearDatabase();
  });

  afterEach(async () => {
    await database.clearDatabase();
  });

  afterAll(async () => {
    await database.closeDatabase();
  });

  describe("when there is no active registration session", () => {
    it("should start a new registration session", async () => {
      const response = await request
        .post("/start")
        .attach("file", "test/sample.xlsx");

      expect(response.status).toBe(201);

      expect(response.body).toEqual({
        message: "2773 students uploaded",
      });
    });
  });
});
