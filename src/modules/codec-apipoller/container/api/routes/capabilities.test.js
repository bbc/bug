const express = require("express");
const request = require("supertest");

jest.mock("@services/capability-codecdb", () => jest.fn());

const capabilityCodecDb = require("@services/capability-codecdb");
const router = require("./capabilities");

describe("capabilities routes", () => {
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

    test("GET /codec-db returns success payload", async () => {
        capabilityCodecDb.mockResolvedValue([{ id: "codec-1" }]);

        const response = await request(app).get("/codec-db");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            data: [{ id: "codec-1" }],
        });
    });

    test("GET /codec-db forwards service failures", async () => {
        capabilityCodecDb.mockRejectedValue(new Error("boom"));

        const response = await request(app).get("/codec-db");

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
            status: "error",
            message: "boom",
        });
    });
});
