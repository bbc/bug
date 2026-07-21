const express = require("express");
const request = require("supertest");

jest.mock("@services/validate-address", () => jest.fn(async () => ({ valid: true })));
jest.mock("@services/validate-auth", () => jest.fn(async () => ({ valid: true })));
jest.mock("@services/validate-snmp", () => jest.fn(async () => ({ valid: true })));

const validateRouter = require("./validate");

describe("validate routes", () => {
    const app = express();
    app.use(express.json());
    app.use("/", validateRouter);

    test("POST /address should return success response", async () => {
        const response = await request(app).post("/address").send({ address: "10.0.0.1" });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("data");
    });

    test("POST /password should return success response", async () => {
        const response = await request(app).post("/password").send({ password: "secret" });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("data");
    });
});
