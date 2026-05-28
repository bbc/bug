const express = require("express");
const request = require("supertest");

jest.mock("@services/device-save", () => jest.fn(async () => true));

const router = require("./device");

describe("device routes", () => {
    const app = express();
    app.use("/", router);

    test("GET /save returns success", async () => {
        const response = await request(app).get("/save");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });
});
