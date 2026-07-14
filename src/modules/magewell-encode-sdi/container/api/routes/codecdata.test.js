const express = require("express");
const request = require("supertest");

jest.mock("@services/codecdata-get", () => jest.fn(async () => ({ name: "Codec" })));

const router = require("./codecdata");

describe("codecdata routes", () => {
    const app = express();
    app.use("/", router);

    test("GET / should return success response", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            data: { name: "Codec" },
        });
    });
});