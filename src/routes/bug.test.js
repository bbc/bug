const request = require("supertest");
const system = require("@bin/api");

afterAll(async () => {
    await new Promise((resolve) => setTimeout(() => resolve(), 500));
});

describe("Test the '/api/bug/quote' route", () => {
    test("Test the '/quote' response status", async (done) => {
        const response = await request(system).get("/api/bug/quote");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data).not.toBe("");
        done();
    });
});
