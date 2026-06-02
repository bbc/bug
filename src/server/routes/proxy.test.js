const request = require("supertest");

jest.mock("@middleware/restrict", () => ({
    to: () => (req, res, next) => next(),
}));

jest.mock("@models/panel-config", () => ({
    get: jest.fn(async () => ({ id: "test-panel", module: "clock" })),
}));

jest.mock("axios", () => {
    const { Readable } = require("stream");
    return jest.fn(async () => ({
        status: 200,
        data: Readable.from(["ok"]),
    }));
});

const system = require("@bin/api");

describe("Test the '/container/' endpoint", () => {
    test("Test the '/:panelid/*' proxy route", async () => {
        const response = await request(system).get("/container/test-panel/status");
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("ok");
    });
});
