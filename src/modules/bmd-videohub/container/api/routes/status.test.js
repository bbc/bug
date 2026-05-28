const express = require("express");
const request = require("supertest");

jest.mock("../../services/status-get", () => jest.fn(async () => true));

const router = require("./status");

describe("status routes", () => {
    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
        req.workers = {};
        next();
    });
    app.use("/", router);

    test("GET / returns success", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });
});
