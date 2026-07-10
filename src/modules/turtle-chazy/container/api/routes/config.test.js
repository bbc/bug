const express = require("express");
const request = require("supertest");

const mockConfigGet = jest.fn(async () => ({ address: "127.0.0.1" }));
const mockConfigPut = jest.fn(async () => ({ updated: true }));

jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));
jest.mock("@core/config-put", () => (...args) => mockConfigPut(...args));

const router = require("./config");

describe("config routes", () => {
    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
        req.workers = { restart: jest.fn() };
        next();
    });
    app.use("/", router);

    beforeEach(() => {
        mockConfigGet.mockClear();
        mockConfigPut.mockClear();
    });

    test("GET / returns success", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(mockConfigGet).toHaveBeenCalledTimes(1);
    });

    test("PUT / returns success", async () => {
        const payload = { address: "10.0.0.10" };
        const response = await request(app).put("/").send(payload);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(mockConfigPut).toHaveBeenCalledWith(expect.any(Object), payload);
    });
});
