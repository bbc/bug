//NAME: test.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 04/03/2021
//DESC: Boilerplate module test code

const request = require("supertest");
const app = require("./app");

describe("Test the root path", () => {
  test("It should response the GET method", async () => {
    const response = await request(app).get("api/status");
    expect(response.statusCode).toBe(200);
  });
});