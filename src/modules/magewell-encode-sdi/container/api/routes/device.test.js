const express = require("express");
const request = require("supertest");

jest.mock("@services/device-save", () => jest.fn(async () => true));
jest.mock("@services/device-revert", () => jest.fn(async () => true));

const router = require("./device");

describe("device routes", () => {
    const app = express();
    app.use("/", router);

    test("GET /save should return success response", async () => {
        const response = await request(app).get("/save");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            data: true,
        });
    });

    test("GET /revert should return success response", async () => {
        const response = await request(app).get("/revert");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            data: true,
        });
    });
});