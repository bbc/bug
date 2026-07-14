const express = require("express");
const request = require("supertest");

const mockCodecDbGet = jest.fn(async () => [{ id: "codec-1" }]);

jest.mock("@services/codecdb-get", () => (...args) => mockCodecDbGet(...args));

const router = require("./codecdb");

describe("codecdb routes", () => {
    const app = express();
    app.use("/", router);

    beforeEach(() => {
        mockCodecDbGet.mockClear();
    });

    test("GET /:streamType should return success response", async () => {
        const response = await request(app).get("/srt");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            data: [{ id: "codec-1" }],
        });
        expect(mockCodecDbGet).toHaveBeenCalledWith("srt");
    });
});