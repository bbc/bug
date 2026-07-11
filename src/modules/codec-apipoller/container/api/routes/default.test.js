const express = require("express");
const request = require("supertest");

const router = require("./default");

describe("default routes", () => {
    test("returns 404 payload for unknown route", async () => {
        const app = express();
        app.use("/", router);

        const response = await request(app).get("/missing").query({ test: "1" });

        expect(response.statusCode).toBe(404);
        expect(response.body.request_url).toEqual(expect.stringContaining("/missing?test=1"));
        expect(response.body.request_method).toBe("GET");
        expect(response.body.request_params).toEqual({ test: "1" });
        expect(response.body.error).toBe("Invalid API route, check the API documentation.");
    });
});
