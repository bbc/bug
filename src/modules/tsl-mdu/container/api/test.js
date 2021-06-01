//NAME: test.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 23/03/2021
//DESC: TSL MDU Module

const request = require("supertest");
const app = require("./app");

describe("Test the Status Path of the API", () => {
    test("It should response the GET method", async () => {
        const response = await request(app).get("/api/status");
        expect(response.statusCode).toBe(200);
    });
});
