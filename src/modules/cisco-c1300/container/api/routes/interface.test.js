const express = require("express");
const request = require("supertest");

jest.mock("@services/interface-list", () => jest.fn(async () => ([{ interfaceId: 1 }])));
jest.mock("@services/interface-get", () => jest.fn(async (id) => ({ interfaceId: id })));
jest.mock("@services/interface-getfdb", () => jest.fn(async () => ([])));
jest.mock("@services/interface-history", () => jest.fn(async () => ([])));
jest.mock("@services/interface-enable", () => jest.fn(async () => ({ updated: true })));
jest.mock("@services/interface-disable", () => jest.fn(async () => ({ updated: true })));
jest.mock("@services/interface-protect", () => jest.fn(async () => ({ updated: true })));
jest.mock("@services/interface-unprotect", () => jest.fn(async () => ({ updated: true })));
jest.mock("@services/interface-setvlantrunk", () => jest.fn(async () => ({ updated: true })));
jest.mock("@services/interface-setvlanaccess", () => jest.fn(async () => ({ updated: true })));
jest.mock("@services/interface-rename", () => jest.fn(async () => ({ updated: true })));
jest.mock("@services/interface-poe", () => jest.fn(async () => ({ updated: true })));

const interfaceRouter = require("./interface");

describe("interface routes", () => {
    const app = express();
    app.use(express.json());
    app.use("/", interfaceRouter);

    test("GET /:interfaceId should return success response", async () => {
        const response = await request(app).get("/123");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("data");
    });

    test("POST /setvlantrunk/:interfaceId should return success response", async () => {
        const response = await request(app)
            .post("/setvlantrunk/123")
            .send({ untaggedVlan: 1, taggedVlans: [2, 3] });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("data");
    });
});
