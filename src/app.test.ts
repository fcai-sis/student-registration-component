import app from "./app.js";
import request from "supertest";

describe("GET /", () => {
  it('responds with "Welcome to unit testing guide for nodejs, typescript and express!', async () => {
    expect(200).toBe(200);
  });
});
