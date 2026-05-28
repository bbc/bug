const express = require("express");
const request = require("supertest");

jest.mock("@services/group-connect", () => jest.fn(async () => true));
jest.mock("@services/group-disconnect", () => jest.fn(async () => true));
jest.mock("@services/group-liststatistics", () => jest.fn(async () => ([])));
jest.mock("@services/group-getstatistics", () => jest.fn(async () => ({})));

const router = require("./group");

describe("group routes", () => {
    const app = express();
    app.use("/", router);

    test("GET /connect/:groupId returns success", async () => { expect((await request(app).get("/connect/1")).statusCode).toBe(200); });
    test("GET /disconnect/:groupId returns success", async () => { expect((await request(app).get("/disconnect/1")).statusCode).toBe(200); });
    test("GET /statistics/ returns success", async () => { expect((await request(app).get("/statistics/")).statusCode).toBe(200); });
    test("GET /statistics/:groupId returns success", async () => { expect((await request(app).get("/statistics/1")).statusCode).toBe(200); });
});
