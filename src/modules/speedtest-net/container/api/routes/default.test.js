const express = require("express");
const request = require("supertest");
const router = require("./default");

describe("default route", () => {
    const app = express();
    app.use("/", router);

    test("returns 404 for unknown route", async () => {
        const response = await request(app).get("/missing?foo=bar");

        expect(response.statusCode).toBe(404);
        expect(response.body).toMatchObject({
            request_method: "GET",
            request_params: { foo: "bar" },
            error: "Invalid API route, check the API documentation.",
        });
    });
});
