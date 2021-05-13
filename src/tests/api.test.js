//NAME: system.test.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 04/04/2021
//DESC: Boilerplate module test code

const request = require("supertest");
const system = require("@bin/api");

describe("Sample Test", () => {
  test("Sample Test 1", async () => {
    expect(200).toBe(200);
  });
});

describe("Test the '/api/system/hello' route", () => {
  test("Test the '/hello' response status", async () => {
    const response = await request(system).get("/api/system/hello");
    expect(response.statusCode).toBe(200);
    expect(response.body.meta.hash).toBe('3449c9e5e332f1dbb81505cd739fbf3f');
  });

});

describe("Test the '/api/bug/quote' route", () => {

  test("Test the '/api/bug/quote' method", async () => {
    const response = await request(system).get("/api/bug/quote");
    expect(response.statusCode).toBe(200);
  });

});