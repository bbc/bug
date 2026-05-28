const express = require("express");
const request = require("supertest");

jest.mock("@services/dhcpserver-list", () => jest.fn(async () => ([])));

const router = require("./capabilities");

describe("capabilities routes", () => {
    const app = express();
    app.use("/", router);

    test("GET /dhcp-server returns success", async () => {
        const response = await request(app).get("/dhcp-server");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });
});
