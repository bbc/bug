const express = require("express");
const request = require("supertest");

jest.mock("@services/videohub-getsources", () => jest.fn(async () => true));
jest.mock("@services/videohub-getallsources", () => jest.fn(async () => true));
jest.mock("@services/button-remove", () => jest.fn(async () => true));
jest.mock("@services/button-seticon", () => jest.fn(async () => true));

const router = require("./sources");

describe("sources routes", () => {
    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
        req.workers = {};
        next();
    });
    app.use("/", router);

    test("GET / returns success", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("POST /seticon/:index returns success", async () => {
        const response = await request(app).post("/seticon/1").send({});
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("GET /:destination?/:group? returns success", async () => {
        const response = await request(app).get("/1/1");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("POST /:destination?/:group? returns success", async () => {
        const response = await request(app).post("/1/1").send({});
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("DELETE /:groupIndex/:index returns success", async () => {
        const response = await request(app).delete("/1/1");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });
});
