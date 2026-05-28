const express = require("express");
const request = require("supertest");

jest.mock("@services/destination-update", () => jest.fn(async () => true));

const router = require("./destination");

describe("destination routes", () => {
    const app = express();
    app.use(express.json());
    app.use("/", router);

    test("PUT /:programHandle/:groupId/:connectionId returns success", async () => {
        const response = await request(app).put("/prg-1/1/2").send({});
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
    });
});
