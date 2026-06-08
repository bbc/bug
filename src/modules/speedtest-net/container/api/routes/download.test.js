const express = require("express");
const request = require("supertest");

jest.mock("@services/download-stats", () => jest.fn());
jest.mock("@core/hash-response", () => jest.fn((res, req, payload) => res.json(payload)));

const getDownloadStats = require("@services/download-stats");
const hashResponse = require("@core/hash-response");
const router = require("./download");

describe("download routes", () => {
    let app;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());
        app.use("/", router);
    });

    test("GET /stats returns success with data", async () => {
        getDownloadStats.mockResolvedValue([{ speed: 123 }]);

        const response = await request(app).get("/stats");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            data: [{ speed: 123 }],
        });
        expect(hashResponse).toHaveBeenCalledTimes(1);
    });

    test("GET /stats returns failure for empty results", async () => {
        getDownloadStats.mockResolvedValue([]);

        const response = await request(app).get("/stats");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "failure",
            data: [],
        });
    });
});
