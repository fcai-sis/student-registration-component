import supertest from "supertest";

import app from "../src/app";

export * as database from "./database";
export const request = supertest(app);

export const expectResponse = (response: supertest.Response, statusCode: number, body: any) => {
  expect(response.status).toBe(statusCode);
  expect(response.type).toBe("application/json");
  expect(response.body).toEqual(body);
}

export const expectErrorResponse = (response: supertest.Response, statusCode: number, message: string) => {
  expect(response.status).toBe(statusCode);
  expect(response.type).toBe("application/json");
  expect(response.body).toEqual({ error: { message } });
}
