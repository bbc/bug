const express = require("express");
const request = require("supertest");

jest.mock("@services/destination-route", () => jest.fn(async () => true));

const router = require("./destination");

describe("destination routes", () => {
    const app = express();
    app.use("/", router);

    test("GET /setaudio/:sourceIndex returns success", async () => {
        const response = await request(app).get("/setaudio/5");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("GET /:destinationIndex/:sourceIndex returns success", async () => {
        const response = await request(app).get("/3/8");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });
});
