const express = require("express");
const request = require("supertest");

jest.mock("@services/route-list", () => jest.fn(async () => ([])));
jest.mock("@services/route-rename", () => jest.fn(async () => true));
jest.mock("@services/route-enable", () => jest.fn(async () => true));
jest.mock("@services/route-disable", () => jest.fn(async () => true));

const routeRouter = require("./route");

describe("route routes", () => {
    const app = express();
    app.use(express.json());
    app.use("/", routeRouter);

    test("GET / returns success response", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("PUT /rename returns success response", async () => {
        const response = await request(app).put("/rename").send({ id: "*1", name: "wan-a" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("PUT /enable/:id returns success response", async () => {
        const response = await request(app).put("/enable/*1");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("PUT /disable/:id returns success response", async () => {
        const response = await request(app).put("/disable/*1");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });
});
