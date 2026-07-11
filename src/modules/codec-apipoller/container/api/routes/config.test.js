const express = require("express");
const request = require("supertest");

jest.mock("@core/config-get", () => jest.fn());
jest.mock("@core/config-put", () => jest.fn());

const configGet = require("@core/config-get");
const configPut = require("@core/config-put");
const router = require("./config");

describe("config routes", () => {
    let app;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());
        app.use((req, res, next) => {
            req.workers = { pushConfig: jest.fn() };
            next();
        });
        app.use("/", router);
        app.use((err, req, res, next) => {
            res.status(err.statusCode || 500).json({
                status: "error",
                message: err.message || "Internal Server Error",
            });
        });
    });

    test("GET / returns config payload", async () => {
        configGet.mockResolvedValue({ enabled: true });

        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            data: { enabled: true },
        });
    });

    test("PUT / updates config with workers and body", async () => {
        configPut.mockResolvedValue(true);

        const response = await request(app).put("/").send({ url: "http://example.test" });

        expect(configPut).toHaveBeenCalledTimes(1);
        expect(configPut).toHaveBeenCalledWith(expect.any(Object), { url: "http://example.test" });
        expect(response.body).toEqual({
            status: "success",
            data: true,
        });
    });

    test("GET / forwards config fetch failures", async () => {
        configGet.mockRejectedValue(new Error("boom"));

        const response = await request(app).get("/");

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
            status: "error",
            message: "boom",
        });
    });
});
