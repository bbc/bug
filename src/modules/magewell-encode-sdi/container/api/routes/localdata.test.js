const express = require("express");
const request = require("supertest");

const mockLocaldataSet = jest.fn(async (body) => body);
const mockLocaldataPending = jest.fn(async () => true);

jest.mock("@services/localdata-set", () => (...args) => mockLocaldataSet(...args));
jest.mock("@services/localdata-pending", () => (...args) => mockLocaldataPending(...args));

const router = require("./localdata");

describe("localdata routes", () => {
    const app = express();
    app.use(express.json());
    app.use("/", router);

    beforeEach(() => {
        mockLocaldataSet.mockClear();
        mockLocaldataPending.mockClear();
    });

    test("POST / should return success response", async () => {
        const payload = { audio: { kbps: 128 } };
        const response = await request(app).post("/").send(payload);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            data: payload,
        });
        expect(mockLocaldataSet).toHaveBeenCalledWith(payload);
    });

    test("GET /checkpending should return success response", async () => {
        const response = await request(app).get("/checkpending");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            data: true,
        });
    });
});