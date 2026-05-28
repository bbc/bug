const express = require("express");
const request = require("supertest");

jest.mock("@services/connection-connect", () => jest.fn(async () => true));
jest.mock("@services/connection-disconnect", () => jest.fn(async () => true));
jest.mock("@services/connection-liststatistics", () => jest.fn(async () => ([])));
jest.mock("@services/connection-list", () => jest.fn(async () => ([])));
jest.mock("@services/connection-get", () => jest.fn(async () => ({})));

const router = require("./connection");

describe("connection routes", () => {
    const app = express();
    app.use("/", router);

    test("GET /connect/:connectionId returns success", async () => { expect((await request(app).get("/connect/1")).statusCode).toBe(200); });
    test("GET /disconnect/:connectionId returns success", async () => { expect((await request(app).get("/disconnect/1")).statusCode).toBe(200); });
    test("ALL /statistics/ returns success", async () => { expect((await request(app).post("/statistics/")).statusCode).toBe(200); });
    test("ALL / returns success", async () => { expect((await request(app).post("/")).statusCode).toBe(200); });
    test("GET /:connectionId returns success", async () => { expect((await request(app).get("/1")).statusCode).toBe(200); });
});
