const express = require("express");
const request = require("supertest");

jest.mock("@services/layout-get", () => jest.fn(async () => "2x2"));

const router = require("./layout");

describe("layout routes", () => {
    const app = express();
    app.use("/", router);

    test("GET / returns success", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });
});
