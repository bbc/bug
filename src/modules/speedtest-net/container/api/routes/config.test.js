const express = require("express");
const request = require("supertest");

jest.mock("@core/config-get", () => jest.fn());
jest.mock("@core/config-put", () => jest.fn());

const configGet = require("@core/config-get");
const configPut = require("@core/config-put");
const router = require("./config");

describe("config routes", () => {
    let app;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());
        app.use((req, res, next) => {
            req.workers = { pushConfig: jest.fn() };
            next();
        });
        app.use("/", router);
    });

    test("GET / returns config payload", async () => {
        configGet.mockResolvedValue({ enabled: true });

        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            data: { enabled: true },
        });
    });

    test("GET / returns error payload when config fetch fails", async () => {
        configGet.mockRejectedValue(new Error("boom"));

        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "error",
            message: "Failed to fetch panel config",
        });
    });

    test("PUT / updates config with workers and body", async () => {
        const payload = { address: "10.0.0.5" };
        configPut.mockResolvedValue(true);

        const response = await request(app).put("/").send(payload);

        expect(response.statusCode).toBe(200);
        expect(configPut).toHaveBeenCalledTimes(1);
        expect(configPut).toHaveBeenCalledWith(expect.any(Object), payload);
        expect(response.body).toEqual({
            status: "success",
            data: true,
        });
    });

    test("PUT / returns error payload when update fails", async () => {
        configPut.mockRejectedValue(new Error("boom"));

        const response = await request(app).put("/").send({ address: "10.0.0.6" });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "error",
            message: "Failed to update panel config",
        });
    });
});
