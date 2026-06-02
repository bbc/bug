const request = require("supertest");

jest.mock("@services/user-get", () => jest.fn(async () => ({ username: "tester" })));

const system = require("@bin/api");

describe("Test the '/api/logout/' endpoint", () => {
    test("Test the '/' POST route", async () => {
        const response = await request(system).post("/api/logout/");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
    });
});
