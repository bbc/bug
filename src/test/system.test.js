//NAME: system.test.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 04/04/2021
//DESC: Boilerplate module test code

const request = require("supertest");
const system = require("@routes/system");

describe("Test the '/api/system' routes", () => {
  test("Test the '/hello' method", async () => {
    const response = await request(system).get("/hello");
    expect(response.statusCode).toBe(200);
  });

  test("Test the '/hello' method", async () => {
    const response = await request(system).get("/backup");
    expect(response.statusCode).toBe(200);
  });

  test("Test the '/hello' method", async () => {
    const response = await request(system).get("/restore");
    expect(response.statusCode).toBe(200);
  });
});