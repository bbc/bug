//NAME: system.test.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 04/04/2021
//DESC: Boilerplate module test code

const request = require("supertest");
const system = require("@bin/bug-core-api");

describe("Sample Test", () => {
  test("Sample Test 1", async () => {
    expect(200).toBe(200);
  });
});

describe("Test the '/api/system' routes", () => {
  test("Test the '/hello' method", async () => {
    const response = await request(system).get("api/system/hello");
    expect(response.statusCode).toBe(200);
  });

  test("Test the '/hello' method", async () => {
    const response = await request(system).get("api/system/backup");
    expect(response.statusCode).toBe(200);
  });

  test("Test the '/hello' method", async () => {
    const response = await request(system).get("api/system/restore");
    expect(response.statusCode).toBe(200);
  });
});