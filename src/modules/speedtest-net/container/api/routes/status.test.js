const express = require("express");
const request = require("supertest");

jest.mock("../../services/status-get", () => jest.fn());

const statusGet = require("../../services/status-get");
const router = require("./status");

describe("status routes", () => {
    const app = express();
    app.use(express.json());
    app.use("/", router);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("GET / returns success payload", async () => {
        statusGet.mockResolvedValue([{ running: false }]);

        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            data: [{ running: false }],
        });
    });
});
