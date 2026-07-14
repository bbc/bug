const express = require("express");
const request = require("supertest");

const mockThumbGet = jest.fn(async () => Buffer.from("png-data"));

jest.mock("@services/thumb-get", () => (...args) => mockThumbGet(...args));

const router = require("./thumb");

describe("thumb routes", () => {
    const app = express();
    app.use("/", router);

    beforeEach(() => {
        mockThumbGet.mockClear();
    });

    test("GET / should return png data", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toBe("image/png");
        expect(Buffer.isBuffer(response.body)).toBe(true);
    });

    test("GET / should return an error payload when thumb-get fails", async () => {
        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => { });
        mockThumbGet.mockRejectedValueOnce(new Error("thumb failed"));

        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "error",
            message: "Failed to get thumb",
        });

        consoleSpy.mockRestore();
    });
});