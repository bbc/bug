const express = require("express");
const request = require("supertest");
const defaultRouter = require("./default");

describe("default route", () => {
    const app = express();
    app.use("/", defaultRouter);

    test("unknown path should return 404 payload", async () => {
        const response = await request(app).get("/missing?foo=bar");

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("error");
        expect(response.body).toHaveProperty("request_method", "GET");
        expect(response.body).toHaveProperty("request_url");
    });
});
