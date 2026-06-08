const express = require("express");
const request = require("supertest");

jest.mock("@services/deviceconfig-list", () => jest.fn(async () => []));
jest.mock("@services/deviceconfig-set", () => jest.fn(async () => true));
jest.mock("@services/deviceconfig-setlayout", () => jest.fn(async () => true));

const router = require("./deviceconfig");

describe("deviceconfig routes", () => {
    const app = express();
    app.use("/", router);

    test("GET / returns success", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("GET /set/:name/:value returns success", async () => {
        const response = await request(app).get("/set/language/en");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("GET /setlayout/:layout returns success", async () => {
        const response = await request(app).get("/setlayout/quad");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });
});
