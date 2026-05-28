const express = require("express");
const request = require("supertest");

jest.mock("@services/program-list", () => jest.fn(async () => ([])));
jest.mock("@services/program-getloaded", () => jest.fn(async () => ({})));
jest.mock("@services/program-load", () => jest.fn(async () => true));

const router = require("./program");

describe("program routes", () => {
    const app = express();
    app.use("/", router);

    test("ALL / returns success", async () => { expect((await request(app).post("/")).statusCode).toBe(200); });
    test("GET /loaded returns success", async () => { expect((await request(app).get("/loaded")).statusCode).toBe(200); });
    test("GET /load/:programHandle returns success", async () => { expect((await request(app).get("/load/prg-1")).statusCode).toBe(200); });
    test("GET /unload/ returns success", async () => { expect((await request(app).get("/unload/")).statusCode).toBe(200); });
    test("GET /unload/:programHandle returns success", async () => { expect((await request(app).get("/unload/prg-2")).statusCode).toBe(200); });
});
