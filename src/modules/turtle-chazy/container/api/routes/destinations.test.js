const express = require("express");
const request = require("supertest");

const mockDestinationsList = jest.fn(async () => ({ devices: [], destinations: [] }));
jest.mock("@services/destinations-list", () => (...args) => mockDestinationsList(...args));

const router = require("./destinations");

describe("destinations routes", () => {
    const app = express();
    app.use("/", router);

    beforeEach(() => {
        mockDestinationsList.mockClear();
    });

    test("GET /:destinationDevice returns success", async () => {
        const response = await request(app).get("/dest-a");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(mockDestinationsList).toHaveBeenCalledWith("dest-a");
    });
});
