const express = require("express");
const request = require("supertest");

jest.mock("@services/test-start", () => jest.fn());
jest.mock("@services/test-status", () => jest.fn());
jest.mock("@services/test-results", () => jest.fn());
jest.mock("@services/test-delete", () => jest.fn());
jest.mock("@core/hash-response", () => jest.fn((res, req, payload) => res.json(payload)));

const startTest = require("@services/test-start");
const statusTest = require("@services/test-status");
const resultsTest = require("@services/test-results");
const deleteTest = require("@services/test-delete");
const router = require("./test");

describe("test routes", () => {
    let app;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());
        app.use("/", router);
    });

    test("GET /start returns success when service has no error", async () => {
        startTest.mockResolvedValue({ data: { running: true }, message: "Speedtest started" });

        const response = await request(app).get("/start");

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.message).toBe("Speedtest started");
    });

    test("GET /start returns failure when service returns error", async () => {
        startTest.mockResolvedValue({ error: "failed" });

        const response = await request(app).get("/start");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "failure",
            error: "failed",
        });
    });

    test("GET /status returns current status", async () => {
        statusTest.mockResolvedValue({ data: { running: false } });

        const response = await request(app).get("/status");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            data: { running: false },
        });
    });

    test("POST /result/:limit passes limit to service", async () => {
        resultsTest.mockResolvedValue({ data: [{ id: 1 }] });

        const response = await request(app).post("/result/5");

        expect(response.statusCode).toBe(200);
        expect(resultsTest).toHaveBeenCalledWith("5");
        expect(response.body).toEqual({
            status: "success",
            data: [{ id: 1 }],
        });
    });

    test("DELETE /result/:id passes id to service", async () => {
        deleteTest.mockResolvedValue({ data: { deletedCount: 1 } });

        const response = await request(app).delete("/result/abc123");

        expect(response.statusCode).toBe(200);
        expect(deleteTest).toHaveBeenCalledWith("abc123");
        expect(response.body).toEqual({
            status: "success",
            data: { deletedCount: 1 },
        });
    });
});
