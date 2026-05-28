const express = require("express");
const request = require("supertest");

jest.mock("../../services/server-list", () => jest.fn(async () => ([])));

const router = require("./server");

describe("server routes", () => {
    const app = express();
    app.use("/", router);

    test("GET / returns success", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });
});
