const express = require("express");
const request = require("supertest");

jest.mock("@services/wan-list", () => jest.fn(async () => ([])));

const wanRouter = require("./wan");

describe("wan routes", () => {
    const app = express();
    app.use("/", wanRouter);

    test("GET / returns success response", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("data");
    });
});
