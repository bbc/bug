const express = require("express");
const request = require("supertest");

jest.mock("@services/videohub-lock", () => jest.fn(async () => true));
jest.mock("@services/videohub-unlock", () => jest.fn(async () => true));
jest.mock("@services/videohub-forceunlock", () => jest.fn(async () => true));

const router = require("./lock");

describe("lock routes", () => {
    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
        req.workers = {};
        next();
    });
    app.use("/", router);

    test("GET /lock/:index returns success", async () => {
        const response = await request(app).get("/lock/1");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("GET /unlock/:index returns success", async () => {
        const response = await request(app).get("/unlock/1");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("GET /forceunlock/:index returns success", async () => {
        const response = await request(app).get("/forceunlock/1");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });
});
