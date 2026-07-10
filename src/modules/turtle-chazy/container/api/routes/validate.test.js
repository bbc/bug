const express = require("express");
const request = require("supertest");

const mockValidateAddress = jest.fn(async () => ({ valid: true }));
jest.mock("../../services/validate-address", () => (...args) => mockValidateAddress(...args));

const router = require("./validate");

describe("validate routes", () => {
    const app = express();
    app.use(express.json());
    app.use("/", router);

    beforeEach(() => {
        mockValidateAddress.mockClear();
    });

    test("POST /address returns success", async () => {
        const payload = { address: "127.0.0.1" };
        const response = await request(app).post("/address").send(payload);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(mockValidateAddress).toHaveBeenCalledWith(payload);
    });

});
