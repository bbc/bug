const request = require("supertest");

jest.mock("@middleware/restrict", () => ({
    to: () => (req, res, next) => next(),
}));

jest.mock("@services/docker-getlogs", () => {
    const { Readable } = require("stream");
    return jest.fn(async () => Readable.from(["first line\n"]));
});

const system = require("@bin/api");

describe("Test the '/api/log/' endpoint", () => {
    test("Test the '/:containerId' GET route", async () => {
        const response = await request(system).get("/api/log/test-container");
        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toContain("text/event-stream");
        expect(response.text).toContain("event: log");
    });
});
