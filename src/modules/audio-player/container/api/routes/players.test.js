const express = require("express");
const request = require("supertest");

jest.mock("@services/player-list", () => jest.fn(async () => ({ abc: { title: "One" } })));
jest.mock("@services/player-details", () => jest.fn(async () => ({ title: "One" })));
jest.mock("@services/player-add", () => jest.fn(async () => true));
jest.mock("@services/player-update", () => jest.fn(async () => true));
jest.mock("@services/player-delete", () => jest.fn(async () => true));

const router = require("./players");

describe("players routes", () => {
    const app = express();
    app.use(express.json());
    app.use("/", router);

    test("GET / returns success", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("GET /:playerId returns success", async () => {
        const response = await request(app).get("/abc");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("PUT /:playerId returns success", async () => {
        const response = await request(app).put("/abc").send({ title: "Two" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("POST / returns success", async () => {
        const response = await request(app).post("/").send({ title: "One", source: "http://a" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });

    test("DELETE /:playerId returns success", async () => {
        const response = await request(app).delete("/abc");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });
});
