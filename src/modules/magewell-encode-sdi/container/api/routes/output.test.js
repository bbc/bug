const express = require("express");
const request = require("supertest");

const mockOutputAdd = jest.fn(async () => [{ id: 0 }]);
const mockOutputDelete = jest.fn(async () => true);

jest.mock("@services/output-add", () => (...args) => mockOutputAdd(...args));
jest.mock("@services/output-delete", () => (...args) => mockOutputDelete(...args));

const router = require("./output");

describe("output routes", () => {
    const app = express();
    app.use("/", router);

    beforeEach(() => {
        mockOutputAdd.mockClear();
        mockOutputDelete.mockClear();
    });

    test("POST / should return success response", async () => {
        const response = await request(app).post("/");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            data: [{ id: 0 }],
        });
    });

    test("DELETE /:outputIndex should pass output 0 through to the service", async () => {
        const response = await request(app).delete("/0");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            data: true,
        });
        expect(mockOutputDelete).toHaveBeenCalledWith("0");
    });
});