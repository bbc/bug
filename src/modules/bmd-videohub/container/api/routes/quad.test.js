const express = require("express");
const request = require("supertest");

jest.mock("@services/button-setquad", () => jest.fn(async () => true));

const router = require("./quad");

describe("quad routes", () => {
    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
        req.workers = {};
        next();
    });
    app.use("/", router);

    test("GET /set/:index/:type returns success", async () => {
        const response = await request(app).get("/set/1/1");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("GET /unset/:index/:type returns success", async () => {
        const response = await request(app).get("/unset/1/1");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });
});
