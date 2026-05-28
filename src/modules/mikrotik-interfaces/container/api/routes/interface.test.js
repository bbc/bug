const express = require("express");
const request = require("supertest");

jest.mock("../../services/interface-combinedlist", () => jest.fn(async () => ([])));
jest.mock("../../services/interface-combined", () => jest.fn(async () => ({})));
jest.mock("../../services/interface-history", () => jest.fn(async () => ([])));
jest.mock("../../services/interface-lldp", () => jest.fn(async () => ([])));
jest.mock("../../services/mikrotik-interfaceenable", () => jest.fn(async () => true));
jest.mock("../../services/mikrotik-interfacedisable", () => jest.fn(async () => true));
jest.mock("../../services/mikrotik-interfaceprotect", () => jest.fn(async () => true));
jest.mock("../../services/mikrotik-interfaceunprotect", () => jest.fn(async () => true));
jest.mock("../../services/mikrotik-interfacerename", () => jest.fn(async () => true));
jest.mock("../../services/mikrotik-interfacecomment", () => jest.fn(async () => true));

const router = require("./interface");

describe("interface routes", () => {
    const app = express();
    app.use(express.json());
    app.use("/", router);

    test("GET / returns success", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("POST / returns success", async () => {
        const response = await request(app).post("/").send({});
        expect(response.statusCode).toBe(200);
    });

    test("GET /:interfaceName returns success", async () => {
        const response = await request(app).get("/ether1");
        expect(response.statusCode).toBe(200);
    });

    test("GET /history/:interfaceName returns success", async () => {
        const response = await request(app).get("/history/ether1");
        expect(response.statusCode).toBe(200);
    });

    test("GET /rename/:interfaceId/:interfaceName returns success", async () => {
        const response = await request(app).get("/rename/1/uplink");
        expect(response.statusCode).toBe(200);
    });

    test("GET /comment/:interfaceId/:interfaceComment returns success", async () => {
        const response = await request(app).get("/comment/1/office");
        expect(response.statusCode).toBe(200);
    });

    test("GET /comment/:interfaceId returns success", async () => {
        const response = await request(app).get("/comment/1");
        expect(response.statusCode).toBe(200);
    });

    test("GET /history/:interfaceName/:start/:end returns success", async () => {
        const response = await request(app).get("/history/ether1/0/10");
        expect(response.statusCode).toBe(200);
    });

    test("ALL /lldp/:interfaceName returns success", async () => {
        const response = await request(app).post("/lldp/ether1");
        expect(response.statusCode).toBe(200);
    });

    test("GET /enable/:interfaceName returns success", async () => {
        const response = await request(app).get("/enable/ether1");
        expect(response.statusCode).toBe(200);
    });

    test("GET /disable/:interfaceName returns success", async () => {
        const response = await request(app).get("/disable/ether1");
        expect(response.statusCode).toBe(200);
    });

    test("GET /protect/:interfaceName returns success", async () => {
        const response = await request(app).get("/protect/ether1");
        expect(response.statusCode).toBe(200);
    });

    test("GET /unprotect/:interfaceName returns success", async () => {
        const response = await request(app).get("/unprotect/ether1");
        expect(response.statusCode).toBe(200);
    });
});
