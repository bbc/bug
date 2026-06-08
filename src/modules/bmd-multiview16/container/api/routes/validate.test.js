const express = require("express");
const request = require("supertest");

jest.mock("@services/validate-address", () => jest.fn(async () => ({ valid: true })));
jest.mock("@services/validate-port", () => jest.fn(async () => ({ valid: true })));

const router = require("./validate");

describe("validate routes", () => {
    const app = express();
    app.use(express.json());
    app.use("/", router);

    test("POST /address returns success", async () => {
        const response = await request(app).post("/address").send({ address: "127.0.0.1" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("POST /port returns success", async () => {
        const response = await request(app).post("/port").send({ address: "127.0.0.1", port: 9990 });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });
});
