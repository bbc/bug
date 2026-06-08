const express = require("express");
const request = require("supertest");

jest.mock("@services/source-list", () => jest.fn(async () => []));
jest.mock("@services/source-setsolo", () => jest.fn(async () => true));
jest.mock("@services/source-clearsolo", () => jest.fn(async () => true));

const router = require("./source");

describe("source routes", () => {
    const app = express();
    app.use("/", router);

    test("GET / returns success", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
    });

    test("GET /setsolo/:sourceIndex returns success", async () => {
        const response = await request(app).get("/setsolo/2");
        expect(response.statusCode).toBe(200);
    });

    test("GET /clearsolo returns success", async () => {
        const response = await request(app).get("/clearsolo");
        expect(response.statusCode).toBe(200);
    });
});
