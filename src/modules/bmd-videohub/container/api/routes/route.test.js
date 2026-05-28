const express = require("express");
const request = require("supertest");

jest.mock("@services/videohub-route", () => jest.fn(async () => true));

const router = require("./route");

describe("route routes", () => {
    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
        req.workers = {};
        next();
    });
    app.use("/", router);

    test("GET /:destination/:source returns success", async () => {
        const response = await request(app).get("/1/1");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });
});
