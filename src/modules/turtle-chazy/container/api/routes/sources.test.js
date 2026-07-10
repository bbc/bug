const express = require("express");
const request = require("supertest");

const mockSourcesList = jest.fn(async () => ({ devices: [], sources: [] }));
jest.mock("@services/sources-list", () => (...args) => mockSourcesList(...args));

const router = require("./sources");

describe("sources routes", () => {
    const app = express();
    app.use(express.json());
    app.use("/", router);

    beforeEach(() => {
        mockSourcesList.mockClear();
    });

    test("POST / returns success and forwards body arguments", async () => {
        const payload = {
            sourceDevice: "source-a",
            destinationDevice: "dest-a",
            destinationIndex: "2",
        };
        const response = await request(app).post("/").send(payload);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(mockSourcesList).toHaveBeenCalledWith("source-a", "dest-a", 2);
    });
});
