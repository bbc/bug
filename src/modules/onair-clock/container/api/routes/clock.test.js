const express = require("express");
const request = require("supertest");

const route = require("./clock");

describe("clock routes", () => {
    const app = express();
    app.use("/", route);

    test("GET /large returns the clock page", async () => {
        const response = await request(app).get("/large");

        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toMatch(/text\/html/);
        expect(response.text).toContain("<title>BUG Clock</title>");
    });
});