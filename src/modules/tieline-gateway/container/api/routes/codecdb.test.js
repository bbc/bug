const express = require("express");
const request = require("supertest");

jest.mock("@services/codecdb-get", () => jest.fn(async () => ([])));

const router = require("./codecdb");

describe("codecdb routes", () => {
    const app = express();
    app.use("/", router);

    test("GET /:streamType returns success", async () => {
        const response = await request(app).get("/tx");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });
});
