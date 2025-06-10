const request = require("supertest");
const system = require("@bin/api");

afterAll(async () => {
    await new Promise((resolve) => setTimeout(() => resolve(), 500));
});

describe("Test the '/api/system/' endpoint", () => {
    test("Test the '/hello' GET route", async () => {
        const response = await request(system).get("/api/system/hello");
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toEqual("Good morning sunshine, the earth says hello.");

    });
});
