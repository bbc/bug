const express = require("express");
const request = require("supertest");

jest.mock("../../services/status-get", () => jest.fn(async () => ([{ status: "ok" }])));

const statusRouter = require("./status");

describe("status routes", () => {
    const app = express();
    app.use("/", statusRouter);

    test("GET / should return success response", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("data");
    });
});
