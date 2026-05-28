const express = require("express");
const request = require("supertest");

jest.mock("@services/interface-list", () => jest.fn(async () => ([])));
jest.mock("@services/interface-get", () => jest.fn(async () => ({})));
jest.mock("@services/interface-getfdb", () => jest.fn(async () => ([])));
jest.mock("@services/interface-history", () => jest.fn(async () => ([])));
jest.mock("@services/interface-enable", () => jest.fn(async () => true));
jest.mock("@services/interface-disable", () => jest.fn(async () => true));
jest.mock("@services/interface-protect", () => jest.fn(async () => true));
jest.mock("@services/interface-unprotect", () => jest.fn(async () => true));
jest.mock("@services/interface-setvlantrunk", () => jest.fn(async () => true));
jest.mock("@services/interface-setvlanaccess", () => jest.fn(async () => true));
jest.mock("@services/interface-rename", () => jest.fn(async () => true));
jest.mock("@services/interface-poe", () => jest.fn(async () => true));

const router = require("./interface");

describe("interface routes", () => {
    const app = express();
    app.use(express.json());
    app.use("/", router);

    test("ALL / returns success", async () => {
        const response = await request(app).post("/").send({});
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("GET /:interfaceId returns success", async () => {
        const response = await request(app).get("/1");
        expect(response.statusCode).toBe(200);
    });

    test("ALL /fdb/:interfaceId returns success", async () => {
        const response = await request(app).post("/fdb/1").send({});
        expect(response.statusCode).toBe(200);
    });

    test("GET /history/:interfaceId returns success", async () => {
        const response = await request(app).get("/history/1");
        expect(response.statusCode).toBe(200);
    });

    test("GET /rename/:interfaceId/:interfaceName returns success", async () => {
        const response = await request(app).get("/rename/1/name");
        expect(response.statusCode).toBe(200);
    });

    test("POST /setvlantrunk/:interfaceId returns success", async () => {
        const response = await request(app).post("/setvlantrunk/1").send({ untaggedVlan: 1, taggedVlans: [2, 3] });
        expect(response.statusCode).toBe(200);
    });

    test("GET /setvlanaccess/:interfaceId/:untaggedVlan returns success", async () => {
        const response = await request(app).get("/setvlanaccess/1/10");
        expect(response.statusCode).toBe(200);
    });

    test("GET /enablepoe/:interfaceId returns success", async () => {
        const response = await request(app).get("/enablepoe/1");
        expect(response.statusCode).toBe(200);
    });

    test("GET /disablepoe/:interfaceId returns success", async () => {
        const response = await request(app).get("/disablepoe/1");
        expect(response.statusCode).toBe(200);
    });

    test("GET /enable/:interfaceId returns success", async () => {
        const response = await request(app).get("/enable/1");
        expect(response.statusCode).toBe(200);
    });

    test("GET /disable/:interfaceId returns success", async () => {
        const response = await request(app).get("/disable/1");
        expect(response.statusCode).toBe(200);
    });

    test("GET /protect/:interfaceId returns success", async () => {
        const response = await request(app).get("/protect/1");
        expect(response.statusCode).toBe(200);
    });

    test("GET /unprotect/:interfaceId returns success", async () => {
        const response = await request(app).get("/unprotect/1");
        expect(response.statusCode).toBe(200);
    });
});
