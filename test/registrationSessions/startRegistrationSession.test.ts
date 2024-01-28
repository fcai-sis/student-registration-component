import mongoose from "mongoose";
import supertest from "supertest";

import { database, request } from "../index";

describe("POST /create", () => {
  // Connect to the database before running any tests
  beforeAll(async () => {
    await database.connect();
  });

  // Disconnect from the database after running all tests
  afterAll(async () => {
    await database.disconnect();
  });


});
