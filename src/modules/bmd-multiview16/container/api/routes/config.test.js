const express = require("express");
const request = require("supertest");

jest.mock("@core/config-get", () => jest.fn(async () => ({ address: "127.0.0.1" })));
jest.mock("@core/config-put", () => jest.fn(async () => true));

const router = require("./config");

describe("config routes", () => {
    const app = express();
    app.use(express.json());
    app.use((req, _res, next) => {
        req.workers = undefined;
        next();
    });
    app.use("/", router);

    test("GET / returns success", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("PUT / returns success", async () => {
        const response = await request(app).put("/").send({ address: "10.0.0.2" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });
});
