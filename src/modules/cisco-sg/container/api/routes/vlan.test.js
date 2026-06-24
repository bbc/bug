const express = require("express");
const request = require("supertest");

jest.mock("@services/vlan-list", () => jest.fn(async () => ([{ id: 1, name: "default" }])));

const vlanRouter = require("./vlan");

describe("vlan routes", () => {
    const app = express();
    app.use("/", vlanRouter);

    test("GET / should return success response", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("data");
    });
});
