const express = require("express");
const request = require("supertest");

jest.mock("@services/lease-get", () => jest.fn(async () => ({})));
jest.mock("@services/lease-update", () => jest.fn(async () => true));
jest.mock("@services/lease-list", () => jest.fn(async () => ([])));
jest.mock("@services/lease-delete", () => jest.fn(async () => true));
jest.mock("@services/lease-magicpacket", () => jest.fn(async () => true));
jest.mock("@services/lease-add", () => jest.fn(async () => true));
jest.mock("@services/lease-comment", () => jest.fn(async () => true));
jest.mock("@services/lease-enable", () => jest.fn(async () => true));
jest.mock("@services/lease-disable", () => jest.fn(async () => true));
jest.mock("@services/lease-makestatic", () => jest.fn(async () => true));

const router = require("./lease");

describe("lease routes", () => {
    const app = express();
    app.use(express.json());
    app.use("/", router);

    test("GET / returns success", async () => { expect((await request(app).get("/")).statusCode).toBe(200); });
    test("POST / returns success", async () => { expect((await request(app).post("/").send({})).statusCode).toBe(200); });
    test("POST /add returns success", async () => { expect((await request(app).post("/add").send({})).statusCode).toBe(200); });
    test("PUT /:leaseId returns success", async () => { expect((await request(app).put("/1").send({})).statusCode).toBe(200); });
    test("GET /:leaseId returns success", async () => { expect((await request(app).get("/1")).statusCode).toBe(200); });
    test("GET /magicpacket/:leaseId returns success", async () => { expect((await request(app).get("/magicpacket/1")).statusCode).toBe(200); });
    test("GET /makestatic/:leaseId returns success", async () => { expect((await request(app).get("/makestatic/1")).statusCode).toBe(200); });
    test("DELETE /:leaseId returns success", async () => { expect((await request(app).delete("/1")).statusCode).toBe(200); });
    test("GET /comment/:leaseId/:leaseComment returns success", async () => { expect((await request(app).get("/comment/1/note")).statusCode).toBe(200); });
    test("GET /comment/:leaseId returns success", async () => { expect((await request(app).get("/comment/1")).statusCode).toBe(200); });
    test("GET /enable/:leaseId returns success", async () => { expect((await request(app).get("/enable/1")).statusCode).toBe(200); });
    test("GET /disable/:leaseId returns success", async () => { expect((await request(app).get("/disable/1")).statusCode).toBe(200); });
});
