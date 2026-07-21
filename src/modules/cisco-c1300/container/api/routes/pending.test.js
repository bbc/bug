const express = require("express");
const request = require("supertest");

jest.mock("@services/pending-get", () => jest.fn(async () => ([{ id: 1 }])));

const pendingRouter = require("./pending");

describe("pending routes", () => {
    const app = express();
    app.use("/", pendingRouter);

    test("GET / should return success response", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("data");
    });
});
