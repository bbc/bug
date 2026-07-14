const express = require("express");
const request = require("supertest");

jest.mock("@services/codecstatus-get", () => jest.fn(async () => ({ live: true })));

const router = require("./codecstatus");

describe("codecstatus routes", () => {
    const app = express();
    app.use("/", router);

    test("GET / should return success response", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            data: { live: true },
        });
    });
});