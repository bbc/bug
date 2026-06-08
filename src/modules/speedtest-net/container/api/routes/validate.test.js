const express = require("express");
const request = require("supertest");

jest.mock("../../services/validate-address", () => jest.fn());

const validateAddress = require("../../services/validate-address");
const router = require("./validate");

describe("validate routes", () => {
    const app = express();
    app.use(express.json());
    app.use("/", router);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("POST /address validates request body", async () => {
        validateAddress.mockResolvedValue({ valid: true });

        const payload = { address: "8.8.8.8" };
        const response = await request(app).post("/address").send(payload);

        expect(response.statusCode).toBe(200);
        expect(validateAddress).toHaveBeenCalledWith(payload);
        expect(response.body).toEqual({
            status: "success",
            data: { valid: true },
        });
    });
});
