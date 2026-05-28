const express = require("express");
const request = require("supertest");

jest.mock("@services/capability-videorouter", () => jest.fn(async () => true));

const router = require("./capabilities");

describe("capabilities routes", () => {
    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
        req.workers = {};
        next();
    });
    app.use("/", router);

    test("GET /video-router returns success", async () => {
        const response = await request(app).get("/video-router");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });
});
