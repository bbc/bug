const express = require("express");
const request = require("supertest");

jest.mock("../../services/status-get", () => jest.fn());

const statusGet = require("../../services/status-get");
const router = require("./status");

describe("status routes", () => {
    let app;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());
        app.use("/", router);
        app.use((err, req, res, next) => {
            res.status(err.statusCode || 500).json({
                status: "error",
                message: err.message || "Internal Server Error",
            });
        });
    });

    test("GET / returns success payload", async () => {
        statusGet.mockResolvedValue([{ key: "clock", type: "default" }]);

        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            data: [{ key: "clock", type: "default" }],
        });
    });

    test("GET / forwards service failures to middleware", async () => {
        statusGet.mockRejectedValue(new Error("status failed"));

        const response = await request(app).get("/");

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
            status: "error",
            message: "status failed",
        });
    });
});