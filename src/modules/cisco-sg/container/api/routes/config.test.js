const express = require("express");
const request = require("supertest");

jest.mock("@core/config-get", () => jest.fn(async () => ({ module: "cisco-sg" })));
jest.mock("@core/config-put", () => jest.fn(async (workers, body) => ({ workersSet: Boolean(workers), body })));

const configRouter = require("./config");

describe("config routes", () => {
    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
        req.workers = {};
        next();
    });
    app.use("/", configRouter);

    test("GET / should return success response", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("data");
    });

    test("PUT / should return success response", async () => {
        const payload = { panelName: "test-panel" };
        const response = await request(app).put("/").send(payload);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("data");
    });
});
