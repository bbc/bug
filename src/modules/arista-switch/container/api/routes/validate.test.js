const express = require("express");
const request = require("supertest");

jest.mock("@services/validate-address", () => jest.fn(async () => ({ valid: true })));
jest.mock("@services/validate-auth", () => jest.fn(async () => ({ valid: true })));

const router = require("./validate");

describe("validate routes", () => {
    const app = express();
    app.use(express.json());
    app.use("/", router);

    test("POST /address returns success", async () => {
        const response = await request(app).post("/address").send({});
        expect(response.statusCode).toBe(200);
    });

    test("POST /username returns success", async () => {
        const response = await request(app).post("/username").send({});
        expect(response.statusCode).toBe(200);
    });

    test("POST /password returns success", async () => {
        const response = await request(app).post("/password").send({});
        expect(response.statusCode).toBe(200);
    });
});
