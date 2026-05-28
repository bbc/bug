const express = require("express");
const request = require("supertest");

jest.mock("@core/config-get", () => jest.fn(async () => ({ module: "mikrotik-interfaces" })));
jest.mock("@core/config-put", () => jest.fn(async () => true));

const router = require("./config");

describe("config routes", () => {
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

    test("PUT / returns success", async () => {
        const response = await request(app).put("/").send({});
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });
});
