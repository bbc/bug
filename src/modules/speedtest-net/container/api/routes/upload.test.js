const express = require("express");
const request = require("supertest");

jest.mock("@services/upload-stats", () => jest.fn());
jest.mock("@core/hash-response", () => jest.fn((res, req, payload) => res.json(payload)));

const getUploadStats = require("@services/upload-stats");
const router = require("./upload");

describe("upload routes", () => {
    let app;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());
        app.use("/", router);
    });

    test("GET /stats returns success with data", async () => {
        getUploadStats.mockResolvedValue([{ speed: 99 }]);

        const response = await request(app).get("/stats");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            data: [{ speed: 99 }],
        });
    });

    test("GET /stats returns failure for empty results", async () => {
        getUploadStats.mockResolvedValue([]);

        const response = await request(app).get("/stats");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "failure",
            data: [],
        });
    });
});
