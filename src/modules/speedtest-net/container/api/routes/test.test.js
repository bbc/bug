const express = require("express");
const request = require("supertest");

jest.mock("@services/test-start", () => jest.fn());
jest.mock("@services/test-status", () => jest.fn());
jest.mock("@services/test-results", () => jest.fn());
jest.mock("@services/test-delete", () => jest.fn());
jest.mock("@services/stats-clear", () => jest.fn());

const startTest = require("@services/test-start");
const statusTest = require("@services/test-status");
const resultsTest = require("@services/test-results");
const deleteTest = require("@services/test-delete");
const clearStats = require("@services/stats-clear");
const router = require("./test");

describe("test routes", () => {
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

    test("GET /start returns success when service has no error", async () => {
        startTest.mockResolvedValue({ running: true });

        const response = await request(app).get("/start");

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.message).toBe("Speedtest started");
    });

    test("GET /start returns error when service throws", async () => {
        startTest.mockRejectedValue(new Error("failed"));

        const response = await request(app).get("/start");

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
            status: "error",
            message: "failed",
        });
    });

    test("GET /status returns current status", async () => {
        statusTest.mockResolvedValue({ running: false });

        const response = await request(app).get("/status");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            data: { running: false },
        });
    });

    test("POST /result/:limit passes limit to service", async () => {
        resultsTest.mockResolvedValue([{ id: 1 }]);

        const response = await request(app).post("/result/5");

        expect(response.statusCode).toBe(200);
        expect(resultsTest).toHaveBeenCalledWith("5");
        expect(response.body).toEqual({
            status: "success",
            data: [{ id: 1 }],
        });
    });

    test("DELETE /stats clears live graph stats", async () => {
        clearStats.mockResolvedValue({
            downloadDeletedCount: 2,
            uploadDeletedCount: 2,
        });

        const response = await request(app).delete("/stats");

        expect(response.statusCode).toBe(200);
        expect(clearStats).toHaveBeenCalledWith();
        expect(response.body).toEqual({
            status: "success",
            data: {
                downloadDeletedCount: 2,
                uploadDeletedCount: 2,
            },
        });
    });

    test("DELETE /result/:id passes id to service", async () => {
        deleteTest.mockResolvedValue({ deletedCount: 1 });

        const response = await request(app).delete("/result/abc123");

        expect(response.statusCode).toBe(200);
        expect(deleteTest).toHaveBeenCalledWith("abc123");
        expect(response.body).toEqual({
            status: "success",
            data: { deletedCount: 1 },
        });
    });
});
