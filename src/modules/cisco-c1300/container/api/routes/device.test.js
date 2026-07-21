const express = require("express");
const request = require("supertest");

jest.mock("@services/device-save", () => jest.fn(async () => ({ saved: true })));
jest.mock("@services/device-stackcount", () => jest.fn(async () => ({ count: 1 })));

const deviceRouter = require("./device");

describe("device routes", () => {
    const app = express();
    app.use("/", deviceRouter);

    test("GET /save should return success response", async () => {
        const response = await request(app).get("/save");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("data");
    });

    test("GET /stackcount should return success response", async () => {
        const response = await request(app).get("/stackcount");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("data");
    });
});
