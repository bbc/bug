const express = require("express");
const request = require("supertest");

jest.mock("@services/codec-list", () => jest.fn());
jest.mock("@services/codec-get", () => jest.fn());
jest.mock("@services/codec-getoptions", () => jest.fn());

const codecList = require("@services/codec-list");
const codecGet = require("@services/codec-get");
const codecGetOptions = require("@services/codec-getoptions");
const router = require("./codec");

describe("codec routes", () => {
    let app;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());
        app.use("/", router);
        app.use((err, req, res, next) => {
            res.status(err.statusCode || 500).json({
                status: "error",
                message: err.message || "Internal Server Error",
            });
        });
    });

    test("ALL / returns filtered codec list", async () => {
        codecList.mockResolvedValue([{ id: "codec-1" }]);

        const payload = { sortField: "name", sortDirection: "asc", filters: { zone: ["bcn"] } };
        const response = await request(app).post("/").send(payload);

        expect(codecList).toHaveBeenCalledWith("name", "asc", { zone: ["bcn"] });
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            data: [{ id: "codec-1" }],
        });
    });

    test("GET /:codecId returns codec details", async () => {
        codecGet.mockResolvedValue({ id: "codec-2" });

        const response = await request(app).get("/codec-2");

        expect(codecGet).toHaveBeenCalledWith("codec-2");
        expect(response.body).toEqual({
            status: "success",
            data: { id: "codec-2" },
        });
    });

    test("GET /getoptions/:fieldName returns field options", async () => {
        codecGetOptions.mockResolvedValue(["aac", "rtp"]);

        const response = await request(app).get("/getoptions/capabilities");

        expect(codecGetOptions).toHaveBeenCalledWith("capabilities");
        expect(response.body).toEqual({
            status: "success",
            data: ["aac", "rtp"],
        });
    });

    test("ALL / forwards list failures", async () => {
        codecList.mockRejectedValue(new Error("boom"));

        const response = await request(app).post("/").send({});

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
            status: "error",
            message: "boom",
        });
    });
});
