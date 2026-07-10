const express = require("express");
const request = require("supertest");

const mockDeviceRoute = jest.fn(async () => true);
jest.mock("@services/device-route", () => (...args) => mockDeviceRoute(...args));

const router = require("./route");

describe("route routes", () => {
    const app = express();
    app.use("/", router);

    beforeEach(() => {
        mockDeviceRoute.mockClear();
    });

    test("GET /:destinationDevice/:destinationIndex/:sourceDevice/:sourceIndex returns success", async () => {
        const response = await request(app).get("/dest-a/3/source-a/8");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(mockDeviceRoute).toHaveBeenCalledWith("dest-a", 3, "source-a", 8);
    });
});
