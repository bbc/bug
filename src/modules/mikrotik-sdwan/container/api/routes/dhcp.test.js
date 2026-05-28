const express = require("express");
const request = require("supertest");

jest.mock("@services/dhcplease-list", () => jest.fn(async () => ([{ id: "lease-1" }])));
jest.mock("@services/dhcpnetwork-list", () => jest.fn(async () => ([{ id: "net-1" }])));
jest.mock("@services/dhcpserver-list", () => jest.fn(async () => ([{ id: "server-1" }])));

const dhcpRouter = require("./dhcp");

describe("dhcp routes", () => {
    const app = express();
    app.use(express.json());
    app.use("/", dhcpRouter);

    test("POST /lease returns success response", async () => {
        const response = await request(app).post("/lease").send({ filters: {} });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("data");
    });

    test("GET /network returns success response", async () => {
        const response = await request(app).get("/network");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("data");
    });

    test("GET /server returns success response", async () => {
        const response = await request(app).get("/server");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("data");
    });
});
