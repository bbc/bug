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
        app.use((req, _res, next) => {
            req.workers = { restart: jest.fn() };
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

    test("GET / returns success payload", async () => {
        configGet.mockResolvedValue({ timezone: { utc: ["Europe/London"] } });

        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            data: { timezone: { utc: ["Europe/London"] } },
        });
    });

    test("GET / forwards errors to middleware", async () => {
        configGet.mockRejectedValue(new Error("config failed"));

        const response = await request(app).get("/");

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
            status: "error",
            message: "config failed",
        });
    });

    test("PUT / returns success payload", async () => {
        configPut.mockResolvedValue(true);

        const response = await request(app).put("/").send({ showTime: false });

        expect(response.statusCode).toBe(200);
        expect(configPut).toHaveBeenCalledWith(expect.any(Object), { showTime: false });
        expect(response.body).toEqual({
            status: "success",
            data: true,
        });
    });

    test("PUT / forwards errors to middleware", async () => {
        configPut.mockRejectedValue(new Error("update failed"));

        const response = await request(app).put("/").send({ showDate: true });

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
            status: "error",
            message: "update failed",
        });
    });
});