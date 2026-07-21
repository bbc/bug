const { Readable } = require("stream");
const express = require("express");
const request = require("supertest");

const mockPlayerDetails = jest.fn();
const mockAxiosGet = jest.fn();
jest.mock("@services/player-details", () => (...args) => mockPlayerDetails(...args));
jest.mock("@core/logger", () => () => ({ info: jest.fn(), debug: jest.fn(), warning: jest.fn(), error: jest.fn() }));
jest.mock("axios", () => ({ get: (...args) => mockAxiosGet(...args) }));

const router = require("./audio");

describe("audio routes", () => {
    const app = express();
    app.use("/", router);

    beforeEach(() => {
        mockPlayerDetails.mockReset();
        mockAxiosGet.mockReset();
    });

    test("GET /:playerId/playlist.m3u8 proxies the player source", async () => {
        mockPlayerDetails.mockResolvedValue({ source: "http://example.com/playlist.m3u8" });
        mockAxiosGet.mockResolvedValue({ data: Readable.from(["#EXTM3U"]) });

        const response = await request(app).get("/abc/playlist.m3u8");
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("#EXTM3U");
        expect(mockAxiosGet).toHaveBeenCalledWith("http://example.com/playlist.m3u8", { responseType: "stream" });
    });

    test("GET /:playerId/:filePath proxies a segment relative to the source host", async () => {
        mockPlayerDetails.mockResolvedValue({ source: "http://example.com/live/playlist.m3u8" });
        mockAxiosGet.mockResolvedValue({ data: Readable.from(["segment"]) });

        const response = await request(app).get("/abc/segment0.ts");
        expect(response.statusCode).toBe(200);
        expect(mockAxiosGet).toHaveBeenCalledWith("http://example.com/segment0.ts", { responseType: "stream" });
    });

    test("propagates an error when the upstream request fails", async () => {
        mockPlayerDetails.mockResolvedValue({ source: "http://example.com/playlist.m3u8" });
        mockAxiosGet.mockRejectedValue(new Error("upstream down"));

        const response = await request(app).get("/abc/playlist.m3u8");
        expect(response.statusCode).toBe(500);
    });
});
